import _ from 'lodash';
import React from "react";
import { FaCheck } from "react-icons/fa";
import Form, {
    ButtonItem,
    GroupItem,
    SimpleItem,
    Label,
    EmptyItem,
    TabbedItem
} from 'devextreme-react/form';
import {
    Validator,
    RequiredRule,
    CompareRule,
    EmailRule,
    PatternRule,
    StringLengthRule,
    RangeRule,
    AsyncRule
} from 'devextreme-react/validator';
import { Popup } from 'devextreme-react/popup';
import TreeList, {
    Column,
    Selection
} from 'devextreme-react/tree-list';
import { Accordion, Button, TreeView, DropDownBox } from "devextreme-react";
import { Toolbar, Item } from 'devextreme-react/toolbar';
import store from '../Redux/Store/Store';
export const handleEmpty = (testObject, emptyValue = "", nonEmptyValue = testObject) => {
    return [null, undefined, ""].includes(testObject) ? emptyValue : nonEmptyValue;
}
/**
 * @Function handleUndefined
 * It will cover cases where value was never defined, and also any of these:[null,undefined ,0,"",false,NaN]
 * @param {object} props - Object Props
 * @param {string} props.value - Value
 * @param {boolean} props.defaultValue - defaultValue

 * @returns {dxCheckBox}
 */
export const handleUndefined = (value, defaultValue) => {
    return (!["null", "undefined"].includes(typeof value)) ? value : defaultValue;
}

export const isEmptyInput = (input) => {
    return [null, undefined, ""].includes(input);
}

Object.byString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}



export const checkBox_Template = (obj) => {
    return (
        <SimpleItem
            dataField={obj.dataField}
            editorType="dxCheckBox"
            colSpan={obj.colSpan}
            cssClass="dx-field-fix"
            editorOptions={{
                onContentReady: obj.onContentReady,
                onValueChanged: obj.onValueChanged,
                text: obj.title,
                disabled: obj.modeAside === "DELETE" || obj.modeAside === "CONSULT" || obj.disabled,
            }}
        >
        </SimpleItem>
    )
}


export const Number_Template_Integer = (title, visible = true, dataField, modeAside) => {
    let errMsg = title + ' إجباري ';
    return (
        <SimpleItem
            editorType="dxNumberBox"
            visible={visible}
            dataField={dataField}
            editorOptions={{
                format: "#0",
                disabled: modeAside === "DELETE" || modeAside === "CONSULT" ? true : false,
                min: 1,
                max: 1000
            }}


            label={{
                text: title
            }}>
            <RequiredRule message={errMsg} />
        </SimpleItem>
    )
}

export const Number_Template_Pourcentage = (obj) => {
    console.log(obj);
    let errMsg = obj.title + obj.messages.required;
    return (
        <SimpleItem
            editorType="dxNumberBox"
            visible={obj.visible !== undefined ? obj.visible : true}
            colSpan={obj.colSpan}
            dataField={obj.dataField}
            name={obj.name}
            editorOptions={{
                onValueChanged: obj.onValueChanged,
                readOnly: obj.modeAside === "DELETE" || obj.modeAside === "CONSULT" ? true : false,
                min: -100,
                max: 100,
                format: function (value) {
                    let roundValue = value.toFixed(3);
                    return roundValue + "%";
                },
                step: 1
            }} label={{
            text: obj.title,
        }}>
            <RequiredRule message={errMsg} />

        </SimpleItem>
    )
}

export const SimpleItemRender = (obj) => {
    if (obj.editorOptions !== undefined) {
        obj.editorOptions.disabled === undefined ? obj.editorOptions.disabled = obj.modeAside === "DELETE" || obj.modeAside === "CONSULT" ? true : false : '';
    }
    let errorMessage = obj.text + ' إجباري ';
    return (
        <SimpleItem
            id={obj.name}
            editorType={obj.itemType}
            dataField={obj.dataField}
            editorOptions={obj.editorOptions}
            showClearButton={true}
            colSpan={obj.colSpan}
            value={obj.value}
            visible={obj.visible}
            label={{
                text: obj.text
            }}>
            <RequiredRule message={errorMessage} shouldRender={obj.isRequired} />
        </SimpleItem>
    )
};

