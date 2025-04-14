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
import { getUtilisateurByCode } from "../../Redux/Actions/Utilisateur/Utilisateur";
import Helper from '../../Helper/Helper';
import HelperGrid from '../../Helper/HelperGrid';
import TableGrid from '../ComponentHelper/TableGrid';

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
    /**
     * 
     * @param {*} e 
     * obj filtres.select : select Utilisateur
     */
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
                    dispatch(handleOpenConsultMode(data, refreshDataGrid))
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
                }
                )
        }
    }
    const onClickBtnEditionList = () => {
        dispatch(handleOpenModal())
        let du = UtilisateursReducer.dateDebut;
        let au = UtilisateursReducer.dateFin;
        let url = `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.utilisateurs}/edition/listeUtilisateurs?du=${du}&au=${au}`;
        impression(url);
    }
    const onClickBtnEdition = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
            dispatch(handleOpenModal())
            let url = `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.utilisateurs}/edition/${selectedRowKeys}`;
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
            keyExpr='username'
            customStore={HelperGrid.constructCustomStore(`${`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.utilisateurs}`}`,
                'username')}
            onToolbarPreparing={onToolbarPreparing}
            onSelectionChanged={onSelectionChanged}
            onRowClick={onRowClick}
            fileName={messages.Utilisateurs}
            columns={[
                {
                    dataField: 'poste.designation',
                    caption: "Poste"
                },
                {
                    dataField: 'username',
                    caption: "Login"
                },
                {
                    dataField: 'dateCreation',
                    caption: "Date creation",
                    customizeText: renderDateFormat
                },
                {
                    dataField: 'userCreation',
                    caption: "Utilisateur creation"
                }, 
                {
                    dataField: 'actif',
                    caption: "Actif"
                },
                {
                    dataField: 'nom',
                    caption: "Nom"
                },
                {
                    dataField: 'prenom',
                    caption: "Prénom"
                }
            ]}
            templates={[]}
        />
    )
}

export default UtilisateurGrid
