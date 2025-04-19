import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { handleClose, handleOpenModalConfirmation, handleCloseModalConfirmation } from "../../Redux/Actions/Utilisateur/UtilisateurAside";
import { addNewUtilisateur, editUtilisateur, deleteUtilisateur } from "../../Redux/Actions/Utilisateur/Utilisateur";
import { getAllPostes } from "../../Redux/Actions/Poste/Poste";
import notify from "devextreme/ui/notify";
import { notifyOptions } from '../../Helper/Config';
import { Role, RoleOptions } from '../../Helper/Enums/Role';
import { SelectBox } from 'devextreme-react/select-box';
import '../../assests/css/modals.css';

const UtilisateurAside = () => {
    const dispatch = useDispatch();
    const {
        isOpen,
        modeAside,
        selectedUtilisateur,
        successCallback
    } = useSelector(state => state.UtilisateurAsideReducer);

    const allPoste = useSelector(state => state.UtilisateurAsideReducer.allPoste);
    const { isOpenModalConfirmation } = useSelector(state => state.UtilisateurAsideReducer);
    const messages = useSelector(state => state.intl.messages);
    const direction = useSelector(state => state.intl.direction);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nom: '',
        prenom: '',
        description: '',
        role: Role.AUTRE,
        poste: null,
        actif: true
    });
