import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label } from 'reactstrap';
import { SelectBox } from 'devextreme-react/select-box';
import notify from 'devextreme/ui/notify';
import { notifyOptions } from '../../Helper/Config';
import { 
    fetchEquipesForDemande, 
    fetchCollaborateursForDemande 
} from '../../Redux/Actions/Demande/DemandeAside';
import axios from 'axios';
import Ressources from '../../Helper/Ressources';

const DemandeAssignationModal = ({ isOpen, toggle, demande, onSuccess }) => {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.intl.messages);
    const allEquipe = useSelector(state => state.DemandeAsideReducer.allEquipe || []);
    const allCollaborateur = useSelector(state => state.DemandeAsideReducer.allCollaborateur || []);
    
    const [selectedEquipe, setSelectedEquipe] = useState(null);
    const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filteredCollaborateurs, setFilteredCollaborateurs] = useState([]);
    
    // Charger les équipes et les collaborateurs au montage du composant
    useEffect(() => {
        if (isOpen) {
            dispatch(fetchEquipesForDemande());
            dispatch(fetchCollaborateursForDemande());
        }
    }, [isOpen, dispatch]);
    
    // Réinitialiser les sélections quand le modal se ferme
    useEffect(() => {
        if (!isOpen) {
            setSelectedEquipe(null);
            setSelectedCollaborateur(null);
            setFilteredCollaborateurs([]);
        } else if (demande) {
            // Pré-remplir avec les valeurs existantes si disponibles
            setSelectedEquipe(demande.equipe ? demande.equipe.idEquipe : null);
            setSelectedCollaborateur(demande.collaborateur ? demande.collaborateur.username : null);
        }
    }, [isOpen, demande]);
    
    // Filtrer les collaborateurs lorsque l'équipe change
    useEffect(() => {
        if (selectedEquipe) {
            // Filtrer les collaborateurs qui appartiennent à l'équipe sélectionnée
            const collaborateursEquipe = allCollaborateur.filter(
                collaborateur => collaborateur.idEquipe === selectedEquipe
            );
            setFilteredCollaborateurs(collaborateursEquipe);
            
            // Réinitialiser le collaborateur sélectionné si celui-ci n'appartient pas à la nouvelle équipe
            if (selectedCollaborateur) {
                const collaborateurExisteDansEquipe = collaborateursEquipe.some(
                    c => c.username === selectedCollaborateur
                );
                if (!collaborateurExisteDansEquipe) {
                    setSelectedCollaborateur(null);
                }
            }
        } else {
            setFilteredCollaborateurs([]);
            setSelectedCollaborateur(null);
        }
    }, [selectedEquipe, allCollaborateur, selectedCollaborateur]);
    
    const handleEquipeChange = (e) => {
        setSelectedEquipe(e.value);
    };
    
    const handleCollaborateurChange = (e) => {
        setSelectedCollaborateur(e.value);
    };
    
    const handleSubmit = async () => {
        if (!demande || !demande.idDemande) {
            notify(messages.selectDemandeFirst || "Veuillez d'abord sélectionner une demande", "error", notifyOptions);
            return;
        }
        
        if (!selectedEquipe) {
            notify(messages.selectEquipeRequired || "La sélection d'une équipe est obligatoire", "warning", notifyOptions);
            return;
        }
        
        // Ajouter des logs de débogage
        console.log("Demande ID:", demande.idDemande);
        console.log("Équipe sélectionnée:", selectedEquipe);
        console.log("Collaborateur sélectionné:", selectedCollaborateur);
        
        setLoading(true);
        
        try {
            let response;
            
            if (selectedEquipe && selectedCollaborateur) {
                // Assigner les deux
                const urlBoth = `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.demandes}/${demande.idDemande}/equipe/${selectedEquipe}/collaborateur/${selectedCollaborateur}`;
                console.log("URL pour équipe et collaborateur:", urlBoth);
                
                response = await axios.put(urlBoth);
                notify(messages.teamAndCollabAssignSuccess || "Équipe et collaborateur assignés avec succès", "success", notifyOptions);
            } else if (selectedEquipe) {
                // Assigner seulement l'équipe
                const urlEquipe = `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.demandes}/${demande.idDemande}/equipe/${selectedEquipe}`;
                console.log("URL pour équipe seulement:", urlEquipe);
                
                response = await axios.put(urlEquipe);
                notify(messages.teamAssignSuccess || "Équipe assignée avec succès", "success", notifyOptions);
            }
            
            // Callback de succès
            if (onSuccess) onSuccess(response.data);
            
            // Fermer le modal
            toggle();
        } catch (error) {
            console.error("Erreur lors de l'assignation:", error);
            console.error("Détails de l'erreur:", error.response ? error.response.data : "Pas de détails disponibles");
            
            let errorMessage = "Erreur lors de l'assignation";
            
            // Gestion améliorée des erreurs
            if (error.response) {
                if (error.response.status === 409 || 
                    (error.response.data && error.response.data.message === 'CONFLICT')) {
                    errorMessage = messages.teamAlreadyAssigned || "Cette demande est déjà assignée à une équipe";
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                    if (error.response.data.description) {
                        errorMessage += `: ${error.response.data.description}`;
                    }
                }
            }
            
            notify(errorMessage, "error", notifyOptions);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} toggle={toggle} className="modal-assignation">
            <ModalHeader toggle={toggle} className="bg-primary text-white">
                <i className="fas fa-user-tag mr-2"></i> {messages.assignDemande || "Affecter la demande"}
            </ModalHeader>
            <ModalBody className="p-4">
                <Form>
                    {demande && (
                        <div className="mb-4 p-3 bg-light rounded border-left border-primary" style={{ borderLeftWidth: '4px' }}>
                            <strong>{messages.demande || "Demande"}:</strong> #{demande.idDemande} - {demande.description}
                        </div>
                    )}
                    
                    <FormGroup>
                        <Label for="equipe" className="font-weight-bold">
                            {messages.equipe || "Équipe"} <span className="text-danger">*</span>
                        </Label>
                        <SelectBox
                            dataSource={allEquipe}
                            displayExpr="designation"
                            valueExpr="idEquipe"
                            value={selectedEquipe}
                            onValueChanged={handleEquipeChange}
                            placeholder={messages.selectEquipe || "Sélectionner une équipe"}
                            showClearButton={true}
                            searchEnabled={true}
                            stylingMode="filled"
                            className="form-control-modern"
                        />
                        <small className="text-info mt-1 d-block">
                            <i className="fas fa-info-circle mr-1"></i>
                            {messages.teamAssignmentInfo || "L'affectation d'une équipe est obligatoire"}
                        </small>
                    </FormGroup>
                    
                    <FormGroup>
                        <Label for="collaborateur" className="font-weight-bold">
                            {messages.collaborateur || "Collaborateur"} <span className="text-muted">(Optionnel)</span>
                        </Label>
                        <SelectBox
                            dataSource={filteredCollaborateurs}
                            displayExpr={item => item ? `${item.prenom} ${item.nom}` : ''}
                            valueExpr="username"
                            value={selectedCollaborateur}
                            onValueChanged={handleCollaborateurChange}
                            placeholder={selectedEquipe ? (messages.selectCollaborateur || "Sélectionner un collaborateur") : (messages.selectEquipeFirst || "Veuillez d'abord sélectionner une équipe")}
                            showClearButton={true}
                            searchEnabled={true}
                            disabled={!selectedEquipe}
                            stylingMode="filled"
                            className="form-control-modern"
                        />
                        <small className="text-muted mt-1 d-block">
                            <i className="fas fa-info-circle mr-1"></i>
                            {messages.collaboratorOptional || "L'affectation d'un collaborateur est optionnelle"}
                        </small>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle} disabled={loading}>
                    {messages.cancel || "Annuler"}
                </Button>
                <Button color="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                            {messages.processing || "Traitement..."}
                        </>
                    ) : (
                        <>
                            <i className="fas fa-check mr-2"></i>
                            {messages.assign || "Affecter"}
                        </>
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default DemandeAssignationModal;