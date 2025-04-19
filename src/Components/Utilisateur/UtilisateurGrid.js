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

loadMessages(arMessages);
loadMessages(enMessages);
loadMessages(frMessages);

let selectionChangedRaised;
const UtilisateurGrid = () => {
    const dispatch = useDispatch();
    const UtilisateursReducer = useSelector(state => state.UtilisateursReducer);
    const messages = useSelector(state => state.intl.messages);
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
            dispatch(getUtilisateurByCode(selectedRowKeys))
                .then((data) =>
                    dispatch(handleOpenConsultMode(data))
                )
        }
    }
    
    const onClickBtnDelete = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
            dispatch(getUtilisateurByCode(selectedRowKeys))
                .then((data) => {
                    dispatch(handleOpenDeleteMode(data, refreshDataGrid))
                })
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

    return (
        <TableGrid
            dataGrid={dataGrid}
            keyExpr='username'
            customStore={HelperGrid.constructCustomStore(
                `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.utilisateurs}`,
                'username'
            )}
            onToolbarPreparing={onToolbarPreparing}
            onSelectionChanged={onSelectionChanged}
            onRowClick={onRowClick}
            fileName={messages.Utilisateurs || "Utlisateurs"}
            columns={[
                { 
                    dataField: 'username', 
                    caption: messages.Username || "Username",
                    dataType: 'string',
                    allowSorting: true,
                    allowFiltering: true
                },
                { 
                    dataField: 'nom', 
                    caption: messages.LastName || "Last Name",
                    dataType: 'string',
                    allowSorting: true,
                    allowFiltering: true
                },
                { 
                    dataField: 'prenom', 
                    caption: messages.FirstName || "First Name",
                    dataType: 'string',
                    allowSorting: true,
                    allowFiltering: true
                },
                { 
                    dataField: 'role', 
                    caption: messages.Role || "Role",
                    dataType: 'string',
                    allowSorting: true,
                    allowFiltering: true,
                    calculateCellValue: (data) => getRoleLabel(data.role)
                },
                { 
                    dataField: 'poste.designation', 
                    caption: messages.Position || "Position",
                    dataType: 'string',
                    allowSorting: true,
                    allowFiltering: true
                },
                { 
                    dataField: 'actif', 
                    caption: messages.Active || "Active",
                    dataType: 'boolean',
                    allowSorting: true,
                    allowFiltering: true
                }
            ]}
            templates={[]}
        />
    )
}

export default UtilisateurGrid;