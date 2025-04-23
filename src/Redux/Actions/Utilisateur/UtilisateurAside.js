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

export const handleReset = () => {
    return dispatch => {
        dispatch({
            type: RESET_ASIDE_UTILISATEUR
        });
    }
}

export const getAllPostes = () => {
    return dispatch => {
        return axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.postes}`)
            .then(res => {
                dispatch({
                    type: GET_ALL_POSTE,
                    payload: res.data
                });
                return res.data;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des postes:", error);
                throw error;
            });
    }
}

export const getAllRoles = () => {
    return dispatch => {
        return axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/roles`)
            .then(res => {
                dispatch({
                    type: GET_ALL_ROLE,
                    payload: res.data
                });
                return res.data;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des rôles:", error);
                throw error;
            });
    }
}

export const handleOpenModalConfirmation = (messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        // Assurons-nous que les callbacks sont des fonctions valides
        const cancelCallback = typeof handleBtnCancelModalConfirmation === 'function' 
            ? handleBtnCancelModalConfirmation 
            : () => dispatch(handleCloseModalConfirmation());
            
        const confirmCallback = typeof handleBtnConfirmerModalConfirmation === 'function'
            ? handleBtnConfirmerModalConfirmation
            : () => dispatch(handleCloseModalConfirmation());
            
        dispatch({
            type: SHOW_MODAL_CONFIRMATION_UTILISATEUR,
            payload: {
                messageToShow,
                handleBtnCancelModalConfirmation: cancelCallback,
                handleBtnConfirmerModalConfirmation: confirmCallback
            }
        });
    }
}

export const handleCloseModalConfirmation = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CONFIRMATION_UTILISATEUR
        });
    }
}