export const PopupCsys = (obj) => {
    return (
        <Popup
            visible={obj.visible}
            onHiding={obj.onHiding}
            closeOnOutsideClick={obj.closeOnOutsideClick}
            showTitle={obj.showTitle}
            rtlEnabled={obj.rtlEnabled}
            title={obj.title}
            titleRender={obj.titleRender}
            width={obj.width}
            height={obj.height}
            shading={obj.shading}
            showCloseButton={obj.showCloseButton}
            contentRender={obj.contentRender}
            dragEnabled={false}
        />
    );
}

export const Header = (Obj) => {
    let AsideName;
    switch (Obj.modeAside) {
        case "ADD": AsideName = Obj.messages.add; break;
        case "DELETE": AsideName = Obj.messages.delete; break;
        case "EDIT": AsideName = Obj.messages.edit; break;
        case "CONSULT": AsideName = Obj.messages.consult; break;
    };

    return (
        <GroupItem colCount={23}>
            <EmptyItem
                cssClass="labelAside"
                label={{
                    text: AsideName
                }}></EmptyItem>
            <EmptyItem colSpan={20}></EmptyItem>
            <ButtonItem horizontalAlignment="left"
                buttonOptions={Obj.btnValider} />
            <ButtonItem horizontalAlignment="left"
                buttonOptions={Obj.btnReset} />
        </GroupItem>
    );
}

export class Csys_accordion extends React.Component {
    constructor(props) {
        super(props);
        this.preventRender = handleEmpty(props.preventRender, accordionConfig.preventRender)
        this.colSpan = handleEmpty(props.colSpan, accordionConfig.colSpan)
        this.dataSource = handleEmpty(props.dataSource, accordionConfig.dataSource)
        this.titleSelector = handleEmpty(props.titleSelector, accordionConfig.titleSelector)
        this.pingSelector = handleEmpty(props.pingSelector, accordionConfig.pingSelector)
        this.healthSelector = handleEmpty(props.healthSelector, accordionConfig.healthSelector)
        this.customTitleRenderer = handleEmpty(props.customTitleRenderer, accordionConfig.customTitleRenderer)
        this.contentRenderer = handleEmpty(props.contentRenderer, accordionConfig.contentRenderer)
        this.onDetailsButtonClick = handleEmpty(props.onDetailsButtonClick, accordionConfig.onDetailsButtonClick)
        this.onSelectionChanged = handleEmpty(props.onSelectionChanged, accordionConfig.onSelectionChanged)
        this.onItemTitleClick = handleEmpty(props.onItemTitleClick, accordionConfig.onItemTitleClick)
        this.onItemClick = handleEmpty(props.onItemClick, accordionConfig.onItemClick)
        this.onInitialized = handleEmpty(props.onInitialized, accordionConfig.onInitialized)
    }

