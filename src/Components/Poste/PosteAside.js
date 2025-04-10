import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import _ from 'lodash';
import notify from "devextreme/ui/notify";
import Form, {
    GroupItem
} from 'devextreme-react/form';
import {
    checkBox_Template,
    Text_Template,
    HeaderAside
} from "../../Helper/editorTemplates";
import "react-datepicker/dist/react-datepicker.css";
import 'status-indicator/styles.css';
import {
    handleClose,
    handleOpenModalConfirmation,
    handleCloseModalConfirmation
} from "../../Redux/Actions/Poste/PosteAside";
import {
    getPosteByCode,
    addNewPoste,
    editePoste,
    deletePoste,
} from "../../Redux/Actions/Poste/Poste";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { modeAsideEnum, constants, classNameObj } from "../../Helper/Enumeration";


const PosteAside = () => {
    const dispatch = useDispatch();

    const messages = useSelector(state => state.intl.messages);
    const intl = useSelector(state => state.intl);

    const isOpen = useSelector(state => state.PosteAsideReducer.isOpen);
    const modeAside = useSelector(state => state.PosteAsideReducer.modeAside);

    const btnAddInstance = useSelector(state => state.PostesReducer.btnAddInstance);
    const btnEditionInstance = useSelector(state => state.PostesReducer.btnEditionInstance);

    const selectedPoste = useSelector(state => state.PosteAsideReducer.selectedPoste);

    let objInitialisation = {

        idPoste: selectedPoste ? selectedPoste.idPoste : null,
        designation: selectedPoste ? selectedPoste.designation : '',
        actif: selectedPoste ? selectedPoste.actif : true,
    };
    let dxForm = useRef(null);
    let formObj = useRef(objInitialisation);
    if (selectedPoste && (modeAside === 'CONSULT' || modeAside === 'EDIT' || modeAside === 'VALIDATE'  || modeAside === 'DELETE')) {
        formObj.current = _.cloneDeep(selectedPoste);
    }


    const validateForm = (e) => {
        let Poste = _.cloneDeep(formObj.current);
        let validationForm = e.validationGroup.validate().isValid;
        let data = {};
        if (modeAside === 'ADD') {
            if (validationForm) {
                data = {
                    designation: Poste.designation,
                    actif: Poste.actif,

                };
                dxForm.current.instance.getEditor('submitAside').option("disabled", true);

                dispatch(addNewPoste(data))
                    .then(() => {
                        confirmCloseAside(e);
                        notify("Success", 'success', 1000);
                    }).catch(function () {
                        dxForm.current.instance.getEditor('submitAside').option("disabled", false);
                    });
            }
        } else if (modeAside === 'EDIT') {
            if (validationForm) {
                selectedPoste.idPoste = Poste.idPoste;
                selectedPoste.designation = Poste.designation;
                selectedPoste.actif = Poste.actif;

                dispatch(editePoste(selectedPoste))
                    .then(() => {
                        confirmCloseAside(e);
                        notify("Success", 'success', 1000);
                    }).catch(err => {
                        notify(err, 'error', 500);
                    });
            }
        } else if (modeAside === 'DELETE') {
            dispatch(deletePoste(selectedPoste.idPoste))
            .then(() => {
                confirmCloseAside(e);
                notify("Success", 'success', 1000);
            }).catch(err => {
                notify(err, 'error', 500);
            });
        }
    };

    const onInitializedFormGlobal = (e) => {
        dxForm.current = e.component;
    }
    const validateButtonOption = () => {
        return {
            icon: 'fa fa-check',
            onClick: (e) => {
                intl.loadGrid = true;
                validateForm(e);
            },
            useSubmitBehavior: true
        }
    };
    const clearForm = (e) => {
        cleanObject();
    };

    const cleanObject = () => {
        formObj.current = _.cloneDeep(objInitialisation);
    };

    const resetButtonOption = () => {
        return {
            icon: "fas fa-times",
            onClick: (e) => {
                if (modeAside === 'ADD' || modeAside === 'EDIT' || modeAside === 'CONSULT') {
                    showModalAlert(e, 'closeAside');
                } else {
                    confirmCloseAside(e);
                }

                intl.loadGrid = true;
            }
        }
    };
    const showModalAlert = (e, actionToDoOnClick) => {
        let messageToShow = actionToDoOnClick === 'delete' ?
            messages.WantToDeleteAnyway
            : `${messages.confirmDialogTextPartOne} ${messages.confirmDialogTextPartTwo}`;
        const handleBtnConfirmerModalConfirmation = () => {
            dispatch(handleCloseModalConfirmation());
            if (actionToDoOnClick === 'delete') {
                dispatch(deletePoste(selectedPoste.code))
                    .then(() => {
                        confirmCloseAside(e);
                        notify("Success", 'success', 1000);

                    }).catch(err => {
                        notify(err, 'error', 500);
                    });
            } else {
                confirmCloseAside(e);
            }
        }
        const handleBtnCancelModalConfirmation = () => {
            dispatch(handleCloseModalConfirmation());
        }
        dispatch(handleOpenModalConfirmation(messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation));
    };

    const confirmCloseAside = (e) => {
        clearForm(e);
        dispatch(handleClose());
    };
    const RenderDesignation = () => {
        console.log("RenderDesignation")
        let obj = {
            title: "Désignation",
            dataField: "designation",
            modeAside: modeAside,
            maxLength: 200,
            isRequired: true,
            colSpan:1,
            messageRequired: `${messages.designation} ${messages.required}`,
            disabled: modeAside === 'CONSULT'
        }
        return (
            <GroupItem >
                {Text_Template(obj)}
            </GroupItem>
        )
    }
    const RenderActif = () => {
        console.log("Renderactif")
        let obj = {
            title: messages.actif,
            dataField: "actif",
            modeAside: modeAside,
            colSpan:1,
            disabled: modeAside === 'CONSULT'
        }
        return (
            <GroupItem >
                {checkBox_Template(obj)}
            </GroupItem>
        )
    }


    return (
        <div>
            {isOpen && modeAside !== '' && (
                <aside className={"openned"} style={{ overflow: "auto" }}>
                    <div
                        className="aside-dialog"
                        style={{
                            width: "60%",
                            display: "table",
                        }}
                    >
                        <Form
                            ref={dxForm}
                            key={'formCreatePoste'}
                            formData={formObj.current}
                            onInitialized={onInitializedFormGlobal}
                            colCount={1}
                            style={{
                                width: "85%",
                                display: "table-row"
                            }}
                        >
                            {HeaderAside({
                                modeAside: modeAside,
                                btnValider: validateButtonOption(),
                                btnReset: resetButtonOption(),
                                messages: messages
                            })}
                            (
                            <GroupItem>
                                <GroupItem colCount={2}>
                                    {RenderDesignation()}
                                    {RenderActif()}
                                </GroupItem>
                            </GroupItem>
                            )

                        </Form>
                    </div>
                </aside>
            )}
        </div>
    );
}
export default PosteAside