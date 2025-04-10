import {
    CLOSE_ASIDE_UTILISATEUR,
    RESET_ASIDE_UTILISATEUR,
    SHOW_ASIDE_ADD_MODE_UTILISATEUR,
    SHOW_ASIDE_EDIT_MODE_UTILISATEUR,
    GET_ALL_POSTE,
    GET_ALL_ROLE,
    SHOW_ASIDE_DELETE_MODE_UTILISATEUR,
    SHOW_ASIDE_CONSULT_MODE_UTILISATEUR,
    SHOW_MODAL_CONFIRMATION_UTILISATEUR,
    CLOSE_MODAL_CONFIRMATION_UTILISATEUR
} from "../../Constants/Utilisateur/UtilisateurAside";
import axios from "axios";
import Ressources from '../../../Helper/Ressources';

export const handleOpenAddMode = (successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_ADD_MODE_UTILISATEUR,
            payload: successCallback
        });
    }
}

export const handleOpenConsultMode = (selectedUtilisateur) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_CONSULT_MODE_UTILISATEUR,
            payload: selectedUtilisateur
        });
    }
}

export const handleOpenDeleteMode = (selectedUtilisateur, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_DELETE_MODE_UTILISATEUR,
            payload: {selectedUtilisateur: selectedUtilisateur, successCallback: successCallback}
        });
    }
}

export const handleOpenEditMode = (selectedUtilisateur, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_EDIT_MODE_UTILISATEUR,
            payload: {selectedUtilisateur: selectedUtilisateur, successCallback: successCallback}
        });
    }
}

export const handleClose = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_ASIDE_UTILISATEUR
        });
    }
}

export const clearForm = () => {
    return dispatch => {
        dispatch({
            type: RESET_ASIDE_UTILISATEUR
        });
    }
}



export const handleOpenModalConfirmation = (messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CONFIRMATION_UTILISATEUR,
            messageToShow: messageToShow,
            actionBtnModalConfirmation: {handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation}
        });
    }
}

export const handleCloseModalConfirmation = (successCallback) => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CONFIRMATION_UTILISATEUR,
            payload: successCallback
        });
    }
}
export const getAllPoste = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.postes}`).then(res => {
            dispatch({
                type: GET_ALL_POSTE,
                payload: res.data
            })
        })
    }
}



export const getAllRole = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.utilisateurs}/roles`).then(res => {
            dispatch({
                type: GET_ALL_ROLE,
                payload: res.data
            })
        })
    }
}