    itemRenderer = (e) => {
        return handleEmpty(this.contentRenderer, false, true) ? this.contentRenderer(e) : <span className="negativeRed">#UNRENDERED_CONTENT</span>
    };
    itemTitleRenderer = (e) => {
        const data = e;
        let status = {
            ping: { false: "tabs fas fa-sync-alt negativeRed", true: "tabs fas fa-sync-alt positiveGreen" },
            health: { false: "tabs fas fa-wifi negativeRed", true: "tabs fas fa-wifi positiveGreen" }
        }
        if (handleEmpty(this.customTitleRenderer, false, true))
            return this.customTitleRenderer(e)
        else
            return (
                <div>
                    <span>
                        {handleEmpty(Object.byString(e, this.titleSelector), "#SELECTOR_ERROR")}
                        {handleEmpty(this.pingSelector, false, true) && (<i title="Sync" className={status.ping[Object.byString(e, this.pingSelector)]} />)}
                        {handleEmpty(this.healthSelector, false, true) && (<i title="Net" className={status.health[Object.byString(e, this.healthSelector)]} />)}
                    </span>
                    {handleEmpty(this.onDetailsButtonClick, false, true) && (<Button
                        className={"accord-button"}
                        icon="chevrondoubleleft"
                        stylingMode="text"
                        onClick={(e) => {
                            e.event.stopImmediatePropagation();
                            this.onDetailsButtonClick(e, data);
                        }}
                    />)}
                </div>
            );
    };
    handleSelectionChanged = (e) => {
        if (handleEmpty(this.onSelectionChanged, false, true)) this.onSelectionChanged(e)
    }
    handleItemTitleClick = (e) => {
        if (handleEmpty(this.onItemTitleClick, false, true)) this.onItemTitleClick(e)
    }
    handleInitialized = (e) => {
        if (handleEmpty(this.onInitialized, false, true)) this.onInitialized(e)
    }
    handleItemClick = (e) => {
        if (handleEmpty(this.onItemClick, false, true)) this.onItemClick(e)
    }
    render() {
        return (this.preventRender ?
            (<span></span>) :
            (<Accordion
                collapsible={true}
                multiple={false}
                deferRendering={false}
                dataSource={this.dataSource}
                itemTitleRender={this.itemTitleRenderer}
                itemRender={this.itemRenderer}
                onItemClick={this.onItemClick}
                onSelectionChanged={this.onSelectionChanged}
                onItemTitleClick={this.onItemTitleClick}
                onInitialized={this.onInitialized}

            />
            ))
    }
}


export const HeaderAside = (obj) => {
    let AsideName;
    switch (obj.modeAside) {
        case "ADD": AsideName = obj.messages.add; break;
        case "DELETE": AsideName = obj.messages.delete; break;
        case "EDIT": AsideName = obj.messages.edit; break;
        case "CONSULT": AsideName = obj.messages.consult; break;
        case 'VALIDATE': AsideName = obj.messages.asideValidate; break;
    };
    return (
        <GroupItem
            cssClass="headerAside"
            colCount={2}
        >
            < GroupItem >
                {
                    obj.modeAside === "ADD" && (
                        <label id="titleAside" className="labelAside">{AsideName}</label>
                    )
                }
                {
                    obj.modeAside === "DELETE" && (
                        <label id="titleAside" className="labelAside">{AsideName}</label>
                    )
                }
                {
                    obj.modeAside === "EDIT" && (
                        <label id="titleAside" className="labelAside">{AsideName}</label>
                    )
                }
                {
                    obj.modeAside === "CONSULT" && (
                        <label id="titleAside" className="labelAside">{AsideName}</label>
                    )
                }
                {
                    obj.modeAside === 'VALIDATE' && (
                        <label id="titleAside" className="labelAside">{AsideName}</label>
                    )
                }
            </GroupItem>
            <GroupItem cssClass={obj.modeAside === "CONSULT" ? "buttonAside buttonAsideConsult" : "buttonAside"} colCount={obj.modeAside === "CONSULT" ? 1 : 2}>
                <ButtonItem cssClass={obj.modeAside === 'CONSULT' ? "buttonAsideFix hiddenButtonValid" : "buttonAsideFix"}
                    name="submitAside" buttonOptions={obj.btnValider} />
                <ButtonItem cssClass="buttonAsideFix"
                    buttonOptions={obj.btnReset} />
            </GroupItem>
        </GroupItem>
    );
}

