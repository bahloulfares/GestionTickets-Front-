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
} from "../../Redux/Actions/Equipe/EquipeAside";
import {
  addNewEquipe,
  editEquipe,
  deleteEquipe,
} from "../../Redux/Actions/Equipe/Equipe";
import { getAllUtilisateurs } from "../../Redux/Actions/Utilisateur/Utilisateur";
import "../../assests/css/modals.css";
import { TagBox } from "devextreme-react/tag-box";
import notify from "devextreme/ui/notify";
import { notifyOptions } from "../../Helper/Config";

const EquipeAside = () => {
  const dispatch = useDispatch();
  const {
    isOpen,
    modeAside,
    selectedEquipe,
    successCallback,
    // These are used in the component, keep them
    isOpenModalConfirmation,
    messageToShow,
    actionBtnModalConfirmation,
  } = useSelector((state) => state.EquipeAsideReducer);

  const allUtilisateurs = useSelector(
    (state) => state.UtilisateursReducer.allUtilisateur || []
  );
  const messages = useSelector((state) => state.intl.messages);
  const direction = useSelector((state) => state.intl.direction);

  const [formData, setFormData] = useState({
    idEquipe: null,
    designation: "",
    users: [],
    actif: true,
  });

  // Load users when component mounts
  useEffect(() => {
    dispatch(getAllUtilisateurs());
  }, [dispatch]);

  // Update form when selected equipe changes
  useEffect(() => {
    if (selectedEquipe) {
      console.log("Équipe sélectionnée:", selectedEquipe);
      setFormData({
        idEquipe: selectedEquipe.idEquipe || null,
        designation: selectedEquipe.designation || "",
        users: selectedEquipe.users || [],
        actif: selectedEquipe.actif !== undefined ? selectedEquipe.actif : true,
      });
    } else {
      setFormData({
        idEquipe: null,
        designation: "",
        users: [],
        actif: true,
      });
    }
  }, [selectedEquipe]);

  // Assurez-vous que les utilisateurs sont chargés avant d'ouvrir le modal
  useEffect(() => {
    if (isOpen && modeAside === "EDIT" && allUtilisateurs.length === 0) {
      dispatch(getAllUtilisateurs());
    }
  }, [isOpen, modeAside, allUtilisateurs.length, dispatch]);

  // Vérifier que les utilisateurs de l'équipe existent dans la liste des utilisateurs
  useEffect(() => {
    if (formData.users.length > 0 && allUtilisateurs.length > 0) {
      // Vérifier si tous les utilisateurs de l'équipe existent dans la liste complète
      const validUsers = formData.users.filter((user) =>
        allUtilisateurs.some((u) => u.username === user.username)
      );

      if (validUsers.length !== formData.users.length) {
        console.log(
          "Certains utilisateurs de l'équipe n'existent pas dans la liste complète, mise à jour..."
        );
        setFormData((prev) => ({
          ...prev,
          users: validUsers,
        }));
      }
    }
  }, [formData.users, allUtilisateurs]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUsersChange = (e) => {
    const selectedUserIds = e.value || [];
    console.log("Utilisateurs sélectionnés (IDs):", selectedUserIds);

    // Vérifier si les IDs sont valides avant de filtrer
    if (!Array.isArray(selectedUserIds)) {
      console.error(
        "Les IDs d'utilisateurs ne sont pas un tableau:",
        selectedUserIds
      );
      return;
    }

    // S'assurer que allUtilisateurs est un tableau
    if (!Array.isArray(allUtilisateurs)) {
      console.error("allUtilisateurs n'est pas un tableau:", allUtilisateurs);
      return;
    }

    const selectedUsers = allUtilisateurs.filter(
      (user) => user && user.username && selectedUserIds.includes(user.username)
    );

    console.log("Utilisateurs sélectionnés (objets):", selectedUsers);

    setFormData((prevData) => ({
      ...prevData,
      users: selectedUsers,
    }));
  };

  const handleSubmit = () => {
    // Validation pour ADD et EDIT
    if (modeAside !== "DELETE" && !formData.designation.trim()) {
      notify(
        messages?.designationRequired || "La désignation est requise",
        "error",
        notifyOptions
      );
      return;
    }

    console.log("Mode aside:", modeAside);
    console.log("Form data:", formData);

    const btnSubmit = document.querySelector(
      ".modal-equipe .btn-primary, .modal-equipe .btn-danger"
    );
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Traitement...';
    }

    let actionPromise;
    const dataToSubmit = {
      ...formData,
      users: [...formData.users], // sécuriser users
    };

    try {
      switch (modeAside) {
        case "ADD":
          actionPromise = dispatch(addNewEquipe(dataToSubmit));
          break;
        case "EDIT":
          actionPromise = dispatch(editEquipe(dataToSubmit));
          break;
        case "DELETE":
          actionPromise = dispatch(deleteEquipe(dataToSubmit.idEquipe));
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
              messageSuccess =
                messages?.equipeAdded || "Équipe ajoutée avec succès";
            } else if (modeAside === "EDIT") {
              messageSuccess =
                messages?.equipeUpdated || "Équipe modifiée avec succès";
            } else if (modeAside === "DELETE") {
              messageSuccess =
                messages?.equipeDeleted || "Équipe supprimée avec succès";
            }
            notify(messageSuccess, "success", notifyOptions);

            // Fermer le modal
            dispatch(handleClose());

            // Exécuter le callback si défini
            setTimeout(() => {
              if (successCallback && typeof successCallback === "function") {
                successCallback();
              }
            }, 100);
          })
          .catch((error) => {
            console.error("Erreur lors de l'opération sur l'équipe:", error);
            notify(
              error.message || "Une erreur est survenue",
              "error",
              notifyOptions
            );
          })
          .finally(() => {
            if (btnSubmit) {
              btnSubmit.disabled = false;
              btnSubmit.innerHTML =
                modeAside === "DELETE"
                  ? messages?.delete || "Supprimer"
                  : messages?.save || "Enregistrer";
            }
          });
      } else {
        throw new Error("Action non promesse");
      }
    } catch (error) {
      console.error("Erreur technique dans handleSubmit:", error);
      notify(
        error.message || "Erreur technique inconnue",
        "error",
        notifyOptions
      );

      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML =
          modeAside === "DELETE"
            ? messages?.delete || "Supprimer"
            : messages?.save || "Enregistrer";
      }
    }
  };

  // Utiliser isOpenModalConfirmation pour vérifier si le modal de confirmation est ouvert
  useEffect(() => {
    if (isOpenModalConfirmation && actionBtnModalConfirmation) {
      console.log("Modal de confirmation ouvert avec message:", messageToShow);
    }
  }, [isOpenModalConfirmation, messageToShow, actionBtnModalConfirmation]);

  const getTitle = () => {
    switch (modeAside) {
      case "ADD":
        return messages.addEquipe || "Ajouter une équipe";
      case "EDIT":
        return messages.editEquipe || "Modifier l'équipe";
      case "DELETE":
        return messages.deleteEquipe || "Supprimer l'équipe";
      case "CONSULT":
        return messages.consultEquipe || "Consulter l'équipe";
      default:
        return messages.equipe || "Équipe";
    }
  };

  const renderFooterButtons = () => {
    switch (modeAside) {
      case "ADD":
      case "EDIT":
        return (
          <>
            <Button color="secondary" onClick={onClickBtnClose}>
              {messages.cancel || "Annuler"}
            </Button>
            <Button color="primary" onClick={handleConfirmation}>
              {messages.save || "Enregistrer"}
            </Button>
          </>
        );
      case "DELETE":
        return (
          <>
            <Button color="secondary" onClick={onClickBtnClose}>
              {messages.cancel || "Annuler"}
            </Button>
            <Button color="danger" onClick={handleConfirmation}>
              {messages.delete || "Supprimer"}
            </Button>
          </>
        );
      case "CONSULT":
        return (
          <Button color="secondary" onClick={onClickBtnClose}>
            {messages.close || "Fermer"}
          </Button>
        );
      default:
        return null;
    }
  };

  const isReadOnly = modeAside === "CONSULT" || modeAside === "DELETE";

  // Définir correctement la fonction onClickBtnClose
  const onClickBtnClose = () => {
    console.log("Fermeture du modal");
    dispatch(handleClose());
  };

  const handleConfirmation = () => {
    const message =
      modeAside === "DELETE"
        ? messages.confirmDeleteEquipe ||
          "Êtes-vous sûr de vouloir supprimer cette équipe ?"
        : messages.confirmSaveEquipe ||
          "Voulez-vous enregistrer les modifications ?";

    if (modeAside === "DELETE") {
      const handleBtnConfirmerModalConfirmation = () => {
        console.log("Suppression confirmée");
        dispatch(handleCloseModalConfirmation());
        dispatch(deleteEquipe(formData.idEquipe))
          .then(() => {
            notify(
              messages?.equipeDeleted || "Équipe supprimée avec succès",
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
            console.error("Erreur suppression équipe:", error);
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

  // Ajouter cette fonction pour gérer l'action de confirmation
  const handleConfirmAction = () => {
    if (
      actionBtnModalConfirmation &&
      typeof actionBtnModalConfirmation.handleBtnConfirmerModalConfirmation ===
        "function"
    ) {
      actionBtnModalConfirmation.handleBtnConfirmerModalConfirmation();
    } else {
      dispatch(handleCloseModalConfirmation());
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={onClickBtnClose}
        className="modal-equipe"
        size="lg"
        dir={direction}
      >
        <ModalHeader toggle={onClickBtnClose}>{getTitle()}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup row>
              <Label sm={3}>{messages.designation || "Désignation"} *</Label>
              <div className="col-sm-9">
                <Input
                  type="text"
                  name="designation"
                  id="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  required
                />
              </div>
            </FormGroup>

            <FormGroup row>
              <Label sm={3}>{messages.members || "Membres"}</Label>
              <div className="col-sm-9">
                <TagBox
                  dataSource={allUtilisateurs}
                  displayExpr={(item) =>
                    item ? `${item.prenom} ${item.nom} (${item.username})` : ""
                  }
                  valueExpr="username"
                  value={formData.users.map((user) => user.username)}
                  onValueChanged={handleUsersChange}
                  disabled={isReadOnly}
                  searchEnabled={true}
                  showSelectionControls={true}
                  maxDisplayedTags={3}
                  showMultiTagOnly={false}
                  applyValueMode="useButtons"
                  placeholder={
                    messages.selectMembers || "Sélectionner des membres"
                  }
                  noDataText={
                    messages.noUsers || "Aucun utilisateur disponible"
                  }
                  rtlEnabled={direction === "rtl"}
                  onInitialized={() => {
                    console.log(
                      "TagBox initialisé avec les utilisateurs:",
                      formData.users.map((u) => u.username)
                    );
                  }}
                />
              </div>
            </FormGroup>

            <FormGroup row>
              <Label sm={3}>{messages.active || "Actif"}</Label>
              <div className="col-sm-9">
                <div className="form-check">
                  <Input
                    type="checkbox"
                    name="actif"
                    id="actif"
                    checked={formData.actif}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </FormGroup>
          </Form>

          {/* Ajouter un message d'erreur si le modal de confirmation ne fonctionne pas */}
          {isOpenModalConfirmation && !actionBtnModalConfirmation && (
            <div className="alert alert-warning mt-3">
              Problème avec le modal de confirmation.
              <Button color="link" onClick={handleSubmit} className="p-0 ml-2">
                Cliquez ici pour continuer
              </Button>
            </div>
          )}
        </ModalBody>
        <ModalFooter>{renderFooterButtons()}</ModalFooter>
      </Modal>
      <Modal
        isOpen={isOpenModalConfirmation}
        toggle={() => dispatch(handleCloseModalConfirmation())}
        className="modal-dialog-centered"
        size="sm"
      >
        <ModalHeader toggle={() => dispatch(handleCloseModalConfirmation())}>
          {messages.confirmation || "Confirmation"}
        </ModalHeader>
        <ModalBody>{messageToShow}</ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => dispatch(handleCloseModalConfirmation())}
          >
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

export default EquipeAside;
