import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import {
  handleClose,
  handleOpenModalConfirmation,
  handleCloseModalConfirmation,
} from "../../Redux/Actions/Demande/DemandeAside";
import {
  addDemande,
  updateDemande,
  deleteDemande,
  getAllDemandes
} from "../../Redux/Actions/Demande/Demande";
import notify from "devextreme/ui/notify";
import { notifyOptions } from '../../Helper/Config';
import '../../assests/css/modals.css';
import { ETATS_DEMANDE, PRIORITES_DEMANDE } from '../../Helper/Enums/Demande';
import SelectBox from 'devextreme-react/select-box';
import { fetchClientsForDemande, fetchModulesForDemande } from "../../Redux/Actions/Demande/DemandeAside";

// Ajoutez ces imports
import { fetchEquipesForDemande, fetchCollaborateursForDemande } from "../../Redux/Actions/Demande/DemandeAside";
import DemandeAssignationModal from './DemandeAssignationModal';

const DemandeAside = () => {
  const dispatch = useDispatch();
  const {
    isOpen,
    modeAside,
    selectedDemande,
    successCallback,
    isOpenModalConfirmation,
    messageToShow,
    actionBtnModalConfirmation,
    allClient,
    allModule,
    allEquipe,
    allCollaborateur
  } = useSelector((state) => state.DemandeAsideReducer);

  // Récupérer l'utilisateur connecté depuis le store Redux
  const userAuthentification = useSelector((state) => state.LoginReducer.userAuthentification);

  const messages = useSelector((state) => state.intl.messages);
  const direction = useSelector((state) => state.intl.direction);

  const [formData, setFormData] = useState({
    idDemande: null,
    description: '',
    //dateCreation: new Date(),
    dateEcheance: null,
    etat: ETATS_DEMANDE.DEMANDE_CREEE,
    priorite: PRIORITES_DEMANDE.NORMALE,
    commentaire: '',
    client: null,
    module: null,
    equipe: null,
    collaborateur: null,
    //createur: null // Ajout du champ createur
  });

  // Ajout d'un état pour stocker les collaborateurs filtrés
  const [filteredCollaborateurs, setFilteredCollaborateurs] = useState([]);

  useEffect(() => {
    if (selectedDemande && modeAside !== "ADD") {
      setFormData({
        idDemande: selectedDemande.idDemande || null,
        description: selectedDemande.description || '',
        //dateCreation: selectedDemande.dateCreation || new Date(),
        dateEcheance: selectedDemande.dateEcheance || null,
        etat: selectedDemande.etat || ETATS_DEMANDE.DEMANDE_CREEE,
        priorite: selectedDemande.priorite || PRIORITES_DEMANDE.NORMALE,
        commentaire: selectedDemande.commentaire || '',
        client: selectedDemande.client || null,
        module: selectedDemande.module || null,
        equipe: selectedDemande.equipe || null,
        collaborateur: selectedDemande.collaborateur || null,
        //createur: selectedDemande.createur || userAuthentification // Utiliser l'utilisateur connecté si pas de créateur existant
      });
    } else {
      setFormData({
        idDemande: null,
        description: '',
        //dateCreation: new Date(),
        dateEcheance: null,
        etat: ETATS_DEMANDE.DEMANDE_CREEE,
        priorite: PRIORITES_DEMANDE.NORMALE,
        commentaire: '',
        client: null,
        module: null,
        equipe: null,
        collaborateur: null,
        //createur: userAuthentification // Définir l'utilisateur connecté comme créateur par défaut
      });
    }
  }, [selectedDemande, modeAside, userAuthentification]);

  useEffect(() => {
    if (isOpen) {
      // Charger les clients et les modules lorsque le modal s'ouvre
      dispatch(fetchClientsForDemande());
      dispatch(fetchModulesForDemande());
      // Ajouter ces lignes pour charger les équipes et collaborateurs
      dispatch(fetchEquipesForDemande());
      dispatch(fetchCollaborateursForDemande());
    }
  }, [isOpen, dispatch]);
  


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Ajouter cet useEffect pour filtrer les collaborateurs en fonction de l'équipe sélectionnée
  useEffect(() => {
    if (formData.equipe && allCollaborateur && allCollaborateur.length > 0) {
      // Filtrer les collaborateurs qui appartiennent à l'équipe sélectionnée
      const collaborateursEquipe = allCollaborateur.filter(
        collaborateur => collaborateur.idEquipe === formData.equipe.idEquipe
      );
      setFilteredCollaborateurs(collaborateursEquipe);
      
      // Réinitialiser le collaborateur sélectionné si celui-ci n'appartient pas à la nouvelle équipe
      if (formData.collaborateur) {
        const collaborateurExisteDansEquipe = collaborateursEquipe.some(
          c => c.username === formData.collaborateur.username
        );
        if (!collaborateurExisteDansEquipe) {
          setFormData(prev => ({
            ...prev,
            collaborateur: null
          }));
        }
      }
    } else {
      // Si aucune équipe n'est sélectionnée, afficher tous les collaborateurs
      setFilteredCollaborateurs(allCollaborateur || []);
    }
  }, [formData.equipe, allCollaborateur, formData.collaborateur]);

  const handleSelectChange = (fieldName, value) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: value
    }));
  };

  const onClickBtnClose = () => {
    dispatch(handleClose());
  };

  const getModalTitle = () => {
    switch (modeAside) {
      case 'ADD':
        return messages.addDemande || 'Ajouter une demande';
      case 'EDIT':
        return messages.editDemande || 'Modifier une demande';
      case 'DELETE':
        return messages.deleteDemande || 'Supprimer une demande';
      case 'CONSULT':
        return messages.consultDemande || 'Consulter une demande';
      default:
        return '';
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Validation pour ADD et EDIT
    if (modeAside !== 'DELETE' && !formData.description) {
      notify(messages.descriptionRequired || "La description est obligatoire", "error", notifyOptions);
      return;
    }

    console.log("Mode aside:", modeAside);
    console.log("Form data:", formData);

    // Désactiver le bouton pendant le traitement
    const btnSubmit = document.querySelector(
      ".modal-demande .btn-primary, .modal-demande .btn-danger"
    );
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Traitement...';
    }

    let actionPromise;
    const dataToSubmit = { 
      ...formData,
      // S'assurer que le créateur est toujours inclus dans les données soumises
      //createur: formData.createur || userAuthentification
    };

    try {
      switch (modeAside) {
        case 'ADD':
          actionPromise = dispatch(addDemande(dataToSubmit));
          break;
        case 'EDIT':
          actionPromise = dispatch(updateDemande(dataToSubmit));
          break;
        case 'DELETE':
          actionPromise = dispatch(deleteDemande(dataToSubmit.idDemande));
          break;
        default:
          console.error("Mode non reconnu:", modeAside);
          return;
      }

      if (actionPromise && typeof actionPromise.then === "function") {
        actionPromise
          .then((result) => {
            let messageSuccess = "";
            if (modeAside === "ADD") {
              messageSuccess = messages.demandeAddSuccess || "Demande ajoutée avec succès";
              
              // Réinitialiser le formulaire après l'ajout d'une demande
              setFormData({
                idDemande: null,
                description: '',
               // dateCreation: new Date(),
                dateEcheance: null,
                etat: ETATS_DEMANDE.DEMANDE_CREEE,
                priorite: PRIORITES_DEMANDE.NORMALE,
                commentaire: '',
                client: null,
                module: null,
                equipe: null,
                collaborateur: null,
                //createur: userAuthentification
              });
            } else if (modeAside === "EDIT") {
              messageSuccess = messages.demandeEditSuccess || "Demande modifiée avec succès";
            } else if (modeAside === "DELETE") {
              messageSuccess = messages.demandeDeleteSuccess || "Demande supprimée avec succès";
            }

            notify(messageSuccess, "success", notifyOptions);
            
            // Fermer les modales
            dispatch(handleCloseModalConfirmation());
            dispatch(handleClose());
            
            // Rafraîchir la grille si un callback est fourni
            if (successCallback && typeof successCallback === "function") {
              successCallback();
            } else {
              // Rafraîchir la liste des demandes si aucun callback n'est fourni
              dispatch(getAllDemandes());
            }
          })
          .catch((error) => {
            let messageError = "";
            if (modeAside === "ADD") {
              messageError = messages.demandeAddError || "Erreur lors de l'ajout de la demande";
            } else if (modeAside === "EDIT") {
              messageError = messages.demandeEditError || "Erreur lors de la modification de la demande";
            } else if (modeAside === "DELETE") {
              messageError = messages.demandeDeleteError || "Erreur lors de la suppression de la demande";
            }

            notify(messageError, "error", notifyOptions);
            console.error("Erreur:", error);
            
            // Fermer quand même les modales en cas d'erreur
            //dispatch(handleCloseModalConfirmation());
            //dispatch(handleClose());
          })
          .finally(() => {
            // Réactiver le bouton après le traitement
            if (btnSubmit) {
              btnSubmit.disabled = false;
              btnSubmit.innerHTML = modeAside === "DELETE" 
                ? (messages.delete || "Supprimer") 
                : (messages.save || "Enregistrer");
            }
          });
      } else {
        // Si actionPromise n'est pas une promesse, fermer quand même les modales
        notify(messages.operationCompleted || "Opération terminée", "success", notifyOptions);
        dispatch(handleCloseModalConfirmation());
        dispatch(handleClose());
      }
    } catch (error) {
      console.error("Erreur lors de l'exécution de l'action:", error);
      notify(messages.unexpectedError || "Une erreur inattendue s'est produite", "error", notifyOptions);
      
      // Fermer quand même les modales en cas d'erreur
      //dispatch(handleCloseModalConfirmation());
      //dispatch(handleClose());
      
      // Réactiver le bouton en cas d'erreur
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = modeAside === "DELETE" 
          ? (messages.delete || "Supprimer") 
          : (messages.save || "Enregistrer");
      }
    }
  };

  // Fonction de confirmation centralisée, similaire à EquipeAside
  const handleConfirmation = () => {
    const message =
      modeAside === "DELETE"
        ? messages.confirmDeleteDemande || "Êtes-vous sûr de vouloir supprimer cette demande ?"
        : messages.confirmSaveDemande || "Voulez-vous enregistrer les modifications ?";
  
    if (modeAside === "DELETE") {
      const handleBtnConfirmerModalConfirmation = () => {
        dispatch(handleCloseModalConfirmation());
        dispatch(deleteDemande(formData.idDemande))
          .then(() => {
            notify(
              messages?.demandeDeleteSuccess || "Demande supprimée avec succès",
              "success",
              notifyOptions
            );
            dispatch(handleClose());
            if (successCallback && typeof successCallback === "function") {
              setTimeout(() => {
                successCallback();
              }, 100);
            }
          })
          .catch((error) => {
            console.error("Erreur suppression demande:", error);
            notify(
              error.message || "Erreur lors de la suppression",
              "error",
              notifyOptions
            );
          });
      };
  
      const handleBtnCancelModalConfirmation = () => {
        dispatch(handleCloseModalConfirmation());
      };
  
      // Ouvrir le modal de confirmation
      dispatch(
        handleOpenModalConfirmation(
          message,
          handleBtnCancelModalConfirmation,
          handleBtnConfirmerModalConfirmation
        )
      );
    } else {
      // Pour les modes ADD et EDIT, on utilise handleSubmit directement
      handleSubmit();
    }
  };

  // Action de confirmation appelée par le bouton "Confirmer" du modal
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
    switch (modeAside) {
      case 'ADD':
        return (
          <>
            <Button color="secondary" onClick={onClickBtnClose} className="px-4">
              <i className="fas fa-times mr-2"></i>
              {messages.cancel || "Annuler"}
            </Button>
            <Button color="success" onClick={handleConfirmation} className="px-4">
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
            <Button color="primary" onClick={handleConfirmation} className="px-4">
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
            <Button color="danger" onClick={handleConfirmation} className="px-4">
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

  // Fonction pour rendre les champs en lecture seule en mode CONSULT ou DELETE
  const isReadOnly = modeAside === 'CONSULT' || modeAside === 'DELETE';
  
  // Nouvelle fonction pour déterminer si les champs équipe et collaborateur sont en lecture seule
  const isTeamAndCollabReadOnly = isReadOnly || modeAside === 'ADD' || modeAside === 'EDIT';

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={onClickBtnClose}
        className="modal-demande"
        style={{ direction: direction }}
        size="lg"
      >
        <ModalHeader toggle={onClickBtnClose}>
          {modeAside === 'ADD' && <i className="fas fa-plus-circle mr-2 text-success"></i>}
          {modeAside === 'EDIT' && <i className="fas fa-edit mr-2 text-primary"></i>}
          {modeAside === 'DELETE' && <i className="fas fa-trash-alt mr-2 text-danger"></i>}
          {modeAside === 'CONSULT' && <i className="fas fa-eye mr-2 text-secondary"></i>}
          {getModalTitle()}
        </ModalHeader>
        <ModalBody>
          {modeAside === 'DELETE' && (
            <div className="alert alert-danger mb-4 d-flex align-items-center">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              <div>{messages.deleteWarning || "Attention ! Cette action est irréversible. Toutes les données associées à cette demande seront supprimées."}</div>
            </div>
          )}
          
          <Form>
            {/* Afficher l'ID uniquement en mode EDIT, DELETE ou CONSULT */}
            {modeAside !== 'ADD' && (
              <FormGroup>
                <Label for="idDemande" className="d-flex align-items-center">
                  <i className="fas fa-hashtag mr-2 text-muted"></i>
                  ID
                </Label>
                <Input
                  type="text"
                  name="idDemande"
                  id="idDemande"
                  value={formData.idDemande || ''}
                  readOnly
                  disabled
                  className="bg-light"
                />
              </FormGroup>
            )}

            <FormGroup>
              <Label for="description" className="d-flex align-items-center font-weight-bold">
                <i className="fas fa-align-left mr-2 text-primary"></i>
                {messages.description || "Description"} <span className="text-danger">*</span>
              </Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                rows="3"
                value={formData.description || ''}
                onChange={handleChange}
                readOnly={isReadOnly}
                disabled={isReadOnly}
                required
                className="form-control-modern"
              />
            </FormGroup>

            <div className="row">
            {/* {(modeAside === 'CONSULT' || modeAside === 'DELETE') && (
              <div className="col-md-6">
                <FormGroup>
                  <Label for="dateCreation" className="d-flex align-items-center font-weight-bold">
                    <i className="fas fa-calendar-plus mr-2 text-info"></i>
                    {messages.dateCreation || "Date de création"}
                  </Label>
                  <Input
                    type="date"
                    name="dateCreation"
                    id="dateCreation"
                    //value={formData.dateCreation ? new Date(formData.dateCreation).toISOString().split('T')[0] : ''}
                    value={formData.dateCreation ? new Date(formData.dateCreation).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-') : ''}                    onChange={handleChange}
                    readOnly={true}
                    disabled={true}
                    className="bg-light"
                  />
                </FormGroup>
              </div>)} */}
              <div className="col-md-6">
                <FormGroup>
                  <Label for="dateEcheance" className="d-flex align-items-center font-weight-bold">
                    <i className="fas fa-calendar-check mr-2 text-warning"></i>
                    {messages.dateEcheance || "Date d'échéance"}
                  </Label>
                  <Input
                    type="date"
                    name="dateEcheance"
                    id="dateEcheance"
                    value={formData.dateEcheance ? new Date(formData.dateEcheance).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    className="form-control-modern"
                  />
                </FormGroup>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                  <Label for="etat" className="d-flex align-items-center font-weight-bold">
                    <i className="fas fa-tasks mr-2 text-primary"></i>
                    {messages.etat || "État"}
                  </Label>
                  <SelectBox
                    dataSource={Object.keys(ETATS_DEMANDE).map(key => ({
                      id: ETATS_DEMANDE[key],
                      text: key
                    }))}
                    displayExpr="text"
                    valueExpr="id"
                    value={formData.etat}
                    onValueChanged={e => handleSelectChange('etat', e.value)}
                    disabled={isReadOnly}
                  />
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                  <Label for="priorite" className="d-flex align-items-center font-weight-bold">
                    <i className="fas fa-flag mr-2 text-danger"></i>
                    {messages.priorite || "Priorité"}
                  </Label>
                  <SelectBox
                    dataSource={Object.keys(PRIORITES_DEMANDE).map(key => ({
                      id: PRIORITES_DEMANDE[key],
                      text: key
                    }))}
                    displayExpr="text"
                    valueExpr="id"
                    value={formData.priorite}
                    onValueChanged={e => handleSelectChange('priorite', e.value)}
                    disabled={isReadOnly}
                  />
                </FormGroup>
              </div>
            </div>

            <FormGroup>
              <Label for="commentaire" className="d-flex align-items-center font-weight-bold">
                <i className="fas fa-comment-alt mr-2 text-success"></i>
                {messages.commentaire || "Commentaire"}
              </Label>
              <Input
                type="textarea"
                name="commentaire"
                id="commentaire"
                rows="3"
                value={formData.commentaire || ''}
                onChange={handleChange}
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
            </FormGroup>

            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                  <Label for="client" className="d-flex align-items-center font-weight-bold">
                    <i className="fas fa-building mr-2 text-secondary"></i>
                    {messages.client || "Client"}
                  </Label>
                  <SelectBox
                    dataSource={allClient || []}
                    displayExpr="nom"
                    valueExpr="idClient"
                    value={formData.client ? formData.client.idClient : null}
                    onValueChanged={e => {
                      const selectedClient = allClient.find(c => c.idClient === e.value);
                      handleSelectChange('client', selectedClient);
                    }}
                    disabled={isReadOnly}
                    placeholder={messages.selectClient || "Sélectionner un client"}
                  />
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                  <Label for="module" className="d-flex align-items-center font-weight-bold">
                    <i className="fas fa-puzzle-piece mr-2 text-info"></i>
                    {messages.module || "Module"}
                  </Label>
                  <SelectBox
                    dataSource={allModule || []}
                    displayExpr="designation"
                    valueExpr="idModule"
                    value={formData.module ? formData.module.idModule : null}
                    onValueChanged={e => {
                      const selectedModule = allModule.find(m => m.idModule === e.value);
                      handleSelectChange('module', selectedModule);
                    }}
                    disabled={isReadOnly}
                    placeholder={messages.selectModule || "Sélectionner un module"}
                  />
                </FormGroup>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                  <Label for="equipe" className="d-flex align-items-center font-weight-bold">
                    <i className="fas fa-users mr-2 text-warning"></i>
                    {messages.equipe || "Équipe"}
                  </Label>
                  <SelectBox
                    dataSource={allEquipe || []}
                    displayExpr="designation"
                    valueExpr="idEquipe"
                    value={formData.equipe ? formData.equipe.idEquipe : null}
                    onValueChanged={e => {
                      const selectedEquipe = allEquipe.find(eq => eq.idEquipe === e.value);
                      handleSelectChange('equipe', selectedEquipe);
                    }}
                    disabled={isTeamAndCollabReadOnly}
                    placeholder={messages.selectEquipe || "Sélectionner une équipe"}
                  />
                  {modeAside === 'ADD' && (
                    <small className="text-muted mt-1 d-flex align-items-center">
                      <i className="fas fa-info-circle mr-1"></i>
                      {messages.teamAssignedLater || "L'équipe sera assignée ultérieurement"}
                    </small>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                  <Label for="collaborateur" className="d-flex align-items-center font-weight-bold">
                    <i className="fas fa-user mr-2 text-primary"></i>
                    {messages.collaborateur || "Collaborateur"}
                  </Label>
                  <SelectBox
                    dataSource={filteredCollaborateurs}
                    displayExpr={item => item ? `${item.prenom} ${item.nom}` : ''}
                    valueExpr="username"
                    value={formData.collaborateur ? formData.collaborateur.username : null}
                    onValueChanged={e => {
                      const selectedCollaborateur = allCollaborateur.find(c => c.username === e.value);
                      handleSelectChange('collaborateur', selectedCollaborateur);
                    }}
                    disabled={isTeamAndCollabReadOnly}
                    placeholder={modeAside === 'ADD' 
                      ? (messages.collabAssignedLater || "Le collaborateur sera assigné ultérieurement") 
                      : (formData.equipe 
                        ? (messages.selectCollaborateur || "Sélectionner un collaborateur") 
                        : (messages.selectEquipeFirst || "Veuillez d'abord sélectionner une équipe"))}
                  />
                  {modeAside === 'ADD' && (
                    <small className="text-muted mt-1 d-flex align-items-center">
                      <i className="fas fa-info-circle mr-1"></i>
                      {messages.collabAssignedLater || "Le collaborateur sera assigné ultérieurement"}
                    </small>
                  )}
                  {!isReadOnly && !modeAside === 'ADD' && !formData.equipe && (
                    <small className="text-muted mt-1 d-flex align-items-center">
                      <i className="fas fa-info-circle mr-1"></i>
                      {messages.selectEquipeFirst || "Veuillez d'abord sélectionner une équipe"}
                    </small>
                  )}
                </FormGroup>
              </div>
            </div>
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
            onClick={() => {
              if (
                actionBtnModalConfirmation &&
                typeof actionBtnModalConfirmation.handleBtnCancelModalConfirmation === "function"
              ) {
                actionBtnModalConfirmation.handleBtnCancelModalConfirmation();
              } else {
                dispatch(handleCloseModalConfirmation());
              }
            }}
            className="px-4"
          >
            <i className="fas fa-times mr-1"></i>
            {messages.cancel || "Annuler"}
          </Button>
          <Button color="primary" onClick={handleConfirmAction} className="px-4">
            <i className="fas fa-check mr-1&"></i>
            {messages.confirm || "Confirmer"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DemandeAside;