console.log("formData", formData);
    useEffect(() => {
        dispatch(getAllPostes());
    }, [dispatch]);

    useEffect(() => {
        if (selectedUtilisateur) {
            setFormData({
                username: selectedUtilisateur.username || '',
                password: '', // Ne pas afficher le mot de passe existant
                nom: selectedUtilisateur.nom || '',
                prenom: selectedUtilisateur.prenom || '',
                description: selectedUtilisateur.description || '',
                role: selectedUtilisateur.role || Role.AUTRE,
                poste: selectedUtilisateur.poste || null,
                actif: selectedUtilisateur.actif !== false
            });
        } else {
            setFormData({
                username: '',
                password: '',
                nom: '',
                prenom: '',
                description: '',
                role: Role.AUTRE,
                poste: null,
                actif: true
            });
        }
    }, [selectedUtilisateur]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePosteChange = (value) => {
        const selectedPoste = allPoste.find(p => p.idPoste === value);
        setFormData(prev => ({
            ...prev,
            poste: selectedPoste || null
        }));
    };

    const onClickBtnClose = () => {
        dispatch(handleClose());
    };

    const getTitle = () => {
        switch (modeAside) {
            case 'ADD': return messages.addUser || "Ajouter un utilisateur";
            case 'EDIT': return messages.editUser || "Modifier un utilisateur";
            case 'DELETE': return messages.deleteUser || "Supprimer un utilisateur";
            case 'CONSULT': return messages.consultUser || "Consulter un utilisateur";
            default: return messages.user || "Utilisateur";
        }
    };

    const renderFooterButtons = () => {
        switch (modeAside) {
            case 'ADD':
                return (
                    <>
                        <Button color="secondary" onClick={onClickBtnClose}>
                            {messages.cancel || "Annuler"}
                        </Button>
                        <Button color="primary" onClick={handleSubmit}>
                            {messages.add || "Ajouter"}
                        </Button>
                    </>
                );
            case 'EDIT':
                return (
                    <>
                        <Button color="secondary" onClick={onClickBtnClose}>
                            {messages.cancel || "Annuler"}
                        </Button>
                        <Button color="primary" onClick={handleSubmit}>
                            {messages.save || "Enregistrer"}
                        </Button>
                    </>
                );
            case 'DELETE':
                return (
                    <>
                        <Button color="secondary" onClick={onClickBtnClose}>
                            {messages.cancel || "Annuler"}
                        </Button>
                        <Button color="danger" onClick={handleSubmit}>
                            {messages.delete || "Supprimer"}
                        </Button>
                    </>
                );
            case 'CONSULT':
                return (
                    <Button color="secondary" onClick={onClickBtnClose}>
                        {messages.close || "Fermer"}
                    </Button>
                );
            default: return null;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.username) {
            notify(messages.usernameRequired || "Le nom d'utilisateur est requis", "error", notifyOptions);
            return;
        }

        if (modeAside === 'ADD' && !formData.password) {
            notify(messages.passwordRequired || "Le mot de passe est requis", "error", notifyOptions);
            return;
        }

        if (!formData.role) {
            notify(messages.roleRequired || "Le rôle est requis", "error", notifyOptions);
            return;
        }

        const userData = {
            username: formData.username,
            ...(formData.password && { password: formData.password }),
            nom: formData.nom,
            prenom: formData.prenom,
            description: formData.description,
            role: formData.role,
            ...(formData.poste && { poste: formData.poste }),
            actif: formData.actif
        };

        if (modeAside === 'ADD') {
            dispatch(addNewUtilisateur(userData))
                .then(() => {
                    notify(messages.addSuccess || "Utilisateur ajouté avec succès", "success", notifyOptions);
                    dispatch(handleClose());
                    if (successCallback) successCallback();
                })
                .catch(error => {
                    notify(messages.addFailed || "Échec de l'ajout de l'utilisateur", "error", notifyOptions);
                    console.error("Erreur ajout utilisateur:", error);
                });
        } else if (modeAside === 'EDIT') {
            const handleConfirm = () => {
                dispatch(handleCloseModalConfirmation());
                dispatch(editUtilisateur(userData))
                    .then(() => {
                        notify(messages.editSuccess || "Utilisateur modifié avec succès", "success", notifyOptions);
                        dispatch(handleClose());
                        if (successCallback) successCallback();
                    })
                    .catch(error => {
                        notify(messages.editFailed || "Échec de la modification", "error", notifyOptions);
                        console.error("Erreur modification utilisateur:", error);
                    });
            };

            const handleCancel = () => {
                dispatch(handleCloseModalConfirmation());
            };

            dispatch(handleOpenModalConfirmation(
                messages.confirmEdit || "Confirmez-vous la modification de cet utilisateur ?",
                handleCancel,
                handleConfirm
            ));
        } else if (modeAside === 'DELETE') {
            const handleConfirm = () => {
                dispatch(handleCloseModalConfirmation());
                dispatch(deleteUtilisateur(formData.username))
                    .then(() => {
                        notify(messages.deleteSuccess || "Utilisateur supprimé avec succès", "success", notifyOptions);
                        dispatch(handleClose());
                        if (successCallback) successCallback();
                    })
                    .catch(error => {
                        notify(messages.deleteFailed || "Échec de la suppression", "error", notifyOptions);
                        console.error("Erreur suppression utilisateur:", error);
                    });
            };

            const handleCancel = () => {
                dispatch(handleCloseModalConfirmation());
            };

            dispatch(handleOpenModalConfirmation(
                messages.confirmDelete || "Confirmez-vous la suppression de cet utilisateur ?",
                handleCancel,
                handleConfirm
            ));
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            toggle={onClickBtnClose} 
            className="utilisateur-modal" 
            style={{ direction: direction }}
        >
            <ModalHeader toggle={onClickBtnClose}>
                {getTitle()}
            </ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="username">{messages.username || "Nom d'utilisateur"} *</Label>
                        <Input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={modeAside === "EDIT" || modeAside === "CONSULT" || modeAside === "DELETE"}
                            required
                        />
                    </FormGroup>

                    {(modeAside === 'ADD' || modeAside === 'EDIT') && (
                        <FormGroup>
                            <Label for="password">
                                {messages.password || "Mot de passe"} 
                                {modeAside === 'ADD' && ' *'}
                            </Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={modeAside === 'ADD'}
                                placeholder={modeAside === 'EDIT' ? 
                                    (messages.leaveEmptyToKeep || "Laisser vide pour ne pas modifier") : ""}
                                disabled={modeAside === "CONSULT" || modeAside === "DELETE"}
                            />
                        </FormGroup>
                    )}

                    <FormGroup>
                        <Label for="nom">{messages.nom || "Nom"} *</Label>
                        <Input
                            type="text"
                            name="nom"
                            id="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            disabled={modeAside === "CONSULT" || modeAside === "DELETE"}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="prenom">{messages.prenom || "Prénom"} *</Label>
                        <Input
                            type="text"
                            name="prenom"
                            id="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            disabled={modeAside === "CONSULT" || modeAside === "DELETE"}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="description">{messages.description || "Description"}</Label>
                        <Input
                            type="textarea"
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            disabled={modeAside === "CONSULT" || modeAside === "DELETE"}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="role">{messages.role || "Rôle"} *</Label>
                        <Input
                            type="select"
                            name="role"
                            id="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={modeAside === "CONSULT" || modeAside === "DELETE"}
                            required
                        >
                            {RoleOptions.map((role, index) => (
                                <option key={index} value={role.value}>
                                    {messages[role.value] || role.label}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>

                    <FormGroup>
                        <Label for="poste">{messages.poste || "Poste"}</Label>
                        <SelectBox
                            value={formData.poste ? formData.poste.idPoste : null}
                            dataSource={allPoste}
                            displayExpr="designation"
                            valueExpr="idPoste"
                            onValueChanged={e => handlePosteChange(e.value)}
                            disabled={modeAside === "CONSULT" || modeAside === "DELETE"}
                            
                        />
                    </FormGroup>

                    <FormGroup check>
                        <Label check>
                            <Input
                                type="checkbox"
                                name="actif"
                                checked={formData.actif}
                                onChange={handleChange}
                                disabled={modeAside === "CONSULT"}
                            />
                            {messages.active || "Actif"}
                        </Label>
                    </FormGroup>
                </Form>
            </ModalBody>

            <ModalFooter>
                {renderFooterButtons()}
            </ModalFooter>

            <Modal isOpen={isOpenModalConfirmation} toggle={handleCloseModalConfirmation}>
                <ModalBody>
                    {messages.confirmAction || "Êtes-vous sûr de vouloir effectuer cette action?"}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={handleCloseModalConfirmation}>
                        {messages.cancel || "Annuler"}
                    </Button>
                    <Button color="primary" onClick={handleSubmit}>
                        {messages.confirm || "Confirmer"}
                    </Button>
                </ModalFooter>
            </Modal>
        </Modal>
    );
};

export default UtilisateurAside;
