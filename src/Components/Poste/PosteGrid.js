import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import store from '../../Redux/Store/Store';
import Ressources from "../../Helper/Ressources";
import {
    handleOpenAddMode,
    handleOpenEditMode,
    handleOpenDeleteMode,
    handleOpenConsultMode
} from "../../Redux/Actions/Poste/PosteAside";
import {
    handleOpenModal
} from "../../Redux/Actions/ComponentTable/ModalImpression";
import notify from "devextreme/ui/notify";
import { notifyOptions } from '../../Helper/Config';
import { loadMessages } from "devextreme/localization";
import arMessages from "../../i18n/datagrid_ar.json";
import enMessages from "devextreme/localization/messages/en";
import frMessages from "devextreme/localization/messages/fr";
import { getPosteByCode } from "../../Redux/Actions/Poste/Poste";
import Helper from '../../Helper/Helper';
import HelperGrid from '../../Helper/HelperGrid';
import TableGrid from '../ComponentHelper/TableGrid';

loadMessages(arMessages);
loadMessages(enMessages);
loadMessages(frMessages);

let selectionChangedRaised;
const PosteGrid = () => {

    const dispatch = useDispatch();
    const PostesReducer = useSelector(state => state.PostesReducer);
    const messages = useSelector(state => state.intl.messages);
    const dataGrid = useRef(null);

    const onSelectionChanged = ({ selectedRowsData }) => {
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, PostesReducer);
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
     * obj filtres.select : select Poste
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
        HelperGrid.handleToolbarPreparing(e, dataGrid, buttons, filtres, PostesReducer)
    }
    const onClickBtnAdd = () => {
        dispatch(handleOpenAddMode(refreshDataGrid));
    }
    const onClickBtnEdit = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys();
            
            if (selectedRowKeys.length === 0) {
                notify("Veuillez sélectionner un poste à modifier", "warning", notifyOptions);
                return;
            }
            
            dispatch(getPosteByCode(selectedRowKeys[0]))
                .then((data) => {
                    if (data) {
                        dispatch(handleOpenEditMode(data, refreshDataGrid));
                    } else {
                        notify("Impossible de récupérer les données du poste", "error", notifyOptions);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération du poste:", error);
                    notify("Une erreur est survenue lors de la récupération des données", "error", notifyOptions);
                });
        }
    }
    const onClickBtnConsult = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys();
            
            if (selectedRowKeys.length === 0) {
                notify("Veuillez sélectionner un poste à consulter", "warning", notifyOptions);
                return;
            }
            
            dispatch(getPosteByCode(selectedRowKeys[0]))
                .then((data) => {
                    if (data) {
                        dispatch(handleOpenConsultMode(data, refreshDataGrid));
                    } else {
                        notify("Impossible de récupérer les données du poste", "error", notifyOptions);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération du poste:", error);
                    notify("Une erreur est survenue lors de la récupération des données", "error", notifyOptions);
                });
        }
    }
    const onClickBtnDelete = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys();
            
            if (selectedRowKeys.length === 0) {
                notify("Veuillez sélectionner un poste à supprimer", "warning", notifyOptions);
                return;
            }
            
            dispatch(getPosteByCode(selectedRowKeys[0]))
                .then((data) => {
                    if (data) {
                        dispatch(handleOpenDeleteMode(data, refreshDataGrid));
                    } else {
                        notify("Impossible de récupérer les données du poste", "error", notifyOptions);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération du poste:", error);
                    notify("Une erreur est survenue lors de la récupération des données", "error", notifyOptions);
                });
        }
    }
    const onClickBtnEditionList = () => {
        dispatch(handleOpenModal());
        let du = PostesReducer.dateDebut;
        let au = PostesReducer.dateFin;
        
        if (!du || !au) {
            notify("Veuillez sélectionner une période valide", "warning", notifyOptions);
            return;
        }
        
        let url = `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.postes}/edition/listePostes?du=${du}&au=${au}`;
        impression(url);
    }
    const renderDateFormat = (data) => {
        return Helper.formatDate(data.value);
    }
    const onClickBtnEdition = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys();
            
            if (selectedRowKeys.length === 0) {
                notify("Veuillez sélectionner un poste pour l'édition", "warning", notifyOptions);
                return;
            }
            
            dispatch(handleOpenModal());
            let url = `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.postes}/edition/${selectedRowKeys[0]}`;
            impression(url);
        }
    }
    const refreshDataGrid = () => {
        if (dataGrid.current !== null)
            dataGrid.current.instance.refresh();
    }
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
            keyExpr='idPoste'
            customStore={HelperGrid.constructCustomStore(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.postes}`,
                'idPoste')}
            onToolbarPreparing={onToolbarPreparing}
            onSelectionChanged={onSelectionChanged}
            onRowClick={onRowClick}
            fileName={messages.Postes}
            columns={[
                {
                    dataField: 'idPoste',
                    caption: "ID",
                    width: 80,
                    alignment: 'center',
                    allowSorting: true,
                    sortIndex: 0,
                    sortOrder: 'asc'
                },
                {
                    dataField: 'designation',
                    caption: "Désignation",
                    width: 250,
                    allowFiltering: true,
                    allowSorting: true
                },
                // {
                //     dataField: 'dateCreation',
                //     caption: "Date création",
                //     customizeText: renderDateFormat,
                //     width: 120,
                //     allowSorting: true,
                //     visible: true
                // },
                // {
                //     dataField: 'userCreation',
                //     caption: "Utilisateur création",
                //     width: 150,
                //     allowFiltering: true,
                //     visible: true
                // }, 
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
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            showBorders={true}
            rowAlternationEnabled={true}
            hoverStateEnabled={true}
            showRowLines={true}
            showColumnLines={true}
            wordWrapEnabled={true}
        />
    )
}

export default PosteGrid
