import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import store from '../../Redux/Store/Store';
import Ressources from "../../Helper/Ressources";
import {
    handleOpenAddMode,
    handleOpenEditMode,
    handleOpenDeleteMode,
    handleOpenConsultMode
} from "../../Redux/Actions/Client/ClientAside";
import {
    handleOpenModal
} from "../../Redux/Actions/ComponentTable/ModalImpression";
import notify from "devextreme/ui/notify";
import { notifyOptions } from '../../Helper/Config';
import { loadMessages } from "devextreme/localization";
import arMessages from "../../i18n/datagrid_ar.json";
import enMessages from "devextreme/localization/messages/en";
import frMessages from "devextreme/localization/messages/fr";
import { getClientByCode } from "../../Redux/Actions/Client/Client";
import Helper from '../../Helper/Helper';
import HelperGrid from '../../Helper/HelperGrid';
import TableGrid from '../ComponentHelper/TableGrid';

loadMessages(arMessages);
loadMessages(enMessages);
loadMessages(frMessages);

let selectionChangedRaised;
const ClientGrid = () => {

    const dispatch = useDispatch();
    const ClientsReducer = useSelector(state => state.ClientsReducer);
    const messages = useSelector(state => state.intl.messages);
    const dataGrid = useRef(null);
    console.log("Données envoyées à la DataGrid:", ClientsReducer);

    const onSelectionChanged = ({ selectedRowsData }) => {
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, ClientsReducer);
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
            editionList: {
                visible: true,
                action: onClickBtnEditionList
            },
            edition: {
                visible: true,
                action: onClickBtnEdition
            },
            export_excel: {
                visible: true
            }
        }
        HelperGrid.handleToolbarPreparing(e, dataGrid, buttons, filtres, ClientsReducer)
    }
    
    const onClickBtnAdd = () => {
        dispatch(handleOpenAddMode(refreshDataGrid))
    }
    
    const onClickBtnEdit = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
            dispatch(getClientByCode(selectedRowKeys))
                .then((data) => {
                    dispatch(handleOpenEditMode(data, refreshDataGrid))
                })
        }
    }
    
    const onClickBtnConsult = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
            dispatch(getClientByCode(selectedRowKeys))
                .then((data) =>
                    dispatch(handleOpenConsultMode(data, refreshDataGrid))
                )
        }
    }
    
    const onClickBtnDelete = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
            dispatch(getClientByCode(selectedRowKeys))
                .then((data) => {
                    dispatch(handleOpenDeleteMode(data, refreshDataGrid))
                }
                )
        }
    }
    
    const onClickBtnEditionList = () => {
        dispatch(handleOpenModal())
        let du = ClientsReducer.dateDebut;
        let au = ClientsReducer.dateFin;
        let url = `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.clients}/edition/listeClients?du=${du}&au=${au}`;
        impression(url);
    }
    
    const onClickBtnEdition = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
            dispatch(handleOpenModal())
            let url = `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.clients}/edition/${selectedRowKeys}`;
            impression(url);
        }
    }
    
    const refreshDataGrid = () => {
        if (dataGrid.current !== null)
            dataGrid.current.instance.refresh();
    }
    
    const renderDateFormat = (data) => {
        return Helper.formatDate(data.value);
    };
    
    async function impression(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        componentImpression(blob);
    }
    
    const componentImpression = (blob) => {
        let url = URL.createObjectURL(blob);
        document.getElementById('iframe_content').src = url;
    }

    return (
        <TableGrid
            dataGrid={dataGrid}
            keyExpr='idClient'
            customStore={HelperGrid.constructCustomStore(
                `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.clients}`,
                'idClient'
            )}
            onToolbarPreparing={onToolbarPreparing}
            onSelectionChanged={onSelectionChanged}
            onRowClick={onRowClick}
            fileName={messages.Clients || "Clients"}
            columns={[
                { dataField: 'idClient', caption: "ID",alignment: 'left', },
                { dataField: 'nom', caption: messages.Nom || "Nom" },
                { dataField: 'telephone', caption: messages.Telephone || "Téléphone" },
                { dataField: 'email', caption: messages.Email || "Email" },
                { dataField: 'adresse', caption: messages.Adresse || "Adresse" },
                // { dataField: 'dateCreation', caption: messages.DateCreation || "Date de création", cellTemplate: renderDateFormat }
            ]}
            templates={[]}
        />
    )
}

export default ClientGrid