/* export const HeaderDataGrid = (obj) => {
    let caption = obj.caption;

    return (
        <GroupItem
           cssClass="headerAside"
            colCount={2}
        >
           <GroupItem>
                <label 
                id="titleAside" 
                className="labelAside"
                >{caption}</label>
            </GroupItem> 
            <GroupItem 
            cssClass={"buttonAside"} 
            colCount={2}>
             {obj.btnShowObservation && <ButtonItem 
             cssClass="buttonAsideFix"
                    buttonOptions={obj.btnShowObservation} />}   
                {obj.btnExportingGrid && <ButtonItem 
                cssClass="buttonAsideFix"
                    buttonOptions={obj.btnExportingGrid} />} 
            </GroupItem>
        </GroupItem>
    );
} */
export const HeaderDataGrid = (obj) => {
    let caption = obj.caption;

    return (
        <div>
            <Toolbar>
                <Item
                    location="before"
                    text={caption}
                />
                <Item location="after"
                    widget="dxButton"
                    options={obj.btnShowObservation} />
                <Item location="after"
                    widget="dxButton"
                    options={obj.btnExportingGrid} />
            </Toolbar>
        </div>
    );
}
export const TextArea_Template = (obj) => {
    const objTextArea = {
        dataField: obj.dataField !== undefined ? obj.dataField : '',
        nameField: obj.name !== undefined ? obj.name : '',
        colSpan: obj.colSpan !== undefined ? obj.colSpan : 1,
        readOnly: obj.readOnly !== undefined ? obj.readOnly : true,
        maxLength: obj.maxLength !== undefined ? obj.maxLength : 50,
        visible: obj.showColon !== undefined ? obj.visible : false,
        title: isEmptyInput(obj.title) ? '' : obj.title
    }
    return (
        <SimpleItem
            editorType="dxTextArea"
            dataField={objTextArea.dataField}
            name={objTextArea.nameField}
            label={{ visible: objTextArea.visible }}
            colSpan={1}
            editorOptions={{
                maxLength: objTextArea.maxLength,
                readOnly: objTextArea.readOnly,
                height: "126px"
            }}
            label={{
                text: objTextArea.title
            }}
        >
        </SimpleItem>
    )
}

export const TreeList_Template = (obj) => {
    return (
        <TreeList
            dataSource={obj.dataSource}
            disabled={obj.modeAside === "DELETE" || obj.modeAside === "CONSULT"}
            showRowLines={obj.showRowLines}
            showBorders={obj.showBorders}
            itemsExpr={obj.itemsExpr}
            dataStructure={obj.dataStructure}
            showColumnHeaders={false}
            rtlEnabled={true}
            onSelectionChanged={obj.onSelectionChanged}
        >
            <Selection mode="multiple" />
            <Column cellRender={obj.cellRender} />
        </TreeList>
    )
}


export const select_Template_new = (obj) => {

    let title = obj.title;
    let dataSource = obj.dataSource;
    let dataField = obj.dataField;
    let name = isEmptyInput(obj.name) ? dataField : obj.name;
    let displayValue = obj.displayValue;
    let colspan = obj.colspan;
    let handleValueChange = obj.handleChangeSelect;
    let messageRequiredRule = obj.messageRequiredRule;
    let modeAside = obj.modeAside;
    let disabled = isEmptyInput(obj.disabled) ? modeAside === "DELETE" || modeAside === "CONSULT" : obj.disabled;
    let isRequired = isEmptyInput(obj.isRequired) ? true : obj.isRequired;
    let messages = obj.messages;
    let showClearButton = isEmptyInput(obj.showClearButton) ? false : obj.showClearButton;
    let initialized = obj.onInitialized;

    return (
        <SimpleItem
            cssClass={title == "" ? "dx-field-fix" : ""}
            colSpan={colspan}
            dataField={dataField}
            name={dataField}
            id={name}
            editorType="dxSelectBox"
            label={{ text: title }}
            editorOptions={{

                rtlEnabled: true,
                acceptCustomValue: true,
                dataSource: dataSource,
                displayExpr: displayValue,
                searchEnabled: true,
                searchExpr: displayValue.toString(),
                searchMode: 'contains',
                placeholder: messages.Selection,
                isRequired: isRequired,
                disabled: disabled,
                showClearButton: showClearButton,
                onValueChanged: handleValueChange,
                onInitialized: initialized,
            }}
        >
            {isRequired && <RequiredRule message={messageRequiredRule} />}
        </SimpleItem>
    )
}

