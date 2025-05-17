import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, Row, Col, Button, ButtonGroup } from 'reactstrap';
import Chart, {
  CommonSeriesSettings,
  Series,
  ValueAxis,
  Export,
  Title,
  Legend,
  Tooltip,
  Grid,
  ArgumentAxis,
  Label
} from 'devextreme-react/chart';
import PieChart, {
  Series as PieSeries,
  Label as PieLabel,
  Connector,
  Size,
  Export as PieExport
} from 'devextreme-react/pie-chart';
import { fetchStatistiquesGlobales, fetchStatistiquesParEtat, fetchStatistiquesParClient, fetchStatistiquesParModule, fetchStatistiquesParEquipe, fetchStatistiquesParCollaborateur, fetchStatistiquesParPeriode, fetchStatistiquesPerformance } from '../../Redux/Actions/Statistique/Statistique';
import notify from 'devextreme/ui/notify';
import { notifyOptions } from '../../Helper/Config';
import '../../assests/css/lineChart.css';

const StatistiqueChart = () => {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.intl.messages);
    
    // États pour stocker les données des statistiques
    const [statsGlobales, setStatsGlobales] = useState(null);
    const [statsEtat, setStatsEtat] = useState([]);
    const [statsClient, setStatsClient] = useState([]);
    const [statsModule, setStatsModule] = useState([]);
    const [statsEquipe, setStatsEquipe] = useState([]);
    const [statsCollaborateur, setStatsCollaborateur] = useState([]);
    const [statsPeriode, setStatsPeriode] = useState([]);
    const [statsPerformance, setStatsPerformance] = useState([]);
    
    // État pour le type de graphique actif
    const [activeChart, setActiveChart] = useState('etat');
    // État pour la période sélectionnée
    const [selectedPeriode, setSelectedPeriode] = useState('mois');
    // État pour le type de visualisation
    const [chartType, setChartType] = useState('bar');
    
    // Chargement initial des données
    useEffect(() => {
        loadStatistiques();
    }, []);
    
    // Chargement des données lorsque la période change
    useEffect(() => {
        if (activeChart === 'periode') {
            loadStatistiquesPeriode(selectedPeriode);
        }
    }, [selectedPeriode, activeChart]);
    
    // Fonction pour charger toutes les statistiques
    const loadStatistiques = async () => {
        try {
            // Statistiques globales
            const globales = await dispatch(fetchStatistiquesGlobales());
            setStatsGlobales(globales);
            
            // Statistiques par état
            const etat = await dispatch(fetchStatistiquesParEtat());
            setStatsEtat(etat || []);
            
            // Statistiques par client
            const client = await dispatch(fetchStatistiquesParClient());
            setStatsClient(client || []);
            
            // Statistiques par module
            const module = await dispatch(fetchStatistiquesParModule());
            setStatsModule(module || []);
            
            // Statistiques par équipe
            const equipe = await dispatch(fetchStatistiquesParEquipe());
            setStatsEquipe(equipe || []);
            
            // Statistiques par collaborateur
            const collaborateur = await dispatch(fetchStatistiquesParCollaborateur());
            setStatsCollaborateur(collaborateur || []);
            
            // Statistiques de performance
            const performance = await dispatch(fetchStatistiquesPerformance());
            setStatsPerformance(performance || []);
            
            // Charger les statistiques par période par défaut (mois)
            loadStatistiquesPeriode(selectedPeriode);
            
        } catch (error) {
            console.error("Erreur lors du chargement des statistiques:", error);
            notify(messages.errorLoadingStats || "Erreur lors du chargement des statistiques", "error", notifyOptions);
        }
    };
    
    // Fonction pour charger les statistiques par période
    const loadStatistiquesPeriode = async (periode) => {
        try {
            const data = await dispatch(fetchStatistiquesParPeriode(periode));
            setStatsPeriode(data || []);
        } catch (error) {
            console.error(`Erreur lors du chargement des statistiques par ${periode}:`, error);
            notify(messages.errorLoadingPeriodStats || "Erreur lors du chargement des statistiques par période", "error", notifyOptions);
        }
    };
    
    // Préparation des données pour le graphique actif
    const getChartData = () => {
        let data = [];
        let title = '';
        
        // Fonction utilitaire pour normaliser les données
        const normalizeData = (items, labelKey, valueKey) => {
            if (!Array.isArray(items) || items.length === 0) {
                return [];
            }
            
            return items.map(item => {
                if (!item) return { label: 'Inconnu', value: 0, argument: 'Inconnu', val: 0 };
                
                // Extraire la valeur et s'assurer qu'elle est un nombre
                const rawValue = item[valueKey] || item.count || item.value || item.valeur || 0;
                const numericValue = typeof rawValue === 'number' ? rawValue : parseInt(rawValue, 10) || 0;
                
                // Extraire le libellé et s'assurer qu'il est une chaîne
                const label = item[labelKey] || item.label || 'Inconnu';
                
                return {
                    label: label,
                    value: numericValue,
                    argument: label,
                    val: numericValue
                };
            });
        };
        
        switch (activeChart) {
            case 'etat':
                data = normalizeData(statsEtat, 'label', 'count');
                title = messages.demandesParEtat || 'Demandes par état';
                break;
                
            case 'client':
                data = normalizeData(statsClient, 'label', 'count');
                title = messages.demandesParClient || 'Demandes par client';
                break;
                
            case 'module':
                data = normalizeData(statsModule, 'label', 'count');
                title = messages.demandesParModule || 'Demandes par module';
                break;
                
            case 'equipe':
                data = normalizeData(statsEquipe, 'label', 'count');
                title = messages.demandesParEquipe || 'Demandes par équipe';
                break;
                
            case 'collaborateur':
                data = normalizeData(statsCollaborateur, 'label', 'count');
                title = messages.demandesParCollaborateur || 'Demandes par collaborateur';
                break;
                
            case 'periode':
                data = normalizeData(statsPeriode, 'label', 'count');
                title = messages.demandesParPeriode || `Demandes par ${selectedPeriode}`;
                break;
                
            case 'performance':
                data = normalizeData(statsPerformance, 'label', 'value');
                title = messages.performance || 'Performance';
                break;
                
            default:
                data = normalizeData(statsEtat, 'label', 'count');
                title = messages.demandesParEtat || 'Demandes par état';
        }
        
        return { data, title };
    };
    
    // Fonction pour personnaliser les tooltips
    const customizeTooltip = (pointInfo) => {
        // Calculer le pourcentage si nécessaire
        let total = 0;
        pointInfo.series.getPoints().forEach(p => {
            total += p.value;
        });
        
        // Arrondir le pourcentage à l'entier le plus proche
        const percentage = Math.round((pointInfo.value / total) * 100);
        
        return {
            text: `${pointInfo.argumentText || pointInfo.argument}: ${pointInfo.valueText || pointInfo.value} (${percentage}%)`
        };
    };
    
    // Fonction pour personnaliser les étiquettes du graphique en camembert
    const customizePieLabel = (pointInfo) => {
        // Arrondir le pourcentage à l'entier le plus proche
        const percentage = Math.round(pointInfo.percent * 100);
        return `${pointInfo.argument}: ${pointInfo.value} (${percentage}%)`;
    };
    
    // Rendu du graphique en fonction du type sélectionné
    const renderChart = () => {
        const { data, title } = getChartData();
        
        // Vérifier si les données sont vides
        if (!data || data.length === 0) {
            return (
                <div className="text-center p-5">
                    <h4>{messages.noData || 'Aucune donnée disponible'}</h4>
                </div>
            );
        }
        
        if (chartType === 'pie') {
            return (
                <PieChart
                    id="pie-chart"
                    dataSource={data}
                    palette="Bright"
                    title={title}
                    resolveLabelOverlapping="shift"
                >
                    <PieSeries
                        argumentField="argument"
                        valueField="value"
                    >
                        <PieLabel
                            visible={true}
                            position="columns"
                            customizeText={customizePieLabel}
                        >
                            <Connector visible={true} width={1} />
                        </PieLabel>
                    </PieSeries>
                    <Size width="100%" height={400} />
                    <Legend
                        orientation="horizontal"
                        itemTextPosition="right"
                        horizontalAlignment="center"
                        verticalAlignment="bottom"
                        columnCount={4}
                    />
                    <PieExport enabled={true} />
                    <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
                </PieChart>
            );
        } else {
            return (
                <Chart
                    id="bar-chart"
                    dataSource={data}
                    palette="Harmony Light"
                    title={title}
                >
                    <CommonSeriesSettings
                        argumentField="argument"
                        valueField="value"
                        type={chartType === 'bar' ? 'bar' : 'line'}
                        ignoreEmptyPoints={true}
                    />
                    <Series
                        valueField="value"
                        argumentField="argument"
                        name={title}
                    />
                    <ValueAxis>
                        <Label format="decimal" />
                        <Grid visible={true} />
                    </ValueAxis>
                    <ArgumentAxis>
                        <Label wordWrap="none" overlappingBehavior="rotate" rotationAngle={45} />
                        <Grid visible={true} />
                    </ArgumentAxis>
                    <Legend visible={false} />
                    <Export enabled={true} />
                    <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
                </Chart>
            );
        }
    };
    
    // Rendu des statistiques globales
    const renderGlobalStats = () => {
        if (!statsGlobales) return null;
        
        return (
            <Row className="mb-4">
                <Col md="3">
                    <Card className="bg-gradient-primary text-white mb-3">
                        <CardBody className="p-3">
                            <div className="text-center">
                                <h5>{messages.totalDemandes || 'Total des demandes'}</h5>
                                <h2>{statsGlobales.totalDemandes || 0}</h2>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="3">
                    <Card className="bg-gradient-success text-white mb-3">
                        <CardBody className="p-3">
                            <div className="text-center">
                                <h5>{messages.demandesTerminees || 'Demandes terminées'}</h5>
                                <h2>{statsGlobales.demandesTerminees || 0}</h2>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="3">
                    <Card className="bg-gradient-warning text-white mb-3">
                        <CardBody className="p-3">
                            <div className="text-center">
                                <h5>{messages.demandesEnCours || 'Demandes en cours'}</h5>
                                <h2>{statsGlobales.demandesEnCours || 0}</h2>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="3">
                    <Card className="bg-gradient-danger text-white mb-3">
                        <CardBody className="p-3">
                            <div className="text-center">
                                <h5>{messages.demandesNonAssignees || 'Demandes non assignées'}</h5>
                                <h2>{statsGlobales.demandesNonAssignees || 0}</h2>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    };
    
    return (
        <div className="statistique-container">
            {/* Statistiques globales */}
            {renderGlobalStats()}
            
            {/* Sélection du type de graphique */}
            <Row className="mb-4">
                <Col md="8">
                    <ButtonGroup>
                        <Button 
                            color={activeChart === 'etat' ? 'primary' : 'secondary'} 
                            onClick={() => setActiveChart('etat')}
                        >
                            {messages.parEtat || 'Par état'}
                        </Button>
                        <Button 
                            color={activeChart === 'client' ? 'primary' : 'secondary'} 
                            onClick={() => setActiveChart('client')}
                        >
                            {messages.parClient || 'Par client'}
                        </Button>
                        <Button 
                            color={activeChart === 'module' ? 'primary' : 'secondary'} 
                            onClick={() => setActiveChart('module')}
                        >
                            {messages.parModule || 'Par module'}
                        </Button>
                        <Button 
                            color={activeChart === 'equipe' ? 'primary' : 'secondary'} 
                            onClick={() => setActiveChart('equipe')}
                        >
                            {messages.parEquipe || 'Par équipe'}
                        </Button>
                        <Button 
                            color={activeChart === 'collaborateur' ? 'primary' : 'secondary'} 
                            onClick={() => setActiveChart('collaborateur')}
                        >
                            {messages.parCollaborateur || 'Par collaborateur'}
                        </Button>
                        <Button 
                            color={activeChart === 'periode' ? 'primary' : 'secondary'} 
                            onClick={() => setActiveChart('periode')}
                        >
                            {messages.parPeriode || 'Par période'}
                        </Button>
                    </ButtonGroup>
                </Col>
                <Col md="4" className="text-right">
                    <ButtonGroup>
                        <Button 
                            color={chartType === 'bar' ? 'info' : 'secondary'} 
                            onClick={() => setChartType('bar')}
                        >
                            <i className="fas fa-chart-bar"></i>
                        </Button>
                        <Button 
                            color={chartType === 'line' ? 'info' : 'secondary'} 
                            onClick={() => setChartType('line')}
                        >
                            <i className="fas fa-chart-line"></i>
                        </Button>
                        <Button 
                            color={chartType === 'pie' ? 'info' : 'secondary'} 
                            onClick={() => setChartType('pie')}
                        >
                            <i className="fas fa-chart-pie"></i>
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
            
            {/* Sélection de la période si nécessaire */}
            {activeChart === 'periode' && (
                <Row className="mb-4">
                    <Col md="12">
                        <ButtonGroup>
                            <Button 
                                color={selectedPeriode === 'jour' ? 'primary' : 'secondary'} 
                                onClick={() => setSelectedPeriode('jour')}
                            >
                                {messages.jour || 'Jour'}
                            </Button>
                            <Button 
                                color={selectedPeriode === 'semaine' ? 'primary' : 'secondary'} 
                                onClick={() => setSelectedPeriode('semaine')}
                            >
                                {messages.semaine || 'Semaine'}
                            </Button>
                            <Button 
                                color={selectedPeriode === 'mois' ? 'primary' : 'secondary'} 
                                onClick={() => setSelectedPeriode('mois')}
                            >
                                {messages.mois || 'Mois'}
                            </Button>
                            <Button 
                                color={selectedPeriode === 'trimestre' ? 'primary' : 'secondary'} 
                                onClick={() => setSelectedPeriode('trimestre')}
                            >
                                {messages.trimestre || 'Trimestre'}
                            </Button>
                            <Button 
                                color={selectedPeriode === 'annee' ? 'primary' : 'secondary'} 
                                onClick={() => setSelectedPeriode('annee')}
                            >
                                {messages.annee || 'Année'}
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            )}
            
            {/* Affichage du graphique */}
            <Card className="shadow">
                <CardBody>
                    {renderChart()}
                </CardBody>
            </Card>
        </div>
    );
};

export default StatistiqueChart;
