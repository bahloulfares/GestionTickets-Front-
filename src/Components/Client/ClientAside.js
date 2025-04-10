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
        }
    };
    
    const handleDelete = () => {
        dispatch(deleteClient(ClientAsideReducer.selectedClient.idClient))
            .then(() => {
                notify(messages.SuccessDelete || "Client supprimé avec succès", "success", notifyOptions);
                dispatch(handleClose());
                if (ClientAsideReducer.successCallback) {
                    ClientAsideReducer.successCallback();
                }
            })
            .catch(error => {
                notify(messages.ErrorDelete || "Erreur lors de la suppression du client", "error", notifyOptions);
            });
    };
    
    const handleConfirmDelete = () => {
        // Make sure we're directly calling handleDelete instead of passing it to the modal
        handleDelete();
        
        // Or if you want to keep the confirmation modal:
        /*
        dispatch(handleOpenModalConfirmation(
            messages.ConfirmDelete || "Êtes-vous sûr de vouloir supprimer ce client ?",
            () => dispatch(handleCloseModalConfirmation()),
            handleDelete
        ));
        */
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
                        <Label for="idClient">ID</Label>
                        <Input
                            type="text"
                            name="idClient"
                            id="idClient"
                            value={formData.idClient || ''}
                            readOnly={true}
                            disabled={true}
                        />
                    </FormGroup>
                )}
                <FormGroup>
                    <Label for="nom">{messages.Nom || "Nom"}</Label>
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
                
                {/* ... rest of the form remains unchanged ... */}
                <FormGroup>
                    <Label for="telephone">{messages.Telephone || "Téléphone"}</Label>
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
                    <Label for="email">{messages.Email || "Email"}</Label>
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
                    <Label for="adresse">{messages.Adresse || "Adresse"}</Label>
                    <Input
                        type="text"
                        name="adresse"
                        id="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        readOnly={isReadOnly}
                    />
                </FormGroup>
                
                {ClientAsideReducer.modeAside === 'ADD' && (
                    <Button color="primary" type="submit">
                        {messages.Save || "Enregistrer"}
                    </Button>
                )}
                
                {ClientAsideReducer.modeAside === 'EDIT' && (
                    <Button color="primary" type="submit">
                        {messages.Update || "Mettre à jour"}
                    </Button>
                )}
                
                {ClientAsideReducer.modeAside === 'DELETE' && (
                    <Button color="danger" onClick={handleConfirmDelete}>
                        {messages.Delete || "Supprimer"}
                    </Button>
                )}
                
                <Button color="secondary" onClick={() => dispatch(handleClose())} className="ml-2">
                    {messages.Cancel || "Annuler"}
                </Button>
            </Form>
        );
    };
    
    return (
        <>
            <Modal isOpen={ClientAsideReducer.isOpen} toggle={() => dispatch(handleClose())} size="lg">
                <ModalHeader toggle={() => dispatch(handleClose())}>
                    {ClientAsideReducer.modeAside === 'ADD' && (messages.AddClient || "Ajouter un client")}
                    {ClientAsideReducer.modeAside === 'EDIT' && (messages.EditClient || "Modifier un client")}
                    {ClientAsideReducer.modeAside === 'DELETE' && (messages.DeleteClient || "Supprimer un client")}
                    {ClientAsideReducer.modeAside === 'CONSULT' && (messages.ConsultClient || "Consulter un client")}
                </ModalHeader>
                <ModalBody>
                    {renderForm()}
                </ModalBody>
            </Modal>
        </>
    );
};

export default ClientAside;