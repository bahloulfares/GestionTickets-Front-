import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
//import Ressources from "../../Helper/Ressources";
import {
    handleOpenAddMode,
    handleOpenEditMode,
    handleOpenDeleteMode,
    handleOpenConsultMode
} from "../../Redux/Actions/Equipe/EquipeAside";
import {
    handleOpenModal
} from "../../Redux/Actions/ComponentTable/ModalImpression";
import notify from "devextreme/ui/notify";
import { notifyOptions } from '../../Helper/Config';
import { loadMessages } from "devextreme/localization";
import arMessages from "../../i18n/datagrid_ar.json";
import enMessages from "devextreme/localization/messages/en";
import frMessages from "devextreme/localization/messages/fr";
import { getAllEquipes, getEquipeByCode } from "../../Redux/Actions/Equipe/Equipe";
//import Helper from '../../Helper/Helper';
import HelperGrid from '../../Helper/HelperGrid';
import TableGrid from '../ComponentHelper/TableGrid';

loadMessages(arMessages);
loadMessages(enMessages);
loadMessages(frMessages);

let selectionChangedRaised;

const EquipeGrid = () => {
    const dispatch = useDispatch();
    const EquipesReducer = useSelector(state => state.EquipesReducer);
    const messages = useSelector(state => state.intl.messages);
    const dataGrid = useRef(null);
    
    // Ajout d'un useEffect pour charger les équipes au montage du composant
    useEffect(() => {
        dispatch(getAllEquipes());
    }, [dispatch]);
    
    const onSelectionChanged = ({ selectedRowsData }) => {
        selectionChangedRaised = true;
        HelperGrid.handleSelectionChanged(selectedRowsData, EquipesReducer);
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
            },
            print: {
                visible: true,
                action: onClickBtnPrint
            }
        }
        HelperGrid.handleToolbarPreparing(e, dataGrid, buttons, filtres, EquipesReducer)
    }
    
    // Ajout de la fonction pour l'impression
    const onClickBtnPrint = () => {
        dispatch(handleOpenModal());
    }
    
    const onClickBtnAdd = () => {
        dispatch(handleOpenAddMode(refreshDataGrid))
    }
    
    const onClickBtnEdit = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
            dispatch(getEquipeByCode(selectedRowKeys))
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
                dispatch(getEquipeByCode(selectedRowKeys))
                    .then((data) => {
                        dispatch(handleOpenConsultMode(data))
                    })
            }
        }
    }
    
    const onClickBtnDelete = () => {
        if (dataGrid.current !== null) {
            let dataGridInstance = dataGrid.current.instance;
            let selectedRowKeys = dataGridInstance.getSelectedRowKeys()[0];
            if (selectedRowKeys) {
                dispatch(getEquipeByCode(selectedRowKeys))
                    .then((data) => {
                        dispatch(handleOpenDeleteMode(data, refreshDataGrid))
                    })
            }
        }
    }
    
    const onClickBtnRefresh = () => {
        refreshDataGrid();
    }
    
    const refreshDataGrid = () => {
        dispatch(getAllEquipes())
            .then(() => {
                if (dataGrid.current !== null) {
                    let dataGridInstance = dataGrid.current.instance;
                    dataGridInstance.clearSelection();
                }
            })
            .catch(error => {
                console.error("Erreur lors du rafraîchissement de la grille:", error);
                notify("Erreur lors du rafraîchissement de la grille", "error", notifyOptions);
            });
    }

    // Fonction pour formater l'affichage des utilisateurs
    const formatUsers = (data) => {
        if (!data.users || data.users.length === 0) return '';
        return data.users.map(user => `${user.prenom} ${user.nom}`).join(', ');
    };

    // Fonction pour afficher l'état actif/inactif
    // const formatActif = (data) => {
    //     return data.actif ? messages.actif || 'Actif' : messages.inactif || 'Inactif';
    // };

    // Configuration des colonnes pour le tableau
    const columns = [
        {
            dataField: 'idEquipe',
            caption: messages.id || 'ID',
            //visible: false
            width: 50
        },
        {
            dataField: 'designation',
            caption: messages.designation || 'Désignation',
            width: 400
        },
        {
            caption: messages.members || 'Membres',
            calculateCellValue: formatUsers,
            width: 300
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
    ];

    // Configuration des templates pour le tableau
    const templates = [];

    // Création du customStore pour le DataGrid
    const customStore = {
        load: () => {
            return new Promise((resolve) => {
                resolve(EquipesReducer.allEquipe || []);
            });
        },
        key: 'idEquipe'
    };

    return (
        <div className="dx-card responsive-paddings">
            <TableGrid
                dataGrid={dataGrid}
                customStore={customStore}
                keyExpr="idEquipe"
                onToolbarPreparing={onToolbarPreparing}
                onSelectionChanged={onSelectionChanged}
                onRowClick={onRowClick}
                fileName={messages.equipes || "Equipes"}
                columns={columns}
                templates={templates}
            />
        </div>
    );
};

export default EquipeGrid;