export const select_Tree_Template = (treeObj) => {

    let title = treeObj.title;
    let treeDataSource = treeObj.treeDataSource;
    let displayValue = treeObj.displayValue;
    let colspan = 1;
    let value = treeObj.value;
    let dataField = treeObj.dataField;
    let handleTreeViewItemSelectionChanged = treeObj.handleTreeViewItemSelectionChanged;
    let dropDownBoxRef = treeObj.dropDownBoxRef;
    let treeViewRef = treeObj.treeViewRef;
    let renderDisplayExpr = treeObj.renderDisplayExpr;

    const treeViewRender = (e) => {
        return (
            <TreeView
                ref={treeViewRef}
                dataSource={treeDataSource}
                dataStructure="tree"
                itemsExpr="nodes"
                rtlEnabled={true}
                selectionMode="single"
                showCheckBoxesMode="none"
                selectNodesRecursive={false}
                displayExpr={displayValue}
                selectByClick={true}
                searchEnabled={true}
                onItemSelectionChanged={handleTreeViewItemSelectionChanged}
                expandNodesRecursive={false}
            />
        );
    }

    return (
        <SimpleItem
            dataField={dataField}
            cssClass={title == "" ? "dx-field-fix" : ""}
            colSpan={colspan}
            label={{ text: title }}>
            <DropDownBox
                value={value}
                ref={dropDownBoxRef}
                showClearButton={true}
                contentRender={treeViewRender}
                displayExpr={renderDisplayExpr}
            />
        </SimpleItem>

    )
}

export const radio_Group_Template = (obj) => {

    let title = isEmptyInput(obj.title) ? "" : obj.title;
    let dataSource = obj.dataSource;
    let keyExpr = obj.keyExpr;
    let displayValue = obj.displayValue;
    let dataField = obj.dataField;
    let colspan = isEmptyInput(obj.colspan) ? 1 : obj.colspan;
    let handleValueChange = obj.handleChangeRadio;
    let handleContentReady = obj.handleContentReady;
    let messageRequiredRule = obj.messageRequiredRule;
    let modeAside = obj.modeAside;
    let isRequired = isEmptyInput(obj.isRequired) ? true : obj.isRequired;
    let isTitleVisible = isEmptyInput(obj.isTitleVisible) ? true : obj.isTitleVisible;
    let disabled = isEmptyInput(obj.disabled) ? false : obj.disabled;
    let rtlEnabled = isEmptyInput(obj.rtlEnabled) ? true : obj.rtlEnabled;
    let layout = isEmptyInput(obj.layout) ? 'horizontal' : obj.layout;
    let renderRadioGroupItem = obj.renderRadioGroupItem;

    return (
        <SimpleItem editorType={'dxRadioGroup'}
            dataField={dataField}
            editorOptions={{
                titleRender: renderRadioGroupItem,
                acceptCustomValue: true,
                dataSource: dataSource,
                valueExpr: keyExpr,
                displayExpr: displayValue,
                placeholder: "",
                rtlEnabled: rtlEnabled,
                layout: layout,
                disabled: modeAside === "DELETE" || modeAside === "CONSULT" || disabled,
                onValueChanged: handleValueChange,
                onContentReady: handleContentReady
            }}
            showClearButton={true}
            colSpan={colspan}
            label={{
                text: title,
                visible: isTitleVisible
            }}>
            {isRequired && <RequiredRule message={messageRequiredRule} />}

        </SimpleItem>
    )
}
export const Number_Integer_Template = (obj) => {

    let title = isEmptyInput(obj.title) ? "" : obj.title;
    let visible = isEmptyInput(obj.visible) ? true : obj.visible;
    let dataField = obj.dataField;
    let colSpan = isEmptyInput(obj.colSpan) ? 1 : obj.colSpan;
    let modeAside = obj.modeAside;
    let messages = obj.messages;
    let min = isEmptyInput(obj.min) ? 0 : obj.min;
    let max = isEmptyInput(obj.max) ? 1000 : obj.max;
    let format = isEmptyInput(obj.format) ? "#0" : obj.format;
    let step = isEmptyInput(obj.step) ? 1 : obj.step;
    let handleValueChange = obj.handleValueChange;
    let isDisabled = isEmptyInput(obj.isDisabled) ? false : obj.isDisabled;
    let isRequired = isEmptyInput(obj.isRequired) ? true : obj.isRequired;

    return (
        <SimpleItem
            editorType="dxNumberBox"
            visible={visible}
            dataField={dataField}
            colSpan={colSpan}
            editorOptions={{
                disabled: modeAside === "DELETE" || modeAside === "CONSULT" || isDisabled,
                min: min,
                max: max,
                format: format,
                step: step,
                onValueChanged: handleValueChange
            }}
            label={{
                text: title
            }}>
            {isRequired && <RequiredRule message={title + messages.required} />}
        </SimpleItem>
    )
}
export const Text_Template = (obj) => {

    let title = isEmptyInput(obj.title) ? "" : obj.title;
    let visible = isEmptyInput(obj.visible) ? true : obj.visible;
    let dataField = obj.dataField;
    let modeAside = obj.modeAside;
    let minLength = isEmptyInput(obj.minLength) ? 0 : obj.minLength;
    let maxLength = isEmptyInput(obj.maxLength) ? 10 : obj.maxLength;
    // let colSpan= obj.colSpan !== undefined ? obj.colSpan : 1;
    let isRequired = isEmptyInput(obj.isRequired) ? true : obj.isRequired;
    let messageRequired = isEmptyInput(obj.messageRequired) ? "" : obj.messageRequired;
    let disabled = isEmptyInput(obj.disabled) ? modeAside === "DELETE" || modeAside === "CONSULT" : obj.disabled;

    return (
        <SimpleItem
            editorType="dxTextBox"
            visible={visible}
            dataField={dataField}
            isRequired={isRequired}
            // colSpan={colSpan}
            editorOptions={{
                disabled: disabled,
                minLength: minLength,
                maxLength: maxLength
            }}
            label={{
                text: title
            }}>
            {isRequired && <RequiredRule message={messageRequired} />}
        </SimpleItem>
    )
}

