import axios from 'axios';
import Ressources from '../../../Helper/Ressources';
import notify from 'devextreme/ui/notify';
import { notifyOptions } from '../../../Helper/Config';
import * as types from '../../Constants/Demande/DemandeConstants';

// Action pour récupérer toutes les demandes
export const getAllDemandes = (dataGrid) => {
    return dispatch => {
        dispatch({ type: types.GET_ALL_DEMANDES_REQUEST });
        
        return axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.demandes}`)
            .then(response => {
                // Vérifier que la réponse contient des données
                const demandes = response.data || [];
                dispatch({
                    type: types.GET_ALL_DEMANDES_SUCCESS,
                    payload: demandes
                });
                
                if (dataGrid && dataGrid.instance) {
                    dataGrid.instance.refresh();
                }
                
                return demandes;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des demandes:", error);
                dispatch({
                    type: types.GET_ALL_DEMANDES_FAILURE,
                    payload: error.message
                });
                throw error;
            });
    };
};

// Action pour récupérer une demande par son ID
export const getDemandeByCode = (idDemande) => async (dispatch) => {
    try {
        dispatch({ type: types.GET_DEMANDE_BY_CODE_REQUEST });
        
        const response = await axios.get(
            `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.demandes}/${idDemande}`
        );
        
        dispatch({
            type: types.GET_DEMANDE_BY_CODE_SUCCESS,
            payload: response.data
        });
        
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération de la demande:', error);
        notify('Erreur lors de la récupération de la demande', 'error', notifyOptions);
        
        dispatch({
            type: types.GET_DEMANDE_BY_CODE_FAILURE,
            payload: error.message
        });
        
        throw error;
    }
};

// Action pour ajouter une nouvelle demande
export const addDemande = (demande) => async (dispatch) => {
    try {
        dispatch({ type: types.ADD_DEMANDE_REQUEST });
        
        const response = await axios.post(
            `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.demandes}`,
            demande
        );
        
        dispatch({
            type: types.ADD_DEMANDE_SUCCESS,
            payload: response.data
        });
        
        notify('Demande ajoutée avec succès', 'success', notifyOptions);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la demande:', error);
        notify('Erreur lors de l\'ajout de la demande', 'error', notifyOptions);
        
        dispatch({
            type: types.ADD_DEMANDE_FAILURE,
            payload: error.message
        });
        
        throw error;
    }
};

// Action pour mettre à jour une demande
export const updateDemande = (demande) => async (dispatch) => {
    try {
        dispatch({ type: types.UPDATE_DEMANDE_REQUEST });
        
        const response = await axios.put(
            `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.demandes}/${demande.idDemande}`,
            demande
        );
        
        dispatch({
            type: types.UPDATE_DEMANDE_SUCCESS,
            payload: response.data
        });
        
        notify('Demande mise à jour avec succès', 'success', notifyOptions);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la demande:', error);
        notify('Erreur lors de la mise à jour de la demande', 'error', notifyOptions);
        
        dispatch({
            type: types.UPDATE_DEMANDE_FAILURE,
            payload: error.message
        });
        
        throw error;
    }
};

// Action pour supprimer une demande
export const deleteDemande = (idDemande) => async (dispatch) => {
    try {
        dispatch({ type: types.DELETE_DEMANDE_REQUEST });
        
        await axios.delete(
            `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.demandes}/${idDemande}`
        );
        
        dispatch({
            type: types.DELETE_DEMANDE_SUCCESS,
            payload: idDemande
        });
        
        notify('Demande supprimée avec succès', 'success', notifyOptions);
        return idDemande;
    } catch (error) {
        console.error('Erreur lors de la suppression de la demande:', error);
        notify('Erreur lors de la suppression de la demande', 'error', notifyOptions);
        
        dispatch({
            type: types.DELETE_DEMANDE_FAILURE,
            payload: error.message
        });
        
        throw error;
    }
};

// Action pour définir la demande sélectionnée
export const setSelectedDemande = (demande) => ({
    type: types.SET_SELECTED_DEMANDE,
    payload: demande
});

// Action pour réinitialiser l'état de la demande
export const resetDemande = () => ({
    type: types.RESET_DEMANDE
});

// Action pour assigner une équipe à une demande
export const assignerEquipe = (idDemande, idEquipe) => async (dispatch) => {
    try {
        dispatch({ type: 'ASSIGNER_EQUIPE_REQUEST' });
        
        const response = await axios.put(
            `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.demandes}/${idDemande}/equipe/${idEquipe}`
        );
        
        dispatch({
            type: 'ASSIGNER_EQUIPE_SUCCESS',
            payload: response.data
        });
        
        notify('Équipe assignée avec succès', 'success', notifyOptions);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'assignation de l\'équipe:', error);
        notify('Erreur lors de l\'assignation de l\'équipe', 'error', notifyOptions);
        
        dispatch({
            type: 'ASSIGNER_EQUIPE_FAILURE',
            payload: error.message
        });
        
        throw error;
    }
};

// Action pour assigner un collaborateur à une demande
export const assignerCollaborateur = (idDemande, username) => async (dispatch) => {
    try {
        dispatch({ type: 'ASSIGNER_COLLABORATEUR_REQUEST' });
        
        const response = await axios.put(
            `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.demandes}/${idDemande}/collaborateur/${username}`
        );
        
        dispatch({
            type: 'ASSIGNER_COLLABORATEUR_SUCCESS',
            payload: response.data
        });
        
        notify('Collaborateur assigné avec succès', 'success', notifyOptions);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'assignation du collaborateur:', error);
        notify('Erreur lors de l\'assignation du collaborateur', 'error', notifyOptions);
        
        dispatch({
            type: 'ASSIGNER_COLLABORATEUR_FAILURE',
            payload: error.message
        });
        
        throw error;
    }
};

// Action pour assigner une équipe et un collaborateur à une demande
export const assignerEquipeEtCollaborateur = (idDemande, idEquipe, username) => async (dispatch) => {
    try {
        dispatch({ type: 'ASSIGNER_EQUIPE_ET_COLLABORATEUR_REQUEST' });
        
        const response = await axios.put(
            `${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.demandes}/${idDemande}/equipe/${idEquipe}/collaborateur/${username}`
        );
        
        dispatch({
            type: 'ASSIGNER_EQUIPE_ET_COLLABORATEUR_SUCCESS',
            payload: response.data
        });
        
        notify('Équipe et collaborateur assignés avec succès', 'success', notifyOptions);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'assignation de l\'équipe et du collaborateur:', error);
        notify('Erreur lors de l\'assignation de l\'équipe et du collaborateur', 'error', notifyOptions);
        
        dispatch({
            type: 'ASSIGNER_EQUIPE_ET_COLLABORATEUR_FAILURE',
            payload: error.message
        });
        
        throw error;
    }
};