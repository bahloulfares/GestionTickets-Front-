import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { handleClose } from "../../Redux/Actions/Poste/PosteAside";
import { addNewPoste, editPoste, deletePoste } from "../../Redux/Actions/Poste/Poste";
import notify from "devextreme/ui/notify";
import { notifyOptions } from '../../Helper/Config';

const PosteAside = () => {
    const dispatch = useDispatch();
    const PosteAsideReducer = useSelector(state => state.PosteAsideReducer);
    const messages = useSelector(state => state.intl.messages);
    
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
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.designation) {
            notify("La désignation est obligatoire", "error", notifyOptions);
            return;
        }
        
        if (PosteAsideReducer.modeAside === 'ADD') {
            dispatch(addNewPoste(formData))
                .then(() => {
                    notify("Poste ajouté avec succès", "success", notifyOptions);
                    if (PosteAsideReducer.successCallback) {
                        PosteAsideReducer.successCallback();
                    }
                    dispatch(handleClose());
                })
                .catch(error => {
                    notify("Erreur lors de l'ajout du poste", "error", notifyOptions);
                    console.error(error);
                });
        } else if (PosteAsideReducer.modeAside === 'EDIT') {
            dispatch(editPoste(formData))
                .then(() => {
                    notify("Poste modifié avec succès", "success", notifyOptions);
                    if (PosteAsideReducer.successCallback) {
                        PosteAsideReducer.successCallback();
                    }
                    dispatch(handleClose());
                })
                .catch(error => {
                    notify("Erreur lors de la modification du poste", "error", notifyOptions);
                    console.error(error);
                });
        } else if (PosteAsideReducer.modeAside === 'DELETE') {
            dispatch(deletePoste(formData.idPoste))
                .then(() => {
                    notify("Poste supprimé avec succès", "success", notifyOptions);
                    if (PosteAsideReducer.successCallback) {
                        PosteAsideReducer.successCallback();
                    }
                    dispatch(handleClose());
                })
                .catch(error => {
                    notify("Erreur lors de la suppression du poste", "error", notifyOptions);
                    console.error(error);
                });
        }
    };
    
    const getModalTitle = () => {
        switch (PosteAsideReducer.modeAside) {
            case 'ADD':
                return 'Ajouter un poste';
            case 'EDIT':
                return 'Modifier un poste';
            case 'DELETE':
                return 'Supprimer un poste';
            case 'CONSULT':
                return 'Consulter un poste';
            default:
                return '';
        }
    };
    
    return (
        <Modal
            isOpen={PosteAsideReducer.isOpen}
            toggle={() => dispatch(handleClose())}
            className="modal-dialog-centered"
            size="md"
        >
            <ModalHeader toggle={() => dispatch(handleClose())}>
                {getModalTitle()}
            </ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="designation">Désignation</Label>
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
                            Actif
                        </Label>
                    </FormGroup>
                    
                    {/* {(PosteAsideReducer.modeAside === 'CONSULT' || PosteAsideReducer.modeAside === 'EDIT' || PosteAsideReducer.modeAside === 'DELETE') && (
                        <>
                            <FormGroup>
                                <Label for="dateCreation">Date de création</Label>
                                <Input
                                    type="text"
                                    name="dateCreation"
                                    id="dateCreation"
                                    value={formData.dateCreation}
                                    disabled
                                />
                            </FormGroup>
                            
                            <FormGroup>
                                <Label for="userCreation">Utilisateur création</Label>
                                <Input
                                    type="text"
                                    name="userCreation"
                                    id="userCreation"
                                    value={formData.userCreation}
                                    disabled
                                />
                            </FormGroup>
                        </>
                    )} */}
                    
                    {PosteAsideReducer.modeAside === 'DELETE' && (
                        <div className="alert alert-danger mt-3">
                            Êtes-vous sûr de vouloir supprimer ce poste ?
                        </div>
                    )}
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={() => dispatch(handleClose())}>
                    Annuler
                </Button>
                {PosteAsideReducer.modeAside !== 'CONSULT' && (
                    <Button 
                        color={PosteAsideReducer.modeAside === 'DELETE' ? 'danger' : 'primary'} 
                        onClick={handleSubmit}
                    >
                        {PosteAsideReducer.modeAside === 'ADD' ? 'Ajouter' : 
                         PosteAsideReducer.modeAside === 'EDIT' ? 'Modifier' : 'Supprimer'}
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
};

export default PosteAside