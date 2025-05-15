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
                return (
                    <>
                        <i className="fas fa-plus-circle mr-2 text-success"></i>
                        {messages.addPoste || 'Ajouter un poste'}
                    </>
                );
            case 'EDIT':
                return (
                    <>
                        <i className="fas fa-edit mr-2 text-primary"></i>
                        {messages.editPoste || 'Modifier un poste'}
                    </>
                );
            case 'DELETE':
                return (
                    <>
                        <i className="fas fa-trash-alt mr-2 text-danger"></i>
                        {messages.deletePoste || 'Supprimer un poste'}
                    </>
                );
            case 'CONSULT':
                return (
                    <>
                        <i className="fas fa-eye mr-2 text-secondary"></i>
                        {messages.consultPoste || 'Consulter un poste'}
                    </>
                );
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
                        <Button color="secondary" onClick={onClickBtnClose} className="px-4">
                            <i className="fas fa-times mr-2"></i>
                            {messages.cancel || "Annuler"}
                        </Button>
                        <Button color="success" onClick={handleSubmit} className="px-4">
                            <i className="fas fa-plus-circle mr-2"></i>
                            {messages.add || "Ajouter"}
                        </Button>
                    </>
                );
            case 'EDIT':
                return (
                    <>
                        <Button color="secondary" onClick={onClickBtnClose} className="px-4">
                            <i className="fas fa-times mr-2"></i>
                            {messages.cancel || "Annuler"}
                        </Button>
                        <Button color="primary" onClick={handleSubmit} className="px-4">
                            <i className="fas fa-save mr-2"></i>
                            {messages.save || "Enregistrer"}
                        </Button>
                    </>
                );
            case 'DELETE':
                return (
                    <>
                        <Button color="secondary" onClick={onClickBtnClose} className="px-4">
                            <i className="fas fa-times mr-2"></i>
                            {messages.cancel || "Annuler"}
                        </Button>
                        <Button color="danger" onClick={handleSubmit} className="px-4">
                            <i className="fas fa-trash-alt mr-2"></i>
                            {messages.delete || "Supprimer"}
                        </Button>
                    </>
                );
            case 'CONSULT':
                return (
                    <Button color="secondary" onClick={onClickBtnClose} className="px-4">
                        <i className="fas fa-times mr-2"></i>
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
                    {PosteAsideReducer.modeAside === 'DELETE' && (
                        <div className="alert alert-danger mb-4 d-flex align-items-center">
                            <i className="fas fa-exclamation-triangle mr-2"></i>
                            <div>{messages.deleteWarning || "Attention ! Cette action est irréversible. Toutes les données associées à ce poste seront supprimées."}</div>
                        </div>
                    )}
                    <Form onSubmit={handleSubmit}>
                        {PosteAsideReducer.modeAside !== 'ADD' && (
                            <FormGroup>
                                <Label for="idPoste" className="d-flex align-items-center">
                                    <i className="fas fa-hashtag mr-2 text-muted"></i>
                                    ID
                                </Label>
                                <Input
                                    type="text"
                                    name="idPoste"
                                    id="idPoste"
                                    value={formData.idPoste || ''}
                                    readOnly
                                    disabled
                                    className="bg-light"
                                />
                            </FormGroup>
                        )}
                        <FormGroup>
                            <Label for="designation" className="d-flex align-items-center font-weight-bold">
                                {/* <i className="fas fa-briefcase mr-2 text-primary"></i> */}
                                {messages.designation || "Désignation"} <span className="text-danger">*</span>
                            </Label>
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
                        
                        <FormGroup check className="mt-3">
                            <Label check className="d-flex align-items-center">
                                <Input
                                    type="checkbox"
                                    name="actif"
                                    checked={formData.actif}
                                    onChange={handleChange}
                                    disabled={PosteAsideReducer.modeAside === 'CONSULT' || PosteAsideReducer.modeAside === 'DELETE'}
                                    className="mr-2"
                                />{' '}
                                {/* <i className="fas fa-toggle-on mr-2 text-success"></i> */}
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
                <ModalHeader toggle={() => dispatch(handleCloseModalConfirmation())} className="bg-warning text-white">
                    <i className="fas fa-question-circle mr-2"></i>
                    {messages.confirmation || "Confirmation"}
                </ModalHeader>
                <ModalBody className="p-4">
                    <p className="mb-0">{messageToShow}</p>
                </ModalBody>
                <ModalFooter>
                    <Button 
                        color="secondary" 
                        onClick={() => dispatch(handleCloseModalConfirmation())}
                        className="px-3"
                    >
                        <i className="fas fa-times mr-2"></i>
                        {messages.cancel || "Annuler"}
                    </Button>
                    <Button 
                        color="primary" 
                        onClick={handleConfirmAction}
                        className="px-3"
                    >
                        <i className="fas fa-check mr-2"></i>
                        {messages.confirm || "Confirmer"}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default PosteAside