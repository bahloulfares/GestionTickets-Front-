import React, { useRef, useEffect, useCallback } from 'react';
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
import Helper from '../../Helper/Helper';

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
    }, [dispatch, DemandesReducer, refreshDataGrid]);
    
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
                // More detailed error handling
                let errorMsg;
                if (error.response && error.response.status === 500) {
                    errorMsg = "Erreur serveur: La demande n'a pas pu être récupérée (500)";
                    console.error("Erreur 500:", error);
                } else {
                    errorMsg = error.message || messages.errorFetchingDemande || "Erreur lors de la récupération des détails de la demande";
                }
                notify(errorMsg, "error", notifyOptions);
                console.error("Erreur:", error);
            });
    }, [dispatch, messages, refreshDataGrid]);
    
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
    
    // Fonctions de rendu pour les cellules
    const renderDateFormat = useCallback(data => {
        if (!data || !data.value) return '';
        return new Date(data.value).toLocaleDateString();
    }, []);
    
    const renderEtat = useCallback(data => {
        if (!data || !data.value) return '';
        return getEtatLabel(data.value);
    }, []);
    
    const renderPriorite = useCallback(data => {
        if (!data || !data.value) return '';
        return getPrioriteLabel(data.value);
    }, []);

    // Impression des demandes
    const impression = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            componentImpression(blob);
        } catch (error) {
            console.error("Erreur lors de l'impression:", error);
            notify("Erreur lors de l'impression", "error", notifyOptions);
        }
    };
    
    const componentImpression = (blob) => {
        const url = URL.createObjectURL(blob);
        document.getElementById('iframe_content').src = url;
    };

    return (
        <div className="dx-card responsive-paddings">
        <TableGrid
            dataGrid={dataGrid}
            keyExpr='idDemande'
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
                    caption: messages.id || "ID", 
                    width: 70 
                },
                { 
                    dataField: 'description', 
                    caption: messages.description || "Description",
                    width: 250
                },
                { 
                    dataField: 'dateCreation', 
                    caption: messages.dateCreation || "Date de création",
                    dataType: 'date',
                    customizeText: renderDateFormat,
                    width: 120
                },
                { 
                    dataField: 'dateEcheance', 
                    caption: messages.dateEcheance || "Date d'échéance",
                    dataType: 'date',
                    customizeText: renderDateFormat,
                    width: 120
                },
                { 
                    dataField: 'etat', 
                    caption: messages.etat || "État",
                    customizeText: renderEtat,
                    width: 120
                },
                { 
                    dataField: 'priorite', 
                    caption: messages.priorite || "Priorité",
                    customizeText: renderPriorite,
                    width: 100
                },
                { 
                    dataField: 'client', 
                    caption: messages.client || "Client",
                    calculateCellValue: data => data.client ? data.client.nom : '',
                    width: 150
                },
                { 
                    dataField: 'module', 
                    caption: "Module",
                    calculateCellValue: data => data.module ? data.module.designation : '',
                    width: 120
                },
                { 
                    dataField: 'equipe', 
                    caption: messages.equipe || "Équipe",
                    calculateCellValue: data => data.equipe ? data.equipe.designation : '',
                    width: 120
                },
                { 
                    dataField: 'collaborateur', 
                    caption: messages.collaborateur || "Collaborateur",
                    calculateCellValue: data => data.collaborateur ? `${data.collaborateur.prenom || ''} ${data.collaborateur.nom || ''}`.trim() : '',
                    width: 150
                },
                { 
                    dataField: 'createur', 
                    caption: messages.createur || "Créateur",
                    calculateCellValue: data => data.createur ? `${data.createur.prenom || ''} ${data.createur.nom || ''}`.trim() : '',
                    width: 150
                },
                { 
                    dataField: 'commentaire', 
                    caption: messages.commentaire || "Commentaire",
                    width: 200
                }
            ]}
            templates={[]}
        />
        </div>
    );
};

export default DemandeGrid;