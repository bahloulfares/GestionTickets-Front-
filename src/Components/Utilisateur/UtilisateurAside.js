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
    select_Template_new,
    HeaderAside
} from "../../Helper/editorTemplates";
import "react-datepicker/dist/react-datepicker.css";
import 'status-indicator/styles.css';
import {
    handleClose,
    handleOpenModalConfirmation,
    getAllPoste,
    getAllRole,
    handleCloseModalConfirmation
} from "../../Redux/Actions/Utilisateur/UtilisateurAside";
import {
    getUtilisateurByCode,
    addNewUtilisateur,
    editeUtilisateur,
    deleteUtilisateur,
} from "../../Redux/Actions/Utilisateur/Utilisateur";
import 'react-confirm-alert/src/react-confirm-alert.css';

import { modeAsideEnum, constants, classNameObj } from "../../Helper/Enumeration";

const UtilisateurAside = () => {
    const dispatch = useDispatch();

    const messages = useSelector(state => state.intl.messages);
    const intl = useSelector(state => state.intl);

    const isOpen = useSelector(state => state.UtilisateurAsideReducer.isOpen);
    const modeAside = useSelector(state => state.UtilisateurAsideReducer.modeAside);

    const btnAddInstance = useSelector(state => state.UtilisateursReducer.btnAddInstance);
    const btnEditionInstance = useSelector(state => state.UtilisateursReducer.btnEditionInstance);

    const selectedUtilisateur = useSelector(state => state.UtilisateurAsideReducer.selectedUtilisateur);
    const allPoste = useSelector(state => state.UtilisateurAsideReducer.allPoste);
    const allRole = useSelector(state => state.UtilisateurAsideReducer.allRole);

    useEffect(() => {
        dispatch(getAllPoste())
    }, [allPoste.current, dispatch])


    useEffect(() => {
        dispatch(getAllRole())
    }, [allRole.current, dispatch])
    let objInitialisation = {

        nom: selectedUtilisateur ? selectedUtilisateur.nom : '',
        prenom: selectedUtilisateur ? selectedUtilisateur.prenom : '',
        role: selectedUtilisateur ? selectedUtilisateur.role : '',
        password: selectedUtilisateur ? selectedUtilisateur.password : '',
        username: selectedUtilisateur ? selectedUtilisateur.username : '',
        idPoste: selectedUtilisateur ? selectedUtilisateur.poste.idPoste : null,
        actif: selectedUtilisateur ? selectedUtilisateur.actif : true,
    };

    let dxForm = useRef(null);
    let formObj = useRef(objInitialisation);
    if (selectedUtilisateur && (modeAside === 'CONSULT' || modeAside === 'EDIT' || modeAside === 'VALIDATE' || modeAside === 'DELETE')) {
        formObj.current = _.cloneDeep(selectedUtilisateur);
    }


    const validateForm = (e) => {
        let Utilisateur = _.cloneDeep(formObj.current);
        let validationForm = e.validationGroup.validate().isValid;
        let data = {};
        if (modeAside === 'ADD') {
            if (validationForm) {
                data = {
                    nom: Utilisateur.nom,
                    prenom: Utilisateur.prenom,
                    role: Utilisateur.role,
                    password: Utilisateur.password,
                    username: Utilisateur.username,
                    idPoste: Utilisateur.idPoste,
                    actif: Utilisateur.actif,

                };
                dxForm.current.instance.getEditor('submitAside').option("disabled", true);

                dispatch(addNewUtilisateur(data))
                    .then(() => {
                        confirmCloseAside(e);
                        notify("Success", 'success', 1000);
                    }).catch(function () {
                        dxForm.current.instance.getEditor('submitAside').option("disabled", false);
                    });
            }
        } else if (modeAside === 'EDIT') {
            if (validationForm) {
                selectedUtilisateur.nom = Utilisateur.nom;
                selectedUtilisateur.prenom = Utilisateur.prenom;
                selectedUtilisateur.role = Utilisateur.role;
                selectedUtilisateur.password = Utilisateur.password;
                selectedUtilisateur.username = Utilisateur.username;
                selectedUtilisateur.idPoste = Utilisateur.idPoste;
                selectedUtilisateur.actif = Utilisateur.actif;

                dispatch(editeUtilisateur(selectedUtilisateur))
                    .then(() => {
                        confirmCloseAside(e);
                        notify("Success", 'success', 1000);
                    }).catch(err => {
                        notify(err, 'error', 500);
                    });
            }
        } else if (modeAside === 'DELETE') {
            dispatch(deleteUtilisateur(selectedUtilisateur.username))
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
                dispatch(deleteUtilisateur(selectedUtilisateur.nom))
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
        // btnAddInstance.option('disabled', false);
        // btnEditionInstance.option('disabled', false);
    };
    const RenderUsername = () => {
        console.log("RenderUsername")
        let obj = {
            title: "Login",
            dataField: "username",
            modeAside: modeAside,
            maxLength: 200,
            isRequired: true,
            colSpan: 1,
            messageRequired: `"Login" ${messages.required}`,
            disabled: modeAside === "CONSULT" || modeAside === "DELETE"
        }
        return (
            <GroupItem >
                {Text_Template(obj)}
            </GroupItem>
        )
    }
    const RenderPassword = () => {
        console.log("RenderPassword")
        let obj = {
            title: "Mot de passe ",
            dataField: "password",
            modeAside: modeAside,
            maxLength: 200,
            isRequired: true,
            colSpan: 1,
            messageRequired: `"Mot de passe " ${messages.required}`,
            disabled: modeAside === "CONSULT" || modeAside === "DELETE"
        }
        return (
            <GroupItem >
                {Text_Template(obj)}
            </GroupItem>
        )
    }
    const RenderNom = () => {
        console.log("RenderNom")
        let obj = {
            title: "Nom",
            dataField: "nom",
            modeAside: modeAside,
            maxLength: 200,
            isRequired: true,
            colSpan: 1,
            messageRequired: `"Nom" ${messages.required}`,
            disabled: modeAside === "CONSULT" || modeAside === "DELETE"
        }
        return (
            <GroupItem >
                {Text_Template(obj)}
            </GroupItem>
        )
    }
    const RenderPrenom = () => {
        console.log("RenderPrenom")
        let obj = {
            title: "Prénom",
            dataField: "prenom",
            modeAside: modeAside,
            maxLength: 200,
            isRequired: true,
            colSpan: 1,
            messageRequired: `"Prénom" ${messages.required}`,
            disabled: modeAside === "CONSULT" || modeAside === "DELETE"
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
            colSpan: 1,
            disabled: modeAside === "CONSULT" || modeAside === "DELETE"
        }
        return (
            <GroupItem >
                {checkBox_Template(obj)}
            </GroupItem>
        )
    }

    const RenderPoste = () => {
        console.log("RenderPoste");

        let obj = {
            title: "Poste",
            dataSource: allPoste,
            displayValue: "designation",
            dataField: "poste",
            modeAside: modeAside,
            disabled: modeAside === "CONSULT" || modeAside === "DELETE",
            handleChangeSelect: handlechangegroup,
            colspan: 1,
            messages: messages,
            messageRequiredRule: "Poste" + messages.required,
        };

        return (
            <GroupItem>
                {select_Template_new(obj)}
            </GroupItem>
        );
    };
    const handlechangegroup = (e) => {
        formObj.current.idPoste = e.value.idPoste;
    };

    const RenderRole = () => {
        console.log("RenderRole");

        let obj = {
            title: "Rôle",
            dataSource: allRole,
            displayValue: "designation",
            dataField: "role",
            modeAside: modeAside,
            disabled: modeAside === "CONSULT" || modeAside === "DELETE",
            handleChangeSelect: handlechangerole,
            colspan: 1,
            messages: messages,
            messageRequiredRule: "Rôle" + messages.required,
        };

        return (
            <GroupItem>
                {select_Template_new(obj)}
            </GroupItem>
        );
    };
    const handlechangerole = (e) => {
        formObj.current.role = e.value.code;
    };


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
                            key={'formCreateUtilisateur'}
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
                                    {RenderNom()}
                                    {RenderPrenom()}
                                </GroupItem>
                                <GroupItem colCount={2}>
                                    {RenderUsername()}
                                    {RenderPassword()}
                                </GroupItem>
                                <GroupItem colCount={2}>
                                    {RenderPoste()}
                                    {RenderRole()}
                                </GroupItem>
                                <GroupItem>{RenderActif()}</GroupItem>

                            </GroupItem>
                            )

                        </Form>
                    </div>
                </aside>
            )}
        </div>
    );
}
export default UtilisateurAside