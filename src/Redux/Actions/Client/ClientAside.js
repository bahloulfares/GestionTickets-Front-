import {
    CLOSE_ASIDE_CLIENT,
    RESET_ASIDE_CLIENT,
    SHOW_ASIDE_ADD_MODE_CLIENT,
    SHOW_ASIDE_DELETE_MODE_CLIENT,
    SHOW_ASIDE_EDIT_MODE_CLIENT,
    SHOW_ASIDE_CONSULT_MODE_CLIENT,
    SHOW_MODAL_CONFIRMATION_CLIENT,
    CLOSE_MODAL_CONFIRMATION_CLIENT,
} from "../../Constants/Client/ClientAside";

import { deleteClient } from "./Client";

export const handleOpenAddMode = (successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_ADD_MODE_CLIENT,
            payload: successCallback
        });
    }
}

export const handleOpenConsultMode = (selectedClient) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_CONSULT_MODE_CLIENT,
            payload: selectedClient
        });
    }
}

export const handleOpenDeleteMode = (selectedClient, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_DELETE_MODE_CLIENT,
            payload: {selectedClient: selectedClient, successCallback: successCallback}
        });
    }
}

export const handleOpenEditMode = (selectedClient, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_EDIT_MODE_CLIENT,
            payload: {selectedClient: selectedClient, successCallback: successCallback}
        });
    }
}

export const handleClose = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_ASIDE_CLIENT
        });
    }
}

export const clearForm = () => {
    return dispatch => {
        dispatch({
            type: RESET_ASIDE_CLIENT
        });
    }
}

// Action pour afficher la modal de confirmation
export const handleOpenModalConfirmation = (client, successCallback) => {
    return {
        type: SHOW_MODAL_CONFIRMATION_CLIENT,
        payload: {
            messageToShow: `Êtes-vous vraiment sûr de vouloir supprimer définitivement le client "${client.nom}" ? Cette action est irréversible.`,
            actionBtnModalConfirmation: {
                handleBtnCancelModalConfirmation: () => handleCloseModalConfirmation(),
                handleBtnConfirmerModalConfirmation: () => handleConfirmDelete(client.idClient, successCallback)
            }
        }
    };
};

// Action pour fermer la modal de confirmation
export const handleCloseModalConfirmation = () => {
    return {
        type: CLOSE_MODAL_CONFIRMATION_CLIENT
    };
};

// Action pour confirmer la suppression
export const handleConfirmDelete = (idClient, successCallback) => {
    return dispatch => {
        dispatch(deleteClient(idClient))
            .then(() => {
                // Notification de succès
                if (successCallback) {
                    successCallback();
                }
                dispatch(handleCloseModalConfirmation());
                dispatch(handleClose());
            })
            .catch(error => {
                console.error("Erreur lors de la suppression:", error);
                dispatch(handleCloseModalConfirmation());
            });
    };
};