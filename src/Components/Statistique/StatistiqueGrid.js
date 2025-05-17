// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Card, CardHeader, CardBody } from 'reactstrap';
// import TableGrid from '../ComponentHelper/TableGrid';
// import { fetchStatistiquesDetails } from '../../Redux/Actions/Statistique/Statistique';
// import notify from 'devextreme/ui/notify';
// import { notifyOptions } from '../../Helper/Config';

// const StatistiqueGrid = () => {
//     const dispatch = useDispatch();
//     const messages = useSelector(state => state.intl.messages);
//     const [dataSource, setDataSource] = useState([]);
//     const dataGridRef = React.createRef();

//     useEffect(() => {
//         loadStatistiquesDetails();
//     }, []);

//     const loadStatistiquesDetails = async () => {
//         try {
//             const data = await dispatch(fetchStatistiquesDetails());
//             setDataSource(data);
//         } catch (error) {
//             console.error("Erreur lors du chargement des détails des statistiques:", error);
//             notify(messages.errorLoadingStatsDetails || "Erreur lors du chargement des détails des statistiques", "error", notifyOptions);
//         }
//     };

//     const columns = [
//         { dataField: 'id', caption: 'ID', visible: false },
//         { dataField: 'reference', caption: messages.reference || 'Référence' },
//         { dataField: 'client', caption: messages.client || 'Client' },
//         { dataField: 'module', caption: messages.module || 'Module' },
//         { dataField: 'etat', caption: messages.etat || 'État' },
//         { dataField: 'dateCreation', caption: messages.dateCreation || 'Date de création', dataType: 'date' },
//         { dataField: 'dateCloture', caption: messages.dateCloture || 'Date de clôture', dataType: 'date' },
//         { dataField: 'duree', caption: messages.duree || 'Durée (jours)', dataType: 'number' }
//     ];

//     return (
//         <Card className="shadow">
//             <CardHeader className="border-0">
//                 <h3 className="mb-0">{messages.detailsStatistiques || 'Détails des statistiques'}</h3>
//             </CardHeader>
//             <CardBody>
//                 <TableGrid
//                     dataGrid={dataGridRef}
//                     customStore={dataSource}
//                     keyExpr="id"
//                     fileName="StatistiquesDetails"
//                     columns={columns}
//                     templates={[]} // Fournir un tableau vide au lieu de undefined
//                 />
//             </CardBody>
//         </Card>
//     );
// };

// export default StatistiqueGrid;