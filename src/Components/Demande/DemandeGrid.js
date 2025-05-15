import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
    handleOpenAddMode,
    handleOpenEditMode,
    handleOpenDeleteMode,
    handleOpenConsultMode
} from "../../Redux/Actions/Demande/DemandeAside";
import { handleOpenModal } from "../../Redux/Actions/ComponentTable/ModalImpression";
import notify from "devextreme/ui/notify";
import { notifyOptions } from '../../Helper/Config';
import { loadMessages } from "devextreme/localization";
import arMessages from "../../i18n/datagrid_ar.json";
import enMessages from "devextreme/localization/messages/en";
import frMessages from "devextreme/localization/messages/fr";
import { getAllDemandes, getDemandeByCode } from "../../Redux/Actions/Demande/Demande";
import HelperGrid from '../../Helper/HelperGrid';
import TableGrid from '../ComponentHelper/TableGrid';
import { getEtatLabel, getPrioriteLabel } from '../../Helper/Enums/Demande';
import Ressources from '../../Helper/Ressources';
import DemandeAssignationModal from './DemandeAssignationModal';
import axios from 'axios';

// Chargement des messages de localisation
loadMessages(arMessages);
loadMessages(enMessages);
loadMessages(frMessages);

let selectionChangedRaised;

const DemandeGrid = () => {
    const dispatch = useDispatch();
    const DemandesReducer = useSelector(state => state.DemandesReducer);
    const messages = useSelector(state => state.intl.messages);
    const dataGrid = useRef(null);
    
    // État pour gérer l'ouverture du modal d'assignation et le chargement
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedDemande, setSelectedDemande] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Assurez-vous que les données sont chargées avant de les utiliser
    useEffect(() => {
        dispatch(getAllDemandes(dataGrid.current));
    }, [dispatch]);
    
    // Fonction pour rafraîchir la grille de données
    const refreshDataGrid = useCallback(() => {
        dispatch(getAllDemandes(dataGrid.current));
    }, [dispatch]);
    
    // Gestion de la sélection des lignes
    const onSelectionChanged = useCallback(({ selectedRowsData }) => {
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, DemandesReducer);
    }, [DemandesReducer]);
    
    // Gestion du clic sur une ligne
    const onRowClick = useCallback(e => {
        if (!selectionChangedRaised) {
            const dataGrid = e.component;
            const keys = dataGrid.getSelectedRowKeys();
            if (keys.length > 0) {
                dataGrid.deselectRows(keys);
            }
        }
        selectionChangedRaised = false;
    }, []);
    
    // Fonction pour ajouter une nouvelle demande
    const onClickBtnAdd = useCallback(() => {
        dispatch(handleOpenAddMode(refreshDataGrid));
    }, [dispatch, refreshDataGrid]);
    
    // Fonction pour éditer une demande
    const onClickBtnEdit = useCallback(() => {
        if (!dataGrid.current) return;
        
        const dataGridInstance = dataGrid.current.instance;
        const selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
        
        if (!selectedRowKeys) {
            notify(messages.selectDemandeToEdit || "Veuillez sélectionner une demande à modifier", "warning", notifyOptions);
            return;
        }
        
        dispatch(getDemandeByCode(selectedRowKeys))
            .then(data => {
                dispatch(handleOpenEditMode(data, refreshDataGrid));
            })
            .catch(error => {
                let errorMsg = error.message || messages.errorFetchingDemande || "Erreur lors de la récupération des détails de la demande";
                notify(errorMsg, "error", notifyOptions);
                console.error("Erreur:", error);
            });
    }, [dispatch, messages, refreshDataGrid]);

    // Fonction pour affecter une demande
    const onClickBtnAffecte = useCallback(() => {
        if (!dataGrid.current) return;
        const dataGridInstance = dataGrid.current.instance;
        const selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
        
        if (!selectedRowKeys) {
            notify(messages.selectDemandeToAffect || "Veuillez sélectionner une demande à affecter", "warning", notifyOptions);
            return;
        }
        
        // Récupérer les détails de la demande avant d'ouvrir le modal
        dispatch(getDemandeByCode(selectedRowKeys))
            .then(data => {
                setSelectedDemande(data);
                setIsAssignModalOpen(true);
            })
            .catch(error => {
                notify(messages.errorFetchingDemande || "Erreur lors de la récupération des détails de la demande", "error", notifyOptions);
                console.error("Erreur:", error);
            });
    }, [dispatch, messages]);
    
    // Fonction pour désaffecter une demande
    const onClickBtnDesaffecte = useCallback(() => {
        if (!dataGrid.current) return;
        
        const dataGridInstance = dataGrid.current.instance;
        const selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
        
        if (!selectedRowKeys) {
            notify(messages.selectDemandeToUnassign || "Veuillez sélectionner une demande à désaffecter", "warning", notifyOptions);
            return;
        }
        
        // Confirmation avant désaffectation
        if (window.confirm(messages.confirmUnassign || "Êtes-vous sûr de vouloir désaffecter cette demande ?")) {
            setLoading(true);
            
            axios.delete(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.demandes}/${selectedRowKeys}/affectation`)
                .then(response => {
                    notify(messages.unassignSuccess || "Demande désaffectée avec succès", "success", notifyOptions);
                    refreshDataGrid();
                })
                .catch(error => {
                    console.error("Erreur lors de la désaffectation:", error);
                    let errorMessage = "Erreur lors de la désaffectation";
                    
                    if (error.response) {
                        if (error.response.status === 400 && error.response.data && error.response.data.message) {
                            errorMessage = error.response.data.message;
                        } else if (error.response.status === 404) {
                            errorMessage = "Demande non trouvée";
                        }
                    }
                    
                    notify(errorMessage, "error", notifyOptions);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [messages, refreshDataGrid]);
    
    // Fonction pour consulter une demande
    const onClickBtnConsult = useCallback(() => {
        if (!dataGrid.current) return;
        
        const dataGridInstance = dataGrid.current.instance;
        const selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
        
        if (!selectedRowKeys) {
            notify(messages.selectDemandeToConsult || "Veuillez sélectionner une demande à consulter", "warning", notifyOptions);
            return;
        }
        
        dispatch(getDemandeByCode(selectedRowKeys))
            .then(data => {
                dispatch(handleOpenConsultMode(data));
            })
            .catch(error => {
                notify(messages.errorFetchingDemande || "Erreur lors de la récupération des détails de la demande", "error", notifyOptions);
                console.error("Erreur:", error);
            });
    }, [dispatch, messages]);
    
    // Fonction pour supprimer une demande
    const onClickBtnDelete = useCallback(() => {
        if (!dataGrid.current) return;
        
        const dataGridInstance = dataGrid.current.instance;
        const selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
        
        if (!selectedRowKeys) {
            notify(messages.selectDemandeToDelete || "Veuillez sélectionner une demande à supprimer", "warning", notifyOptions);
            return;
        }
        
        dispatch(getDemandeByCode(selectedRowKeys))
            .then(data => {
                dispatch(handleOpenDeleteMode(data, refreshDataGrid));
            })
            .catch(error => {
                notify(messages.errorFetchingDemande || "Erreur lors de la récupération des détails de la demande", "error", notifyOptions);
                console.error("Erreur:", error);
            });
    }, [dispatch, messages, refreshDataGrid]);

    // Fonction appelée après une assignation réussie
    const handleAssignSuccess = useCallback((updatedDemande) => {
        refreshDataGrid();
        notify(messages.assignationSuccess || "Demande assignée avec succès", "success", notifyOptions);
    }, [refreshDataGrid, messages]);
    
    // Configuration de la barre d'outils
    const onToolbarPreparing = useCallback((e) => {
        const filtres = {
            filterRemove: {
                visible: true
            }
        };
        
        const buttons = {
            columnChooserButton: {
                visible: true,
            },
            refresh: {
                visible: true,
                action: refreshDataGrid
            },
            add: {
                visible: true,
                action: onClickBtnAdd
            },
            edit: {
                visible: true,
                action: onClickBtnEdit
            },
            affecte: {
                visible: true,
                action: onClickBtnAffecte
            },
            desaffecte: { // Nouveau bouton Désaffecter
                visible: true,
                action: onClickBtnDesaffecte
            },
            consult: {
                visible: true,
                action: onClickBtnConsult
            },
            delete: {
                visible: true,
                action: onClickBtnDelete
            },
            export_excel: {
                visible: true
            },
            print: {
                visible: true,
                action: () => dispatch(handleOpenModal())
            }
        };
        
        HelperGrid.handleToolbarPreparing(e, dataGrid, buttons, filtres, DemandesReducer);
    }, [dispatch, DemandesReducer, refreshDataGrid, onClickBtnAdd, onClickBtnEdit, onClickBtnAffecte, onClickBtnDesaffecte, onClickBtnConsult, onClickBtnDelete]);

    // Formatage de la date
    const formatDate = (data) => {
        if (!data.value) return '';
        const date = new Date(data.value);
        return date.toLocaleDateString();
    };

    // Formatage de l'état
    const formatEtat = (data) => {
        return getEtatLabel(data.value);
    };

    // Formatage de la priorité
    const formatPriorite = (data) => {
        return getPrioriteLabel(data.value);
    };

    // Formatage du client
    const formatClient = (data) => {
        return data.value && data.value.nom ? data.value.nom : '';
    };

    // Formatage du module
    const formatModule = (data) => {
        return data.value && data.value.designation ? data.value.designation : '';
    };

    // Formatage de l'équipe
    const formatEquipe = (data) => {
        return data.value && data.value.designation ? data.value.designation : '';
    };

    // Formatage du collaborateur
    const formatCollaborateur = (data) => {
        if (!data.value) return '';
        return `${data.value.prenom || ''} ${data.value.nom || ''}`.trim();
    };

    return (
        <>
            <TableGrid
                dataGrid={dataGrid}
                keyExpr="idDemande"
                customStore={HelperGrid.constructCustomStore(
                    `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.demandes}`,
                    'idDemande'
                )}
                onToolbarPreparing={onToolbarPreparing}
                onSelectionChanged={onSelectionChanged}
                onRowClick={onRowClick}
                fileName={messages.Demandes || "Demandes"}
                columns={[
                    { 
                        dataField: 'idDemande', 
                        caption: "ID", 
                        alignment: 'left',
                        //width: 70 
                    },
                    { 
                        dataField: 'etat', 
                        caption: messages.etat || "État",
                        customizeText: formatEtat
                    },
                    { 
                        dataField: 'priorite', 
                        caption: messages.priorite || "Priorité",
                        customizeText: formatPriorite
                    },
                    { 
                        dataField: 'description', 
                        caption: messages.description || "Description" 
                    },
                    { 
                        dataField: 'dateCreation', 
                        caption: messages.dateCreation || "Date de création",
                        dataType: 'date',
                        calculateCellValue: data => data.dateCreation,
                        customizeText: formatDate
                    },
                    // { 
                    //     dataField: 'dateEcheance', 
                    //     caption: messages.dateEcheance || "Date d'échéance",
                    //     dataType: 'date',
                    //     calculateCellValue: data => data.dateEcheance,
                    //     customizeText: formatDate
                    // },
                   
                    { 
                        dataField: 'client', 
                        caption: messages.client || "Client",
                        calculateCellValue: data => data.client,
                        customizeText: formatClient
                    },
                    { 
                        dataField: 'module', 
                        caption: messages.module || "Module",
                        calculateCellValue: data => data.module,
                        customizeText: formatModule
                    },
                    { 
                        dataField: 'equipe', 
                        caption: messages.equipe || "Équipe",
                        calculateCellValue: data => data.equipe,
                        customizeText: formatEquipe
                    },
                    { 
                        dataField: 'dateAffectationEquipe', 
                        caption: messages.dateAffectationEquipe || "Date d'affectation équipe",
                        dataType: 'date',
                        calculateCellValue: data => data.dateAffectationEquipe,
                        customizeText: formatDate
                    },
                    { 
                        dataField: 'collaborateur',
                        caption: messages.collaborateur || "Collaborateur",
                        calculateCellValue: (data) => {
                            // Vérifier si l'objet collaborateur existe et contient les propriétés nécessaires
                            if (data && data.collaborateur && data.collaborateur.prenom && data.collaborateur.nom) {
                                return `${data.collaborateur.prenom} ${data.collaborateur.nom}`.trim();
                            }
                            return '';
                        },
                        allowSorting: true,
                        allowFiltering: true
                    },
                    { 
                        dataField: 'dateAffectationCollaborateur', 
                        caption: messages.dateAffectationCollaborateur || "Date d'affectation collaborateur",
                        dataType: 'date',
                        calculateCellValue: data => data.dateAffectationCollaborateur,
                        customizeText: formatDate
                    },
                    { 
                        dataField: 'createur', 
                        caption: messages.createur || "Créateur",
                        calculateCellValue: data => data.createur,
                        customizeText: data => {
                            if (!data.value) return '';
                            return `${data.value.prenom || ''} ${data.value.nom || ''}`.trim();
                        }
                    }
                ]}
                templates={[]}
            />
            
            {/* Modal d'assignation */}
            <DemandeAssignationModal 
                isOpen={isAssignModalOpen}
                toggle={() => setIsAssignModalOpen(!isAssignModalOpen)}
                demande={selectedDemande}
                onSuccess={handleAssignSuccess}
            />
        </>
    );
};

export default DemandeGrid;
