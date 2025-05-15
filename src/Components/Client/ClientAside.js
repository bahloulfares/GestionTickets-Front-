import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { handleClose, handleOpenModalConfirmation, handleCloseModalConfirmation } from "../../Redux/Actions/Client/ClientAside";
import { addNewClient, editClient, deleteClient } from "../../Redux/Actions/Client/Client";
import notify from "devextreme/ui/notify";
import { notifyOptions } from '../../Helper/Config';

const ClientAside = () => {
    const dispatch = useDispatch();
    const ClientAsideReducer = useSelector(state => state.ClientAsideReducer);
    const messages = useSelector(state => state.intl.messages);
    const { successCallback } = ClientAsideReducer;

    const [formData, setFormData] = useState({
        nom: '',
        telephone: '',
        email: '',
        adresse: ''
    });
    
    useEffect(() => {
        if (ClientAsideReducer.selectedClient) {
            setFormData({
                idClient: ClientAsideReducer.selectedClient.idClient,
                nom: ClientAsideReducer.selectedClient.nom || '',
                telephone: ClientAsideReducer.selectedClient.telephone || '',
                email: ClientAsideReducer.selectedClient.email || '',
                adresse: ClientAsideReducer.selectedClient.adresse || ''
            });
        } else {
            setFormData({
                nom: '',
                telephone: '',
                email: '',
                adresse: ''
            });
        }
    }, [ClientAsideReducer.selectedClient]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    // Replace the handleDelete and handleConfirmDelete functions with this implementation
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (ClientAsideReducer.modeAside === 'ADD') {
            dispatch(addNewClient(formData))
                .then(() => {
                    notify(messages.SuccessAdd || "Client ajouté avec succès", "success", notifyOptions);
                    dispatch(handleClose());
                    if (ClientAsideReducer.successCallback) {
                        ClientAsideReducer.successCallback();
                    }
                })
                .catch(error => {
                    notify(messages.ErrorAdd || "Erreur lors de l'ajout du client", "error", notifyOptions);
                });
        } else if (ClientAsideReducer.modeAside === 'EDIT') {
            dispatch(editClient(formData))
                .then(() => {
                    notify(messages.SuccessEdit || "Client modifié avec succès", "success", notifyOptions);
                    dispatch(handleClose());
                    if (ClientAsideReducer.successCallback) {
                        ClientAsideReducer.successCallback();
                    }
                })
                .catch(error => {
                    notify(messages.ErrorEdit || "Erreur lors de la modification du client", "error", notifyOptions);
                });
        } else if (ClientAsideReducer.modeAside === 'DELETE') {
            // Use the confirmation modal for delete
            const handleBtnConfirmerModalConfirmation = () => {
                dispatch(handleCloseModalConfirmation());
                dispatch(deleteClient(formData.idClient))                
                .then(() => {
                    notify(messages.SuccessDelete || "Client supprimé avec succès", "success", notifyOptions);
                    dispatch(handleClose());
                    if (ClientAsideReducer.successCallback) {
                        ClientAsideReducer.successCallback();
                    }
                })
                .catch((error) => {
                    notify(messages.ErrorDelete || "Erreur lors de la suppression du client", "error", notifyOptions);
                    console.error("Delete client error:", error);
                });
            };
            
            const handleBtnCancelModalConfirmation = () => {
                dispatch(handleCloseModalConfirmation());
            };
            
            dispatch(handleOpenModalConfirmation(
                "Êtes-vous sûr de vouloir supprimer ce client ?",
                handleBtnCancelModalConfirmation,
                handleBtnConfirmerModalConfirmation
            ));
            return; // Ajout de cette ligne pour empêcher l'exécution du reste du code
        }
    };
    
    // Add this function to handle confirmation actions
    const handleConfirmAction = () => {
        console.log("handleConfirmAction called", ClientAsideReducer.actionBtnModalConfirmation);
        if (ClientAsideReducer.actionBtnModalConfirmation && 
            typeof ClientAsideReducer.actionBtnModalConfirmation.handleBtnConfirmerModalConfirmation === "function") {
            ClientAsideReducer.actionBtnModalConfirmation.handleBtnConfirmerModalConfirmation();
        } else {
            console.error("La fonction de confirmation n'est pas disponible");
            dispatch(handleCloseModalConfirmation());
        }
    };
    
    const renderForm = () => {
        // Correction ici: les champs doivent être en lecture seule en mode CONSULT et DELETE
        const isReadOnly = ClientAsideReducer.modeAside === 'CONSULT' || ClientAsideReducer.modeAside === 'DELETE';
        
        return (
            <Form onSubmit={handleSubmit}>
                {/* Add ID field for EDIT, DELETE and CONSULT modes */}
                {(ClientAsideReducer.modeAside === 'EDIT' || 
                  ClientAsideReducer.modeAside === 'DELETE' || 
                  ClientAsideReducer.modeAside === 'CONSULT') && (
                    <FormGroup>
                        <Label for="idClient" className="d-flex align-items-center">
                            <i className="fas fa-hashtag mr-2 text-muted"></i>
                            ID
                        </Label>
                        <Input
                            type="text"
                            name="idClient"
                            id="idClient"
                            value={formData.idClient || ''}
                            readOnly={true}
                            disabled={true}
                            className="bg-light"
                        />
                    </FormGroup>
                )}
                <FormGroup>
                    <Label for="nom" className="d-flex align-items-center font-weight-bold">
                        <i className="fas fa-building mr-2 text-primary"></i>
                        {messages.Nom || "Nom"} <span className="text-danger">*</span>
                    </Label>
                    <Input
                        type="text"
                        name="nom"
                        id="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        readOnly={isReadOnly}
                        required
                    />
                </FormGroup>
                
                <FormGroup>
                    <Label for="telephone" className="d-flex align-items-center font-weight-bold">
                        <i className="fas fa-phone mr-2 text-success"></i>
                        {messages.Telephone || "Téléphone"}
                    </Label>
                    <Input
                        type="text"
                        name="telephone"
                        id="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        readOnly={isReadOnly}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="email" className="d-flex align-items-center font-weight-bold">
                        <i className="fas fa-envelope mr-2 text-warning"></i>
                        {messages.Email || "Email"}
                    </Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        readOnly={isReadOnly}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="adresse" className="d-flex align-items-center font-weight-bold">
                        <i className="fas fa-map-marker-alt mr-2 text-danger"></i>
                        {messages.Adresse || "Adresse"}
                    </Label>
                    <Input
                        type="text"
                        name="adresse"
                        id="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        readOnly={isReadOnly}
                    />
                </FormGroup>
                
                <div className="d-flex justify-content-end mt-4">
                    <Button color="secondary" onClick={() => dispatch(handleClose())} className="mr-2 px-4">
                        <i className="fas fa-times mr-2"></i>
                        {messages.Cancel || "Annuler"}
                    </Button>
                    
                    {ClientAsideReducer.modeAside === 'ADD' && (
                        <Button color="success" type="submit" className="px-4">
                            <i className="fas fa-plus-circle mr-2"></i>
                            {messages.Save || "Enregistrer"}
                        </Button>
                    )}
                    
                    {ClientAsideReducer.modeAside === 'EDIT' && (
                        <Button color="primary" type="submit" className="px-4">
                            <i className="fas fa-save mr-2"></i>
                            {messages.Update || "Mettre à jour"}
                        </Button>
                    )}
                    
                    {ClientAsideReducer.modeAside === 'DELETE' && (
                        <Button color="danger" type="submit" className="px-4">
                            <i className="fas fa-trash-alt mr-2"></i>
                            {messages.Delete || "Supprimer"}
                        </Button>
                    )}
                    
                    {ClientAsideReducer.modeAside === 'CONSULT' && (
                        <Button color="secondary" onClick={() => dispatch(handleClose())} className="px-4">
                            <i className="fas fa-times mr-2"></i>
                            {messages.Close || "Fermer"}
                        </Button>
                    )}
                </div>
            </Form>
        );
    };
    
    return (
        <>
            <Modal isOpen={ClientAsideReducer.isOpen} toggle={() => dispatch(handleClose())} size="lg">
                <ModalHeader toggle={() => dispatch(handleClose())}>
                    {ClientAsideReducer.modeAside === 'ADD' && (
                        <>
                            <i className="fas fa-plus-circle mr-2 text-success"></i>
                            {messages.AddClient || "Ajouter un client"}
                        </>
                    )}
                    {ClientAsideReducer.modeAside === 'EDIT' && (
                        <>
                            <i className="fas fa-edit mr-2 text-primary"></i>
                            {messages.EditClient || "Modifier un client"}
                        </>
                    )}
                    {ClientAsideReducer.modeAside === 'DELETE' && (
                        <>
                            <i className="fas fa-trash-alt mr-2 text-danger"></i>
                            {messages.DeleteClient || "Supprimer un client"}
                        </>
                    )}
                    {ClientAsideReducer.modeAside === 'CONSULT' && (
                        <>
                            <i className="fas fa-eye mr-2 text-secondary"></i>
                            {messages.ConsultClient || "Consulter un client"}
                        </>
                    )}
                </ModalHeader>
                <ModalBody>
                    {ClientAsideReducer.modeAside === 'DELETE' && (
                        <div className="alert alert-danger mb-4 d-flex align-items-center">
                            <i className="fas fa-exclamation-triangle mr-2"></i>
                            <div>{messages.deleteWarning || "Attention ! Cette action est irréversible. Toutes les données associées à ce client seront supprimées."}</div>
                        </div>
                    )}
                    {renderForm()}
                </ModalBody>
            </Modal>
            
            {/* Add the confirmation modal */}
            <Modal
                isOpen={ClientAsideReducer.isOpenModalConfirmation}
                toggle={() => dispatch(handleCloseModalConfirmation())}
                className="modal-dialog-centered"
                size="sm"
            >
                <ModalHeader toggle={() => dispatch(handleCloseModalConfirmation())} className="bg-warning text-white">
                    <i className="fas fa-question-circle mr-2"></i>
                    {messages.Confirmation || "Confirmation"}
                </ModalHeader>
                <ModalBody className="p-4">
                    <p className="mb-0">{ClientAsideReducer.messageToShow || "Êtes-vous sûr de vouloir supprimer ce client ?"}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => dispatch(handleCloseModalConfirmation())} className="px-3">
                        <i className="fas fa-times mr-2"></i>
                        {messages.Cancel || "Annuler"}
                    </Button>
                    <Button color="primary" onClick={() => {
                        dispatch(handleCloseModalConfirmation());
                        dispatch(deleteClient(formData.idClient))
                            .then(() => {
                                notify(messages.SuccessDelete || "Client supprimé avec succès", "success", notifyOptions);
                                dispatch(handleClose());
                                if (ClientAsideReducer.successCallback) {
                                    ClientAsideReducer.successCallback();
                                }
                            })
                            .catch((error) => {
                                notify(messages.ErrorDelete || "Erreur lors de la suppression du client", "error", notifyOptions);
                                console.error("Delete client error:", error);
                            });
                    }} className="px-3">
                        <i className="fas fa-check mr-2"></i>
                        {messages.Confirm || "Confirmer"}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default ClientAside;