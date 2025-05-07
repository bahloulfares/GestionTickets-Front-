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
import FiltreDates from "../ComponentTable/FiltreDates";
import SelectBudget from "../ComponentTable/SelectBudget";

const TableGridVolumePresatation = (obj) => {

    const messages = store.getState().intl.messages;



    return (
        <DataGrid className='DataGrid'
            ref={obj.dataGrid}
            dataSource={obj.dataSource}
            keyExpr={'codeActe'}
            onToolbarPreparing={obj.onToolbarPreparing}
            showColumnLines={true}
            showRowLines={true}
            showBorders={true}
            rowAlternationEnabled={true}
            rtlEnabled={true}
            wordWrapEnabled={true}
            columnAutoWidth={true}
            onRowPrepared={onRowPrepared}
            hoverStateEnabled={true} 
            allowColumnReordering={true} >
            onContentReady={HelperGrid.onContentReady}>
            <Selection mode={'single'} />
            <Export enabled={true} fileName={'revisionTarifaires'} allowExportSelectedData={true} />
            <FilterRow visible={true} applyFilter={true} />
            <HeaderFilter visible={true} />
            <Sorting mode={'single'} />
            <GroupPanel visible={true} />
            <SearchPanel visible={true} placeholder={messages.search} />
            <Grouping autoExpandAll={false} />
            <Paging defaultPageSize={13} />
            <ColumnChooser enabled={true} />

            {obj.columns.map((column, key) => {
                return (<Column key={key}
                    {...column}
                />)
            }
            )}
          

        </DataGrid>
    )

}
export default TableGrid



// <DataGrid className='DataGrid'
// ref={dataGrid}
// dataSource={dataSource}
// keyExpr={'codeActe'}
// onToolbarPreparing={onToolbarPreparing}
// showColumnLines={true}
// showRowLines={true}
// showBorders={true}
// rowAlternationEnabled={true}
// rtlEnabled={true}
// wordWrapEnabled={true}
// columnAutoWidth={true}
// onRowPrepared={onRowPrepared}
// hoverStateEnabled={true}
// >

// <Selection mode="multiple"
//     allowSelectAll={true}
//     deferred={true}
// />
// <Export enabled={true} fileName={'listeDetailsRevisionVolumePrestationDTO'} allowExportSelectedData={true} />
// <FilterRow visible={true} applyFilter={true} />
// <HeaderFilter allowSearch={true} visible={true} />
// <Sorting mode={'single'} />
// <SearchPanel visible={false} placeholder={messages.search} width={500}/>
// <Grouping contextMenuEnabled={true} autoExpandAll={true} />
// <ColumnChooser enabled={true} />
// <Column
//     dataField={'codeSaisiActe'}
//     caption={messages.codeSaisiPrestation}
//     sortOrder={'asc'}
//     allowEditing={false}
//     allowGrouping={false}
// />
// <Column
//     dataField={'designationActe'}
//     caption={messages.prestation}
//     allowEditing={false}
// />

// <Column
//     dataField={'volumeReference'}
//     caption={messages.prixActuel}
//     customizeText={renderRoundDecimal}
//     allowEditing={false}
// />
// <Column
//     dataField={'poucentageRevision'}
//     caption={messages.poucentageRevision}
//     customizeText={renderRoundDecimal}
//     allowEditing={editable}
//     setCellValue={handleChangeCellPoucentageRevision}
// />
// <Column
//     dataField={'volumePrevisionnel'}
//     caption={messages.prixRevision}
//     customizeText={renderRoundDecimal}
//     allowEditing={editable}
//     setCellValue={handleChangeCellPrixRevision}
// />
// <Column
//     type={'buttons'}
//     buttons={[{
//         hint: messages.historiqueTarifVolume,
//         icon: 'fa fa-chart-area',
//         onClick: courbeHistorique
//     }]}
// />




// <Editing mode={'cell'} allowUpdating={true} AllowAdding={true} AllowDeleting={true} AllowDragging={true} />


// </DataGrid>
