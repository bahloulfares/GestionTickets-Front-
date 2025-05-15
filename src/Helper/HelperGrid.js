
import store from '../Redux/Store/Store';
import filterRemove from '../assests/css/images/filter-remove.png';
import CustomStore from 'devextreme/data/custom_store';
import Helper from './Helper';
import notify from "devextreme/ui/notify";
import { notifyOptions } from './Config';
/**import required used for dxDropDownButton*/
import DropDownButton from 'devextreme-react/drop-down-button';

const HelperGrid = {
    /**
     * 
     * @param {*} e 
     * @param dataGrid is a reference of DataGrid 
     * @param {*} buttons is a object of enum ADD, EDIT, VALIDATE, CONSULT, EXPORT_EXCEL
     *  et affiche que les btn envoyer avec leur actions
     * 
     */


    handleToolbarPreparing: function (e, dataGrid, buttons, filtres, Reducer) {

        const messages = store.getState().intl.messages;
        let disableButtons = true;
        let toolbarItems = e.toolbarOptions.items;
        let listSearchPanel = toolbarItems.filter(item => item.name === "searchPanel");
        let searchPanel;
        if (listSearchPanel.length > 0) {
            searchPanel = listSearchPanel[0];
            searchPanel.location = "before";
        }

        let listColumnChooserButton = toolbarItems.filter(item => item.name === "columnChooserButton");
        let columnChooserButton;
        if (listColumnChooserButton.length > 0) {
            columnChooserButton = listColumnChooserButton[0];
            columnChooserButton.location = "before";
            columnChooserButton.options.elementAttr = { "class": "toolbar-button" };
            columnChooserButton.visible = buttons !== undefined && buttons.columnChooserButton !== undefined;
        }
        e.toolbarOptions.items = [];
        e.toolbarOptions.items.push(
            searchPanel !== undefined ? searchPanel : '',
            {
                location: 'center',
                template: 'filtreSelect',
                widget: 'dxSelectBox',
                visible: filtres !== undefined && filtres.select !== undefined
            },
            {
                location: 'center',
                template: 'filtreDate',
                visible: filtres !== undefined && filtres.dates !== undefined
            },
            {
                widget: 'dxButton',
                location: "center",
                visible: buttons !== undefined && buttons.refresh !== undefined,
                options: {
                    icon: 'refresh',
                    elementAttr: {
                        "class": "toolbar-button"
                    },
                    onClick: () => {
                        if (dataGrid.current !== null) dataGrid.current.instance.refresh()
                    }
                }
            },
            {
                widget: 'dxButton',
                location: "before",
                visible: filtres !== undefined && filtres.filterRemove !== undefined,
                options: {
                    icon: filterRemove,
                    elementAttr: {
                        "class": "toolbar-button"
                    },
                    onClick: () => {
                        if (dataGrid.current !== null) dataGrid.current.instance.clearFilter()
                    }
                }
            },
            columnChooserButton,
            {
                widget: 'dxButton',
                location: "after",
                visible: buttons.add !== undefined && buttons.add.visible,
                options: {
                    icon: 'fas fa-plus fa-3x green',
                    text: messages.add,
                    onClick: () => {
                        buttons.add.action()
                    }
                }
            },
            {
                widget: 'dxButton',
                location: "after",
                visible: buttons.edit !== undefined && buttons.edit.visible,
                options: {
                    icon: 'edit',
                    text: messages.edit,
                    disabled: disableButtons,
                    onInitialized: (args) => {
                        if (Reducer !== undefined) Reducer.btnEditInstance = args.component;
                    },
                    onClick: () => {
                        buttons.edit.action()
                    }
                }
            },
            {
                widget: 'dxButton',
                location: "after",
                visible: buttons.validate !== undefined && buttons.validate.visible,
                options: {
                    icon: 'save',
                    text: messages.validate,
                    disabled: disableButtons,
                    onInitialized: (args) => {
                        if (Reducer !== undefined) Reducer.btnValidateInstance = args.component;
                    },
                    onClick: () => {
                        buttons.validate.action()
                    }
                }
            },
            {
                widget: 'dxButton',
                location: "after",
                visible: buttons.consult !== undefined && buttons.consult.visible,
                options: {
                    icon: 'fas fa-eye greenLight',
                    text: messages.consult,
                    disabled: disableButtons,
                    onInitialized: (args) => {
                        if (Reducer !== undefined) Reducer.btnConsultInstance = args.component;
                    },
                    onClick: () => {
                        buttons.consult.action()
                    }
                }
            },
            {
                widget: 'dxButton',
                location: "after",
                visible: buttons.delete !== undefined && buttons.delete.visible,
                options: {
                    icon: 'trash',
                    text: messages.delete,
                    disabled: disableButtons,
                    onInitialized: (args) => {
                        if (Reducer !== undefined) Reducer.btnDeleteInstance = args.component;
                    },
                    onClick: () => {
                        buttons.delete.action()
                    }
                }
            },
            {
                widget: 'dxButton',
                location: "after",
                visible: buttons.affecte !== undefined && buttons.affecte.visible,
                options: {
                    icon: 'edit',
                    text: messages.affecte || "Affecté",
                    disabled: disableButtons,
                    onInitialized: (args) => {
                        if (Reducer !== undefined) Reducer.btnAffecteInstance = args.component;
                    },
                    onClick: () => {
                        buttons.affecte.action();
                    }
                }
            },
            {
                widget: 'dxButton',
                location: "after",
                visible: buttons.desaffecte !== undefined && buttons.desaffecte.visible,
                options: {
                    icon: 'fas fa-unlink',
                    text: messages.desaffecte || "Désaffecter",
                    disabled: disableButtons,
                    onInitialized: (args) => {
                        if (Reducer !== undefined) Reducer.btnDesaffecteInstance = args.component;
                    },
                    onClick: () => {
                        buttons.desaffecte.action();
                    }
                }
            },
            {
                location: "after",
                widget: 'dxDropDownButton',
                options: {
                    displayExpr: 'name',
                    keyExpr: 'value',
                    icon: 'print',
                    selectedItemKey: this.mode,
                    stylingMode: 'outlined',
                    useSelectMode: false,
                    splitButton: true,
                    disabled: false,
                    onInitialized: (args) => {
                        if (Reducer !== undefined) Reducer.btnEditionInstance = args.component;
                    },
                    onSelectionChanged: (e) => {
                        this.mode = e.item.value;
                    },
                    items: [{
                        value: buttons.editionList,
                        name: messages.printList,
                        icon: 'print',
                        visible: buttons.editionList !== undefined && buttons.editionList.visible,
                        disabled: false,
                        onClick: function () {
                            buttons.editionList.action()
                        }
                    },
                    {
                        value: buttons.edition,
                        name: messages.Budget,
                        icon: 'print',
                        visible: buttons.edition !== undefined && buttons.edition.visible,
                        disabled: false,
                        onClick: () => {
                            buttons.edition.action()
                        }
                    },
                    {
                        value: buttons.edition,
                        name: messages.Excel,
                        icon: 'exportxlsx',
                        elementAttr: {
                            "class": "dx-datagrid-export-button"
                        },
                        onClick: function () {
                            buttons.export_excel.action ?
                                buttons.export_excel.action :
                                e.component.exportToExcel(false);
                        },
                        visible: buttons.export_excel !== undefined && buttons.export_excel.visible,
                        disabled: false
                    }]
                }
            }
        )
    },

    onContentReady: () => {
        let listNodata = document.getElementsByClassName('dx-datagrid-nodata');
        for (const element of listNodata) {
            element.innerText = 'Aucun donnée disponible';
        }
    },
    refreshDataGrid: (dataGrid) => {
        if (dataGrid.current !== null)
            dataGrid.current.instance.refresh();
    },
    clearDataGrid: function (dataGrid) {
        if (dataGrid.current !== null)
            dataGrid.current.instance.clearFilter()
    },
    handleSelectionChanged: function (selectedRowsData, Reducer) {
        const disableButtons = true;
        if (selectedRowsData.length === 0) {
            Reducer.btnConsultInstance.option('disabled', disableButtons);
            Reducer.btnEditInstance.option('disabled', disableButtons);
            Reducer.btnValidateInstance.option('disabled', disableButtons);
            if (Reducer.btnDeleteInstance !== undefined)
                Reducer.btnDeleteInstance.option('disabled', disableButtons);
            if (Reducer.btnEditionInstance !== undefined)
                Reducer.btnEditionInstance.option('disabled', disableButtons);
            if (Reducer.btnAffecteInstance !== undefined)
                Reducer.btnAffecteInstance.option('disabled', disableButtons);
            if (Reducer.btnDesaffecteInstance !== undefined)
                Reducer.btnDesaffecteInstance.option('disabled', disableButtons);
        } else {
            Reducer.btnConsultInstance.option('disabled', !disableButtons);
            Reducer.btnEditInstance.option('disabled', !disableButtons);
            Reducer.btnValidateInstance.option('disabled', !disableButtons);
            if (Reducer.btnDeleteInstance !== undefined)
                Reducer.btnDeleteInstance.option('disabled', !disableButtons);
            if (Reducer.btnEditionInstance !== undefined)
                Reducer.btnEditionInstance.option('disabled', !disableButtons);
            if (Reducer.btnAffecteInstance !== undefined)
                Reducer.btnAffecteInstance.option('disabled', !disableButtons);
            if (Reducer.btnDesaffecteInstance !== undefined)
                Reducer.btnDesaffecteInstance.option('disabled', !disableButtons);
        }
    },
   /* constructCustomStore: function (url, filtres, Reducer, store, dataGrid, params, keyExpr = 'code') {
        const messages = store.getState().intl.messages;
        let isSlice = false;
        let dispatch;

        if (params) {
            if (params.isSlice)
                isSlice = params.isSlice;
            if (params.store)
                Reducer = store.getState()[params.reducer];
            dispatch = params.dispatch;
        }

        return new CustomStore({
            key: keyExpr,
            load: async loadOptions => {

                let data;
                let response;

                if (filtres !== undefined && filtres !== null) {
                    try {
                        if (loadOptions.userData.dateDebut !== undefined && loadOptions.userData.dateDebut !== null) {
                            filtres.dates.dateDebut = loadOptions.userData.dateDebut;
                        }
                        if (loadOptions.userData.dateFin !== undefined && loadOptions.userData.dateFin !== null) {
                            filtres.dates.dateFin = loadOptions.userData.dateFin;
                        }
                        if (loadOptions.userData.select !== undefined && loadOptions.userData.select !== null) {
                            filtres.select = loadOptions.userData.select;
                        }
                        if (loadOptions.userData.filtreActif !== undefined && loadOptions.userData.filtreActif !== null) {
                            if (isSlice) dispatch(params.actions.changeFiltreActif(loadOptions.userData.filtreActif));else Reducer.filtreActif = loadOptions.userData.filtreActif;
                            //filtres.filtreActif.value = loadOptions.userData.filtreActif;
                          }

                        if (loadOptions.userData.searchPanelValue !== undefined) {
                            if (isSlice) dispatch(params.actions.changeSearchPanel(loadOptions.userData.searchPanelValue)); else Reducer.searchPanelValue = loadOptions.userData.searchPanelValue;
                        }

                        let du = filtres.dates ? filtres.dates.dateDebut : '';
                        let au = filtres.dates ? filtres.dates.dateFin : '';
                        let actif = params !== undefined ? store.getState()[params.reducer] !== undefined ? store.getState()[params.reducer].filtreActif : '' : '';
                        let q = params !== undefined ? store.getState()[params.reducer] !== undefined ? store.getState()[params.reducer].searchPanelValue : undefined : undefined;

                        if (isSlice) {
                            if (Reducer && Reducer.dateDebut !== undefined) dispatch(params.actions.updateDateDebut(du));
                            if (Reducer && Reducer.dateFin !== undefined) dispatch(params.actions.updateDateFin(au));
                        } else {
                            if (Reducer && Reducer.dateDebut !== undefined) Reducer.dateDebut = du;
                            if (Reducer && Reducer.dateFin !== undefined) Reducer.dateFin = au;
                        }
                        if (q && q.length > 0) {
                            response = await axios.get(eval('`' + `${url}&q=${q}` + '`'));
                        } else {
                            response = await axios.get(eval('`' + `${url}` + '`'));
                        }
                        data = await response.data;

                        if (isSlice) dispatch(params.actions.loadData(data)); else Reducer.datagrid_data = data;
                        return {
                            data: data
                        };
                    } catch (e) {
                        throw 'Data Loading Error';
                    }
                } else {
                    try {

                        if (loadOptions.userData.searchPanelValue !== undefined) {
                            if (isSlice)
                                dispatch(params.actions.changeSearchPanel(loadOptions.userData.searchPanelValue));
                            else
                                Reducer.searchPanelValue = loadOptions.userData.searchPanelValue;
                        }

                        if (store.getState().intl.loadGrid === false) {
                            dataGrid.current.instance.option('loadPanel.enabled', false);
                            data = Reducer.datagrid_data;
                        } else {
                            let q = params !== undefined ?
                                store.getState()[params.reducer] !== undefined ? store.getState()[params.reducer].searchPanelValue : undefined
                                : undefined;
                            if (q && q.length > 0) {
                                response = await axios.get(`${url}&q=${q}`);
                            } else {
                                response = await axios.get(url);
                            }

                            data = await response.data;
                            if (isSlice) dispatch(params.actions.loadData(data)); else Reducer.datagrid_data = data;
                            dataGrid.current.instance.option('loadPanel.enabled', true);
                        }

                        return {
                            data: data
                        };
                    } catch (e) {
                        throw 'Data Loading Error';
                    }
                }
            }
        });
        return customStoreGrid;
    }*/
    /**
     * 
     * @param {*} url 
     * @param {*} filtres : obj of {dateDebut, dateFin, select}
     * @param {*} Reducer 
     */
  constructCustomStore: function (url, key) {

        return new CustomStore({
            key: key,
            load: async (loadOptions) => {
                    try {
                        const response = await fetch(eval('`' + `${url}` + '`'));
                        const data = await response.json();
                        return {
                            data: data
                        };
                    } catch (e) {
                        throw 'Data Loading Error';
                    }



            }
        })
    }
    /*   loadDataCustomStore: (url) => {
          return new Promise(() => {
              try {
                  const response =  fetch(eval('`' + `${url}` + '`'));
                  const data =  response.json();
                  return {
                      data: resolve(data)
                  };
              } catch (e) {
                  throw 'Data Loading Error';
              }
            });
        } */


};
export default HelperGrid;
