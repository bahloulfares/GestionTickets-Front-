import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { handleClose, handleOpenModalConfirmation, handleCloseModalConfirmation } from "../../Redux/Actions/Poste/PosteAside";
import { addNewPoste, editPoste, deletePoste } from "../../Redux/Actions/Poste/Poste";
import notify from "devextreme/ui/notify";
import { notifyOptions } from '../../Helper/Config';
import '../../assests/css/modals.css';

const PosteAside = () => {
    const dispatch = useDispatch();
    const PosteAsideReducer = useSelector(state => state.PosteAsideReducer);
    const messages = useSelector(state => state.intl.messages);
    const direction = useSelector(state => state.intl.direction);
    
    const { isOpen, modeAside, selectedPoste, successCallback, isOpenModalConfirmation, messageToShow, actionBtnModalConfirmation } = PosteAsideReducer;

    const [formData, setFormData] = useState({
        designation: '',
        actif: true
    });
    
    useEffect(() => {
        if (PosteAsideReducer.selectedPoste) {
            setFormData({
                idPoste: PosteAsideReducer.selectedPoste.idPoste,
                designation: PosteAsideReducer.selectedPoste.designation || '',
                actif: PosteAsideReducer.selectedPoste.actif !== undefined ? PosteAsideReducer.selectedPoste.actif : true,
                dateCreation: PosteAsideReducer.selectedPoste.dateCreation,
                userCreation: PosteAsideReducer.selectedPoste.userCreation
            });
        } else {
            setFormData({
                designation: '',
                actif: true
            });
        }
    }, [PosteAsideReducer.selectedPoste]);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };
    
    const onClickBtnClose = () => {
        dispatch(handleClose());
    };
    
    const getModalTitle = () => {
        switch (PosteAsideReducer.modeAside) {
            case 'ADD':
                return messages.addPoste || 'Ajouter un poste';
            case 'EDIT':
                return messages.editPoste || 'Modifier un poste';
            case 'DELETE':
                return messages.deletePoste || 'Supprimer un poste';
            case 'CONSULT':
                return messages.consultPoste || 'Consulter un poste';
            default:
                return '';
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.designation) {
            notify(messages.designationRequired || "La désignation est obligatoire", "error", notifyOptions);
            return;
        }
        
        if (PosteAsideReducer.modeAside === 'ADD') {
            dispatch(addNewPoste(formData))
                .then(() => {
                    notify(messages.addSuccess || "Poste ajouté avec succès", "success", notifyOptions);
                    if (PosteAsideReducer.successCallback) {
                        PosteAsideReducer.successCallback();
                    }
                    dispatch(handleClose());
                })
                .catch(error => {
                    notify(messages.addFailed || "Erreur lors de l'ajout du poste", "error", notifyOptions);
                    console.error(error);
                });
        } else if (PosteAsideReducer.modeAside === 'EDIT') {
            dispatch(editPoste(formData))
                .then(() => {
                    notify(messages.editSuccess || "Poste modifié avec succès", "success", notifyOptions);
                    if (PosteAsideReducer.successCallback) {
                        PosteAsideReducer.successCallback();
                    }
                    dispatch(handleClose());
                })
                .catch(error => {
                    notify(messages.editFailed || "Erreur lors de la modification du poste", "error", notifyOptions);
                    console.error(error);
                });
        } else if (PosteAsideReducer.modeAside === 'DELETE') {
            const handleBtnConfirmerModalConfirmation = () => {
                dispatch(handleCloseModalConfirmation());
                dispatch(deletePoste(formData.idPoste))
                    .then(() => {
                        notify(messages.deleteSuccess || "Poste supprimé avec succès", "success", notifyOptions);
                        dispatch(handleClose());
                        if (successCallback) successCallback();
                    })
                    .catch((error) => {
                        notify(messages.deleteFailed || "Erreur lors de la suppression du poste", "error", notifyOptions);
                        console.error("Erreur suppression poste:", error);
                    });
            };
            
            const handleBtnCancelModalConfirmation = () => {
                dispatch(handleCloseModalConfirmation());
            };
            
            dispatch(handleOpenModalConfirmation(
                messages.confirmDelete || "Êtes-vous sûr de vouloir supprimer ce poste ?",
                handleBtnCancelModalConfirmation,
                handleBtnConfirmerModalConfirmation
            ));
        }
    };
    
    const handleConfirmAction = () => {
        if (
            actionBtnModalConfirmation &&
            typeof actionBtnModalConfirmation.handleBtnConfirmerModalConfirmation === "function"
        ) {
            actionBtnModalConfirmation.handleBtnConfirmerModalConfirmation();
        } else {
            dispatch(handleCloseModalConfirmation());
        }
    };
    
    const renderFooterButtons = () => {
        switch (PosteAsideReducer.modeAside) {
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
            default:
                return null;
        }
    };
    
    return (
        <>
            <Modal
                isOpen={isOpen}
                toggle={onClickBtnClose}
                className="modal-dialog-centered"
                style={{ direction: direction }}
                size="md"
            >
                <ModalHeader toggle={onClickBtnClose}>
                    {getModalTitle()}
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="designation">{messages.designation || "Désignation"}</Label>
                            <Input
                                type="text"
                                name="designation"
                                id="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                disabled={PosteAsideReducer.modeAside === 'CONSULT' || PosteAsideReducer.modeAside === 'DELETE'}
                                required
                            />
                        </FormGroup>
                        
                        <FormGroup check>
                            <Label check>
                                <Input
                                    type="checkbox"
                                    name="actif"
                                    checked={formData.actif}
                                    onChange={handleChange}
                                    disabled={PosteAsideReducer.modeAside === 'CONSULT' || PosteAsideReducer.modeAside === 'DELETE'}
                                />{' '}
                                {messages.active || "Actif"}
                            </Label>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    {renderFooterButtons()}
                </ModalFooter>
            </Modal>
            
            {/* Modal de confirmation */}
            <Modal
                isOpen={isOpenModalConfirmation}
                toggle={() => dispatch(handleCloseModalConfirmation())}
                className="modal-dialog-centered"
                size="sm"
            >
                <ModalHeader toggle={() => dispatch(handleCloseModalConfirmation())}>
                    {messages.confirmation || "Confirmation"}
                </ModalHeader>
                <ModalBody>
                    {messageToShow}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => dispatch(handleCloseModalConfirmation())}>
                        {messages.cancel || "Annuler"}
                    </Button>
                    <Button color="primary" onClick={handleConfirmAction}>
                        {messages.confirm || "Confirmer"}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default PosteAside