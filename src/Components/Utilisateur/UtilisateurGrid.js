import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import store from '../../Redux/Store/Store';
import Ressources from "../../Helper/Ressources";
import {
    handleOpenAddMode,
    handleOpenEditMode,
    handleOpenDeleteMode,
    handleOpenConsultMode
} from "../../Redux/Actions/Utilisateur/UtilisateurAside";
import {
    handleOpenModal
} from "../../Redux/Actions/ComponentTable/ModalImpression";
import notify from "devextreme/ui/notify";
import { notifyOptions } from '../../Helper/Config';
import { loadMessages } from "devextreme/localization";
import arMessages from "../../i18n/datagrid_ar.json";
import enMessages from "devextreme/localization/messages/en";
import frMessages from "devextreme/localization/messages/fr";
import { getAllUtilisateurs, getUtilisateurByCode } from "../../Redux/Actions/Utilisateur/Utilisateur";
import Helper from '../../Helper/Helper';
import HelperGrid from '../../Helper/HelperGrid';
import TableGrid from '../ComponentHelper/TableGrid';
import { getRoleLabel } from '../../Helper/Enums/Role';
import PostesReducer from '../../Redux/Reducers/Poste/Poste';

loadMessages(arMessages);
loadMessages(enMessages);
loadMessages(frMessages);

let selectionChangedRaised;
// At the top of your component, get the postes data
const UtilisateurGrid = () => {
    const dispatch = useDispatch();
    const UtilisateursReducer = useSelector(state => state.UtilisateursReducer);
    const messages = useSelector(state => state.intl.messages);
    const allPoste = useSelector(state => state.UtilisateurAsideReducer.allPoste || []);
    const dataGrid = useRef(null);
    
    const onSelectionChanged = ({ selectedRowsData }) => {
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, UtilisateursReducer);
    };
    
    const onRowClick = e => {
        if (!selectionChangedRaised) {
            let dataGrid = e.component;
            let keys = dataGrid.getSelectedRowKeys();
            if (dataGrid.getSelectedRowKeys().length > 0)
                dataGrid.deselectRows(keys);
        }
        selectionChangedRaised = false;
    };
    
    const onToolbarPreparing = (e) => {
        let filtres = {
            filterRemove: {
                visible: true
            }
        }
        let buttons = {
            columnChooserButton: {
                visible: true,
            },
            refresh: {
                visible: true,
                action: onClickBtnRefresh
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
            }
        }
        HelperGrid.handleToolbarPreparing(e, dataGrid, buttons, filtres, UtilisateursReducer)
    }
    
    const onClickBtnAdd = () => {
        dispatch(handleOpenAddMode(refreshDataGrid))
    }
    
    const onClickBtnEdit = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
            dispatch(getUtilisateurByCode(selectedRowKeys))
                .then((data) => {
                    dispatch(handleOpenEditMode(data, refreshDataGrid))
                })
        }
    }
    
    const onClickBtnConsult = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
            if (selectedRowKeys) {
                dispatch(getUtilisateurByCode(selectedRowKeys))
                    .then((data) => {
                        dispatch(handleOpenConsultMode(data))
                    })
                    .catch(error => {
                        notify("Erreur lors de la récupération des détails de l'utilisateur", "error", notifyOptions);
                        console.error("Erreur:", error);
                    });
            } else {
                notify("Veuillez sélectionner un utilisateur", "warning", notifyOptions);
            }
        }
    }
    
    const onClickBtnDelete = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
            
            if (!selectedRowKeys) {
                notify(messages.selectUserToDelete || "Veuillez sélectionner un utilisateur à supprimer", "warning", notifyOptions);
                return;
            }
            
            dispatch(getUtilisateurByCode(selectedRowKeys))
                .then((data) => {
                    dispatch(handleOpenDeleteMode(data, refreshDataGrid));
                })
                .catch(error => {
                    notify(messages.errorFetchingUser || "Erreur lors de la récupération des détails de l'utilisateur", "error", notifyOptions);
                    console.error("Erreur:", error);
                    // S'assurer que le chargement est terminé même en cas d'erreur
                    if (dataGridInstance) {
                        dataGridInstance.endCustomLoading();
                    }
                });
        }
    }
    
    
    const onClickBtnRefresh = () => {
        refreshDataGrid();
    }
    
    const refreshDataGrid = () => {
        if (dataGrid.current !== null) {
            dispatch(getAllUtilisateurs(dataGrid.current));
        }
    }

    // Inside the component, update the columns definition for position:
    return (
        <TableGrid
            dataGrid={dataGrid}
            keyExpr='username'
            customStore={HelperGrid.constructCustomStore(
                `${Ressources.CoreUrlB}/template-core/api/users`,
                'username'
            )}
            onToolbarPreparing={onToolbarPreparing}
            onSelectionChanged={onSelectionChanged}
            onRowClick={onRowClick}
            fileName={messages.Utilisateurs || "Utilisateurs"}
            columns={[
                { 
                    dataField: 'username', 
                    caption: messages.Username || "Username",
                    dataType: 'string',
                    allowSorting: true,
                    allowFiltering: true,
                    width: 150
                },
                { 
                    dataField: 'nom', 
                    caption: messages.LastName || "Last Name",
                    dataType: 'string',
                    allowSorting: true,
                    allowFiltering: true,
                    width: 150
                },
                { 
                    dataField: 'prenom', 
                    caption: messages.FirstName || "First Name",
                    dataType: 'string',
                    allowSorting: true,
                    allowFiltering: true,
                    width: 150
                },
                { 
                    dataField: 'role', 
                    caption: messages.Role || "Role",
                    dataType: 'string',
                    allowSorting: true,
                    allowFiltering: true,
                    calculateCellValue: (data) => getRoleLabel(data.role),
                    width: 120
                },
                { 
                    dataField: 'id_poste', 
                    caption: messages.Position || "Poste",
                    dataType: 'string',
                    allowSorting: true,
                    allowFiltering: true,
                    width: 150,
                    calculateCellValue: (rowData) => {
                        console.log('Position data for user:', rowData.username, rowData);
                        
                        if (!rowData) return '';
                        
                      
                        // Check for id_poste field
                        if (rowData.id_poste) {
                            // Use the allPoste from the component scope
                            if (allPoste && allPoste.length > 0) {
                                const poste = allPoste.find(p => p.idPoste === rowData.id_poste);
                                if (poste) {
                                    return poste.designation;
                                }
                            }
                            return `Poste ${rowData.id_poste}`;
                        }
                        
                        // If no id_poste but we have idPoste, use that instead
                        if (rowData.idPoste) {
                            if (allPoste && allPoste.length > 0) {
                                const poste = allPoste.find(p => p.idPoste === rowData.idPoste);
                                if (poste) {
                                    return poste.designation;
                                }
                            }
                            return `Poste ${rowData.idPoste}`;
                        }
                        
                        return '';
                    }
                },
                { 
                    dataField: 'actif', 
                    caption: messages.Active || "Active",
                    dataType: 'boolean',
                    allowSorting: true,
                    allowFiltering: true,
                    width: 80,
                    cellTemplate: (container, options) => {
                        const div = document.createElement('div');
                        div.className = 'text-center';
                        div.innerHTML = options.value ? 
                            '<i class="fas fa-check text-success"></i>' : 
                            '<i class="fas fa-times text-danger"></i>';
                        container.appendChild(div);
                    }
                }
            ]}
            templates={[]}
        />
    )
}

export default UtilisateurGrid;