export const Select_Multiple_Template = (obj) => {

    let reference = isEmptyInput(obj.reference) ? null : obj.reference;
    let title = obj.title;
    let dataField = obj.dataField;
    let visible = isEmptyInput(obj.visible) ? true : obj.visible;
    let colSpan = isEmptyInput(obj.colSpan) ? 1 : obj.colSpan;
    let dataSource = obj.dataSource;
    let displayExpr = isEmptyInput(obj.displayExpr) ? "designation" : obj.displayExpr;
    let placeholder = isEmptyInput(obj.placeholder) ? '' : obj.placeholder;
    let modeAside = obj.modeAside;
    let rtlEnabled = isEmptyInput(obj.rtlEnabled) ? true : obj.rtlEnabled;
    let hideSelectedItems = isEmptyInput(obj.hideSelectedItems) ? true : obj.hideSelectedItems;
    let searchEnabled = isEmptyInput(obj.searchEnabled) ? true : obj.searchEnabled;
    let isRequired = isEmptyInput(obj.isRequired) ? true : obj.isRequired;
    let messageRequiredRule = obj.messageRequiredRule;
    let onInitialized = isEmptyInput(obj.onInitialized) ? null : obj.onInitialized;

    return (

        <SimpleItem
            ref={reference}
            editorType='dxTagBox'
            className="select-multiple"
            dataField={dataField}
            visible={visible}
            colSpan={colSpan}
            label={{
                text: title,
            }}
            editorOptions={{
                dataSource: dataSource,
                displayExpr: displayExpr,
                rtlEnabled: rtlEnabled,
                hideSelectedItems: hideSelectedItems,
                readOnly: modeAside === "DELETE" || modeAside === "CONSULT",
                searchEnabled: searchEnabled,
                placeholder: placeholder,
                onInitialized: onInitialized
            }}
        >
            {isRequired && <RequiredRule message={messageRequiredRule} />}
        </SimpleItem>
    )
}

