import React from 'react';
import DataGrid, {
    Column,
    ColumnChooser,
    Export,
    FilterRow,
    Grouping,
    HeaderFilter,
    SearchPanel,
    Selection,
    Sorting,
    GroupPanel,
    Paging
} from 'devextreme-react/data-grid';
import store from '../../Redux/Store/Store';
import { Template } from 'devextreme-react/core/template';
import HelperGrid from '../../Helper/HelperGrid';
import FiltreDates from "../ComponentTable/FiltreDates";

const TableGrid = (obj) => {

    const messages = store.getState().intl.messages;
    const direction = store.getState().intl.direction;


    const filtreDates = () => (
        <FiltreDates customStore={obj.customStore} dataGrid={obj.dataGrid} />
    );
    const objDataGrid = {
        dataGrid: obj.dataGrid,
        customStore: obj.customStore,
        keyExpr: obj.keyExpr !== undefined ? obj.keyExpr : 'code',
        onToolbarPreparing: obj.onToolbarPreparing,
        onSelectionChanged: obj.onSelectionChanged,
        onRowClick: obj.onRowClick,
        fileName: obj.fileName,
        columns: obj.columns,
        templates: obj.templates.map((template) => {
            switch (template.name) {
                case 'filtreSelect': {
                     template.render = toolbarFilterSelect;
                    break;
                }
                case 'filtreDate': {
                     template.render = filtreDates;
                    break;
                }
                default: {
                     template.render = '';
                    break;
                }
            }
                return template;
        })
    }
    return (
        <DataGrid className='DataGrid'
            ref={objDataGrid.dataGrid}
            dataSource={objDataGrid.customStore}
            keyExpr={objDataGrid.keyExpr}
            onToolbarPreparing={objDataGrid.onToolbarPreparing}
            showColumnLines={true}
            showRowLines={true}
            showBorders={true}
            rowAlternationEnabled={true}
            rtlEnabled={direction === "RTL"}
            wordWrapEnabled={true}
            columnAutoWidth={true}
            onSelectionChanged={objDataGrid.onSelectionChanged}
            onRowClick={objDataGrid.onRowClick}
            hoverStateEnabled={true}
            allowColumnReordering={true}
            onContentReady={HelperGrid.onContentReady}>
            <Selection mode={'single'} />
            <Export enabled={true} fileName={objDataGrid.fileName} allowExportSelectedData={true} />
            <FilterRow visible={true} applyFilter={true} />
            <HeaderFilter visible={true} />
            <Sorting mode={'single'} />
            <GroupPanel visible={true} />
            <SearchPanel visible={true} placeholder={messages.search} />
            <Grouping autoExpandAll={false} />
            <Paging defaultPageSize={13} />
            <ColumnChooser enabled={true} />
            {objDataGrid.columns.map((column, key) => {
                return (<Column key={key}
                    {...column}
                />)
            }
            )}
            {/* 
            {<Template name={'filtreDate'} render={filtreDates} />} */}
            {objDataGrid.templates.map((template, key) => {
                return (<Template key={key}
                    {...template}
                />)
            }
            )}

        </DataGrid>
    )

}
export default TableGrid