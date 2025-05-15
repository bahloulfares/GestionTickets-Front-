import {
    SHOW_ASIDE_ADD_MODE_DEMANDE,
    CLOSE_ASIDE_DEMANDE,
    RESET_ASIDE_DEMANDE,
    SHOW_ASIDE_EDIT_MODE_DEMANDE,
    SHOW_ASIDE_DELETE_MODE_DEMANDE,
    SHOW_ASIDE_CONSULT_MODE_DEMANDE,
    SHOW_MODAL_CONFIRMATION_DEMANDE,
    CLOSE_MODAL_CONFIRMATION_DEMANDE
} from "../../Constants/Demande/DemandeAside";

import axios from 'axios';
import Ressources from '../../../Helper/Ressources';

export const handleOpenAddMode = (successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_ADD_MODE_DEMANDE,
            payload: successCallback
        });
    }
}

export const handleOpenConsultMode = (selectedDemande) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_CONSULT_MODE_DEMANDE,
            payload: selectedDemande
        });
    }
}

export const handleOpenDeleteMode = (selectedDemande, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_DELETE_MODE_DEMANDE,
            payload: {selectedDemande: selectedDemande, successCallback: successCallback}
        });
    }
}

export const handleOpenEditMode = (selectedDemande, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_EDIT_MODE_DEMANDE,
            payload: {selectedDemande: selectedDemande, successCallback: successCallback}
        });
    }
}

export const handleClose = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_ASIDE_DEMANDE
        });
    }
}

export const handleReset = () => {
    return dispatch => {
        dispatch({
            type: RESET_ASIDE_DEMANDE
        });
    }
}

export const handleOpenModalConfirmation = (messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CONFIRMATION_DEMANDE,
            payload: {
                messageToShow,
                handleBtnCancelModalConfirmation,
                handleBtnConfirmerModalConfirmation
            }
        });
    }
}

export const handleCloseModalConfirmation = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CONFIRMATION_DEMANDE
        });
    }
}

export const fetchClientsForDemande = () => {
    return dispatch => {
        return axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.clients}`)
            .then(response => {
                dispatch({
                    type: 'FETCH_CLIENTS_FOR_DEMANDE_SUCCESS',
                    payload: response.data
                });
                return response.data;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des clients:", error);
                throw error;
            });
    };
};

export const fetchModulesForDemande = () => {
    return dispatch => {
        return axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.modules}`)
            .then(response => {
                dispatch({
                    type: 'FETCH_MODULES_FOR_DEMANDE_SUCCESS',
                    payload: response.data
                });
                return response.data;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des modules:", error);
                throw error;
            });
    };
};

export const fetchEquipesForDemande = () => {
    return dispatch => {
        return axios.get(`${Ressources.CoreUrlB}/template-core/api/equipes`)
            .then(response => {
                dispatch({
                    type: 'FETCH_EQUIPES_FOR_DEMANDE_SUCCESS',
                    payload: response.data
                });
                return response.data;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des équipes:", error);
                // Dispatch une action d'erreur pour informer l'UI
                dispatch({
                    type: 'FETCH_EQUIPES_FOR_DEMANDE_ERROR',
                    payload: error.message
                });
                // Utiliser un tableau vide en cas d'erreur pour éviter les erreurs d'affichage
                dispatch({
                    type: 'FETCH_EQUIPES_FOR_DEMANDE_SUCCESS',
                    payload: []
                });
                throw error;
            });
    };
};

export const fetchCollaborateursForDemande = () => {
    return dispatch => {
        return axios.get(`${Ressources.CoreUrlB}/template-core/api/users`)
            .then(response => {
                dispatch({
                    type: 'FETCH_COLLABORATEURS_FOR_DEMANDE_SUCCESS',
                    payload: response.data
                });
                return response.data;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des collaborateurs:", error);
                // Dispatch une action d'erreur pour informer l'UI
                dispatch({
                    type: 'FETCH_COLLABORATEURS_FOR_DEMANDE_ERROR',
                    payload: error.message
                });
                // Utiliser un tableau vide en cas d'erreur pour éviter les erreurs d'affichage
                dispatch({
                    type: 'FETCH_COLLABORATEURS_FOR_DEMANDE_SUCCESS',
                    payload: []
                });
                throw error;
            });
    };
};