/**
 * useMaskBehavior : specifies whether to control user input using a mask created based on the displayFormat.
     * invalidDateMessage : Specifies the message displayed if the typed value is not a valid date or time.
     * dateOutOfRangeMessage: Specifies the message displayed if the specified date is later than the max value or earlier than the min value.
    */
export const Date_Template = (obj) => {

    let dataField = obj.dataField;
    let name = isEmptyInput(obj.name) ? obj.dataField : obj.name;
    let visible = isEmptyInput(obj.visible) ? true : obj.visible;
    let colSpan = isEmptyInput(obj.colSpan) ? 1 : obj.colSpan;
    let label = isEmptyInput(obj.label) ? "" : obj.label;
    let disabled = isEmptyInput(obj.disabled) ? obj.modeAside === "DELETE" || obj.modeAside === "CONSULT" : obj.disabled;
    let alignment = isEmptyInput(obj.alignment) ? 'Right' : obj.alignment;
    let displayFormat = isEmptyInput(obj.displayFormat) ? "dd/MM/yyyy" : obj.displayFormat;
    let disabledDates = isEmptyInput(obj.disabledDates) ? [] : obj.disabledDates;
    let invalidDateMessage = isEmptyInput(obj.invalidDateMessage) ? "InvalidDate" : obj.invalidDateMessage;
    let min = isEmptyInput(obj.min) ? undefined : obj.min;
    let max = isEmptyInput(obj.max) ? undefined : obj.max;
    let dateOutOfRangeMessage = isEmptyInput(obj.dateOutOfRangeMessage) ? "dateOutOfRange" : obj.dateOutOfRangeMessage;
    let messageRequiredRule = isEmptyInput(obj.messageRequiredRule) ? "required" : obj.messageRequiredRule;
    let handleChangeDate = obj.handleChangeDate;

    return (
        <SimpleItem
            dataField={dataField}
            name={name}
            visible={visible}
            label={{ text: label, alignment: alignment }}
            editorType="dxDateBox"
            type="date"
            colSpan={colSpan}
            editorOptions={{
                disabled: disabled,
                displayFormat: displayFormat,
                disabledDates: disabledDates,
                invalidDateMessage: invalidDateMessage,
                min: min,
                max: max,
                useMaskBehavior: true,
                dateOutOfRangeMessage: dateOutOfRangeMessage,
                onValueChanged: handleChangeDate

            }}
        >
            <RequiredRule message={messageRequiredRule} />
        </SimpleItem>
    )
}


export const getConfigValuebyCode = (code) => {
    return store.getState().ConfigReducer.configBudget.filter(el => el.code === code)[0].valeur;
}
export const roundDecimalsWithSpaces = (value, decimals) => {
    let decimalsValue = decimals !== undefined ? decimals : getConfigValuebyCode("nbr_chiffre_virg");
    if ("string" === typeof value) value = parseFloat(value.replace(/\s/g, "").replace(/\&nbsp;/g, "")).toFixed(decimalsValue);
    return Number(Math.round(value + 'e' + decimalsValue) + 'e-' + decimalsValue).toLocaleString('fr', {
      minimumFractionDigits: decimalsValue
    }).replace(/,/g, '.');

  }
  export const roundDecimalsWithoutSpaces = (value, decimals) => {
    let decimalsValue = decimals !== undefined ? decimals : getConfigValuebyCode("nbr_chiffre_virg");
    if ("string" === typeof value) value = parseFloat(value.replace(/\s/g, "").replace(/\\&nbsp;/g, "")).toFixed(decimalsValue);
    if (isNaN(value)) return null;
    return Number(Math.round(value + 'e' + decimalsValue) + 'e-' + decimalsValue).toFixed(decimalsValue);
  }
  export const customizePourcentage = (data, decimals) => {
    let decimalsValue = decimals !== undefined ? decimals : getConfigValuebyCode("nbr_chiffre_virg");
    return `${roundDecimalsWithSpaces(data.value, decimalsValue)}%`;
}