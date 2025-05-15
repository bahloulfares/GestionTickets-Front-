import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import {
  handleClose,
  handleOpenModalConfirmation,
  handleCloseModalConfirmation,
} from "../../Redux/Actions/Utilisateur/UtilisateurAside";
import {
  addNewUtilisateur,
  editUtilisateur,
  deleteUtilisateur,
} from "../../Redux/Actions/Utilisateur/Utilisateur";
import { getAllPostes } from "../../Redux/Actions/Poste/Poste";
import notify from "devextreme/ui/notify";
import { notifyOptions } from "../../Helper/Config";
import { Role, RoleOptions } from "../../Helper/Enums/Role";
import { SelectBox } from "devextreme-react/select-box";
import "../../assests/css/modals.css";

const UtilisateurAside = () => {
  const dispatch = useDispatch();
  const {
    isOpen,
    modeAside,
    selectedUtilisateur,
    successCallback,
    isOpenModalConfirmation,
    messageToShow,
    actionBtnModalConfirmation,
  } = useSelector((state) => state.UtilisateurAsideReducer);

  const allPoste = useSelector(
    (state) => state.UtilisateurAsideReducer.allPoste
  );
  const messages = useSelector((state) => state.intl.messages);
  const direction = useSelector((state) => state.intl.direction);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nom: "",
    prenom: "",
    description: "",
    role: Role.ROLE_AUTRE, // Utiliser ROLE_AUTRE comme valeur par défaut
    poste: null,
    actif: true,
  });

  useEffect(() => {
    dispatch(getAllPostes());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUtilisateur) {
      // Récupération du poste
      let posteData = null;
      if (selectedUtilisateur.poste) {
        // Si le poste est déjà un objet complet
        if (
          typeof selectedUtilisateur.poste === "object" &&
          selectedUtilisateur.poste.idPoste
        ) {
          posteData = selectedUtilisateur.poste;
        }
        // Si le poste est un objet avec seulement un id
        else if (
          typeof selectedUtilisateur.poste === "object" &&
          selectedUtilisateur.poste.id
        ) {
          const posteId = selectedUtilisateur.poste.id;
          if (allPoste && allPoste.length > 0) {
            const foundPoste = allPoste.find((p) => p.idPoste === posteId);
            if (foundPoste) {
              posteData = foundPoste;
            }
          }
        }
        // Si le poste est directement un ID (nombre ou chaîne)
        else if (
          typeof selectedUtilisateur.poste === "number" ||
          (typeof selectedUtilisateur.poste === "string" &&
            !isNaN(parseInt(selectedUtilisateur.poste)))
        ) {
          const posteId =
            typeof selectedUtilisateur.poste === "number"
              ? selectedUtilisateur.poste
              : parseInt(selectedUtilisateur.poste);

          if (allPoste && allPoste.length > 0) {
            const foundPoste = allPoste.find((p) => p.idPoste === posteId);
            if (foundPoste) {
              posteData = foundPoste;
            }
          }
        }
      } else if (selectedUtilisateur.idPoste) {
        // Cas où le poste est stocké directement comme idPoste dans l'utilisateur
        if (allPoste && allPoste.length > 0) {
          const foundPoste = allPoste.find((p) => p.idPoste === selectedUtilisateur.idPoste);
          if (foundPoste) {
            posteData = foundPoste;
          }
        }
      }

      console.log("Poste récupéré:", posteData); // Pour déboguer

      setFormData({
        username: selectedUtilisateur.username || "",
        password: selectedUtilisateur.password ||"",
        nom: selectedUtilisateur.nom || "",
        prenom: selectedUtilisateur.prenom || "",
        description: selectedUtilisateur.description || "",
        role: selectedUtilisateur.role || Role.ROLE_AUTRE,
        poste: posteData,
        actif: selectedUtilisateur.actif !== false,
      });
    } else {
      setFormData({
        username: "",
        password: "",
        nom: "",
        prenom: "",
        description: "",
        role: Role.ROLE_AUTRE,
        poste: null,
        actif: true,
      });
    }
  }, [selectedUtilisateur, allPoste]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePosteChange = (value) => {
    const selectedPoste = allPoste.find((p) => p.idPoste === value);
    setFormData((prev) => ({
      ...prev,
      poste: selectedPoste || null,
    }));
  };

  const onClickBtnClose = () => {
    dispatch(handleClose());
  };

  const getTitle = () => {
    switch (modeAside) {
      case "ADD":
        return (
          <>
            <i className="fas fa-user-plus mr-2 text-success"></i>
            {messages.addUser || "Ajouter un utilisateur"}
          </>
        );
      case "EDIT":
        return (
          <>
            <i className="fas fa-user-edit mr-2 text-primary"></i>
            {messages.editUser || "Modifier un utilisateur"}
          </>
        );
      case "DELETE":
        return (
          <>
            <i className="fas fa-user-times mr-2 text-danger"></i>
            {messages.deleteUser || "Supprimer un utilisateur"}
          </>
        );
      case "CONSULT":
        return (
          <>
            <i className="fas fa-user-check mr-2 text-secondary"></i>
            {messages.consultUser || "Consulter un utilisateur"}
          </>
        );
      default:
        return (
          <>
            <i className="fas fa-user mr-2 text-info"></i>
            {messages.user || "Utilisateur"}
          </>
        );
    }
  };

  const renderFooterButtons = () => {
    switch (modeAside) {
      case "ADD":
        return (
          <>
            <Button color="secondary" onClick={onClickBtnClose} className="px-4">
              <i className="fas fa-times mr-2"></i>
              {messages.cancel || "Annuler"}
            </Button>
            <Button color="success" onClick={handleSubmit} className="px-4">
              <i className="fas fa-user-plus mr-2"></i>
              {messages.add || "Ajouter"}
            </Button>
          </>
        );
      case "EDIT":
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
      case "DELETE":
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
      case "CONSULT":
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation des champs obligatoires
    if (!formData.username || !formData.nom || !formData.prenom) {
      notify(
        "Veuillez remplir tous les champs obligatoires",
        "error",
        notifyOptions
      );
      return;
    }

    // En mode ajout, vérifier que le mot de passe est fourni
    if (modeAside === "ADD" && !formData.password) {
      notify(
        "Le mot de passe est obligatoire pour un nouvel utilisateur",
        "error",
        notifyOptions
      );
      return;
    }

    // Make sure poste is properly formatted for the API
    const posteData = formData.poste
      ? {
          idPoste: formData.poste.idPoste,
          designation: formData.poste.designation,
        }
      : null;

    const userData = {
      username: formData.username,
      ...(formData.password && { password: formData.password }),
      nom: formData.nom,
      prenom: formData.prenom,
      description: formData.description,
      role: formData.role || Role.ROLE_AUTRE, // Utilisez ROLE_AUTRE si aucun rôle n'est sélectionné
      poste: posteData,
      actif: formData.actif,
    };

    // Afficher un indicateur de chargement
    const loadingMessage = notify("Traitement en cours...", "info", {
      ...notifyOptions,
      displayTime: 0, // Reste affiché jusqu'à ce qu'on le ferme
    });

    if (modeAside === "ADD") {
      dispatch(addNewUtilisateur(userData))
        .then(() => {
          loadingMessage.close();
          notify(
            messages.addSuccess || "Utilisateur ajouté avec succès",
            "success",
            notifyOptions
          );
          dispatch(handleClose());
          if (successCallback) successCallback();
        })
        .catch((error) => {
          loadingMessage.close();
          notify(
            messages.addFailed || "Échec de l'ajout",
            "error",
            notifyOptions
          );
          console.error("Erreur ajout utilisateur:", error);
        });
    } else if (modeAside === "EDIT") {
      dispatch(editUtilisateur(userData))
        .then(() => {
          loadingMessage.close();
          notify(
            messages.editSuccess || "Utilisateur modifié avec succès",
            "success",
            notifyOptions
          );
          dispatch(handleClose());
          if (successCallback) successCallback();
        })
        .catch((error) => {
          loadingMessage.close();
          notify(
            messages.editFailed || "Échec de la modification",
            "error",
            notifyOptions
          );
          console.error("Erreur modification utilisateur:", error);
        });
      } else if (modeAside === 'DELETE') {
        // Use the confirmation modal for delete
        const handleBtnConfirmerModalConfirmation = () => {
            dispatch(handleCloseModalConfirmation());
            dispatch(deleteUtilisateur(userData.username))                .then(() => {
                    notify(messages.deleteSuccess || "Utilisateur deleted successfully", "success", notifyOptions);
                    dispatch(handleClose());
                    if (successCallback) successCallback();
                })
                .catch((error) => {
                    notify(messages.deleteFailed || "Failed to delete utilisateur", "error", notifyOptions);
                    console.error("Delete utilisateur error:", error);
                });
        };
        
        const handleBtnCancelModalConfirmation = () => {
            dispatch(handleCloseModalConfirmation());
        };
        
        dispatch(handleOpenModalConfirmation(
            messages.confirmDelete || "Are you sure you want to delete this utilisateur?",
            handleBtnCancelModalConfirmation,
            handleBtnConfirmerModalConfirmation
        ));
    }
  };

  const handleConfirmAction = () => {
    if (
      actionBtnModalConfirmation &&
      typeof actionBtnModalConfirmation.handleBtnConfirmerModalConfirmation ===
        "function"
    ) {
      // Execute the confirmation callback
      actionBtnModalConfirmation.handleBtnConfirmerModalConfirmation();
    } else {
      // If no callback, simply close the modal
      dispatch(handleCloseModalConfirmation());
    }
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={onClickBtnClose}
        className="utilisateur-modal"
        style={{ direction: direction }}
        size="lg"
      >
        <ModalHeader toggle={onClickBtnClose}>{getTitle()}</ModalHeader>
        <ModalBody>
        {modeAside === "DELETE" && (
            <div className="alert alert-danger mb-4 d-flex align-items-center">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              <div>{messages.deleteWarning || "Attention ! Cette action est irréversible. Toutes les données associées à cet utilisateur seront supprimées."}</div>
            </div>
          )}
        <Form onSubmit={handleSubmit}>
  <div className="row">
    <div className="col-6">
      <FormGroup>
        <Label for="username" className="d-flex align-items-center font-weight-bold"> <i className="fas fa-user-tag mr-2 text-primary"></i>{messages.username || "Nom d'utilisateur"} <span className="text-danger">*</span></Label>
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
    </div>
    <div className="col-6">
      <FormGroup>
        <Label for="password" className="d-flex align-items-center font-weight-bold"><i className="fas fa-lock mr-2 text-danger"></i>{messages.password || "Mot de passe"} {modeAside === "ADD" &&<span className="text-danger">*</span>}</Label>
        <Input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required={modeAside === "ADD"}
          placeholder={modeAside === "EDIT" ? messages.leaveEmptyToKeep || "nouveaux mot de passe" : ""}
          disabled={modeAside === "CONSULT" || modeAside === "DELETE"}
        />
      </FormGroup>
    </div>
  </div>

  <div className="row">
              <div className="col-6">
                <FormGroup>
                  <Label for="nom" className="d-flex align-items-center font-weight-bold">
                    <i className="fas fa-user mr-2 text-info"></i>
                    {messages.nom || "Nom"} <span className="text-danger">*</span>
                  </Label>
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
              </div>
              <div className="col-6">
                <FormGroup>
                  <Label for="prenom" className="d-flex align-items-center font-weight-bold">
                    <i className="fas fa-user mr-2 text-success"></i>
                    {messages.prenom || "Prénom"} <span className="text-danger">*</span>
                  </Label>
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
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <FormGroup>
                  <Label for="description" className="d-flex align-items-center font-weight-bold">
                    <i className="fas fa-align-left mr-2 text-secondary"></i>
                    {messages.description || "Description"}
                  </Label>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={modeAside === "CONSULT" || modeAside === "DELETE"}
                  />
                </FormGroup>
              </div>
              <div className="col-6">
                <FormGroup>
                  <Label for="role" className="d-flex align-items-center font-weight-bold">
                    <i className="fas fa-user-shield mr-2 text-warning"></i>
                    {messages.role || "Rôle"} <span className="text-danger">*</span>
                  </Label>
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
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <FormGroup>
                  <Label for="poste" className="d-flex align-items-center font-weight-bold">
                    <i className="fas fa-briefcase mr-2 text-primary"></i>
                    {messages.poste || "Poste"}
                  </Label>
                  <Input
                    type="select"
                    name="poste"
                    id="poste"
                    value={formData.poste ? formData.poste.idPoste : ""}
                    onChange={(e) => {
                      const selectedPoste = allPoste.find(p => p.idPoste === parseInt(e.target.value));
                      setFormData(prev => ({
                        ...prev,
                        poste: selectedPoste || null,
                      }));
                    }}
                    disabled={modeAside === "CONSULT" || modeAside === "DELETE"}
                  >
                    <option value="">-- Sélectionner un poste --</option>
                    {allPoste.map(poste => (
                      <option key={poste.idPoste} value={poste.idPoste}>
                        {poste.designation}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
              <div className="col-6">
                <FormGroup check className="mt-4">
                  <Label check className="d-flex align-items-center">
                    <Input
                      type="checkbox"
                      name="actif"
                      checked={formData.actif}
                      onChange={handleChange}
                      disabled={modeAside === "CONSULT" || modeAside === "DELETE"}
                      className="mr-2"
                    />
                    {/* <i className="fas fa-toggle-on mr-2 text-success"></i> */}
                    {messages.active || "Actif"}
                  </Label>
                </FormGroup>
              </div>
            </div>
          </Form>
        </ModalBody>

        <ModalFooter>{renderFooterButtons()}</ModalFooter>
      </Modal>
      {/* Modal de confirmation (utilisée pour d'autres fonctionnalités) */}
      <Modal
        isOpen={isOpenModalConfirmation}
        toggle={() => dispatch(handleCloseModalConfirmation())}
         className="modal-dialog-centered"
        size="sm"
      >
        <ModalHeader toggle={() => dispatch(handleCloseModalConfirmation())}className="bg-warning text-white">
        <i className="fas fa-question-circle mr-2"></i>
          {messages.confirmation || "Confirmation"}
        </ModalHeader>
        <ModalBody className="p-4"><p className="mb-0">{messageToShow}</p></ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => {
              if (
                actionBtnModalConfirmation &&
                typeof actionBtnModalConfirmation.handleBtnCancelModalConfirmation ===
                  "function"
              ) {
                actionBtnModalConfirmation.handleBtnCancelModalConfirmation();
              } else {
                dispatch(handleCloseModalConfirmation());
              }
            }}
            className="px-3"
          ><i className="fas fa-times mr-2"></i>
            {messages.cancel || "Annuler"}
          </Button>
          <Button color="primary" onClick={handleConfirmAction} className="px-3">
          <i className="fas fa-check mr-2"></i>
            {messages.confirm || "Confirmer"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}; // Make sure this closing brace for the component function is here

export default UtilisateurAside;
