import axios from 'axios';
import Ressources from '../../../Helper/Ressources';
import notify from 'devextreme/ui/notify';
import { notifyOptions } from '../../../Helper/Config';
import * as types from '../../Constants/Statistique/StatistiqueConstants';

// Action pour récupérer les statistiques globales
export const fetchStatistiquesGlobales = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: types.FETCH_STATISTIQUES_REQUEST });
            
            // Correction de l'URL pour utiliser le bon endpoint
            const response = await axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/statistiques/globales`);
            
            console.log('Statistiques globales reçues:', response.data);
            
            dispatch({
                type: types.FETCH_STATISTIQUES_SUCCESS,
                payload: {
                    type: 'globales',
                    data: response.data
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques globales:', error);
            
            dispatch({
                type: types.FETCH_STATISTIQUES_FAILURE,
                payload: error.message
            });
            
            notify(
                `Erreur lors de la récupération des statistiques globales: ${error.message}`, 
                'error', 
                notifyOptions
            );
            
            throw error; // Propager l'erreur au lieu de retourner des données par défaut
        }
    };
};

// Action pour récupérer les statistiques par état
export const fetchStatistiquesParEtat = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: types.FETCH_STATISTIQUES_REQUEST });
            
            // Correction de l'URL pour utiliser le bon endpoint
            const response = await axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/statistiques/etat`);
            
            console.log('Statistiques par état reçues:', response.data);
            
            dispatch({
                type: types.FETCH_STATISTIQUES_SUCCESS,
                payload: {
                    type: 'etat',
                    data: response.data
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques par état:', error);
            
            dispatch({
                type: types.FETCH_STATISTIQUES_FAILURE,
                payload: error.message
            });
            
            notify(
                `Erreur lors de la récupération des statistiques par état: ${error.message}`, 
                'error', 
                notifyOptions
            );
            
            throw error; // Propager l'erreur au lieu de retourner des données par défaut
        }
    };
};

// Action pour récupérer les statistiques par client
export const fetchStatistiquesParClient = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: types.FETCH_STATISTIQUES_REQUEST });
            
            // Correction de l'URL pour utiliser le bon endpoint
            const response = await axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/statistiques/client`);
            
            console.log('Statistiques par client reçues:', response.data);
            
            dispatch({
                type: types.FETCH_STATISTIQUES_SUCCESS,
                payload: {
                    type: 'client',
                    data: response.data
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques par client:', error);
            
            // Données de test en cas d'erreur
            // const defaultData = [
            //     { client: 'Client A', count: 3, label: 'Client A' },
            //     { client: 'Client B', count: 2, label: 'Client B' },
            //     { client: 'Client C', count: 1, label: 'Client C' }
            // ];
            
            dispatch({
                type: types.FETCH_STATISTIQUES_FAILURE,
                payload: error.message
            });
            
            notify(
                `Erreur lors de la récupération des statistiques par client: ${error.message}`, 
                'error', 
                notifyOptions
            );
            
            //return defaultData;
        }
    };
};

// Action pour récupérer les statistiques par module
export const fetchStatistiquesParModule = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: types.FETCH_STATISTIQUES_REQUEST });
            
            // Correction de l'URL pour utiliser le bon endpoint
            const response = await axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/statistiques/module`);
            
            console.log('Statistiques par module reçues:', response.data);
            
            dispatch({
                type: types.FETCH_STATISTIQUES_SUCCESS,
                payload: {
                    type: 'module',
                    data: response.data
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques par module:', error);
            
            // Données de test en cas d'erreur
            // const defaultData = [
            //     { module: 'Module A', count: 2, label: 'Module A' },
            //     { module: 'Module B', count: 3, label: 'Module B' },
            //     { module: 'Module C', count: 1, label: 'Module C' }
            // ];
            
            dispatch({
                type: types.FETCH_STATISTIQUES_FAILURE,
                payload: error.message
            });
            
            notify(
                `Erreur lors de la récupération des statistiques par module: ${error.message}`, 
                'error', 
                notifyOptions
            );
            
           // return defaultData;
        }
    };
};

// Action pour récupérer les statistiques par équipe
export const fetchStatistiquesParEquipe = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: types.FETCH_STATISTIQUES_REQUEST });
            
            // Correction de l'URL pour utiliser le bon endpoint
            const response = await axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/statistiques/equipe`);
            
            console.log('Statistiques par équipe reçues:', response.data);
            
            dispatch({
                type: types.FETCH_STATISTIQUES_SUCCESS,
                payload: {
                    type: 'equipe',
                    data: response.data
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques par équipe:', error);
            
            // Données de test en cas d'erreur
            // const defaultData = [
            //     { equipe: 'Équipe A', count: 3, label: 'Équipe A' },
            //     { equipe: 'Équipe B', count: 2, label: 'Équipe B' },
            //     { equipe: 'Équipe C', count: 1, label: 'Équipe C' }
            // ];
            
            dispatch({
                type: types.FETCH_STATISTIQUES_FAILURE,
                payload: error.message
            });
            
            notify(
                `Erreur lors de la récupération des statistiques par équipe: ${error.message}`, 
                'error', 
                notifyOptions
            );
            
            //return defaultData;
        }
    };
};

// Action pour récupérer les statistiques par collaborateur
export const fetchStatistiquesParCollaborateur = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: types.FETCH_STATISTIQUES_REQUEST });
            
            // Correction de l'URL pour utiliser le bon endpoint
            const response = await axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/statistiques/collaborateur`);
            
            console.log('Statistiques par collaborateur reçues:', response.data);
            
            dispatch({
                type: types.FETCH_STATISTIQUES_SUCCESS,
                payload: {
                    type: 'collaborateur',
                    data: response.data
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques par collaborateur:', error);
            
            // Données de test en cas d'erreur
            // const defaultData = [
            //     { collaborateur: 'Collaborateur A', count: 2, label: 'Collaborateur A' },
            //     { collaborateur: 'Collaborateur B', count: 3, label: 'Collaborateur B' },
            //     { collaborateur: 'Collaborateur C', count: 1, label: 'Collaborateur C' }
            // ];
            
            dispatch({
                type: types.FETCH_STATISTIQUES_FAILURE,
                payload: error.message
            });
            
            notify(
                `Erreur lors de la récupération des statistiques par collaborateur: ${error.message}`, 
                'error', 
                notifyOptions
            );
            
            //return defaultData;
        }
    };
};

// Action pour récupérer les statistiques par période
export const fetchStatistiquesParPeriode = (periode) => {
    return async (dispatch) => {
        try {
            dispatch({ type: types.FETCH_STATISTIQUES_REQUEST });
            
            // Correction de l'URL pour utiliser le bon endpoint
            const response = await axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/statistiques/periode/${periode}`);
            
            console.log(`Statistiques par ${periode} reçues:`, response.data);
            
            dispatch({
                type: types.FETCH_STATISTIQUES_SUCCESS,
                payload: {
                    type: `periode/${periode}`,
                    data: response.data
                }
            });
            
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des statistiques par ${periode}:`, error);
            
            // Données de test en cas d'erreur
            // const defaultData = [
            //     { periode: 'Janvier', count: 3, label: 'Janvier' },
            //     { periode: 'Février', count: 5, label: 'Février' },
            //     { periode: 'Mars', count: 2, label: 'Mars' }
            // ];
            
            dispatch({
                type: types.FETCH_STATISTIQUES_FAILURE,
                payload: error.message
            });
            
            notify(
                `Erreur lors de la récupération des statistiques par ${periode}: ${error.message}`, 
                'error', 
                notifyOptions
            );
            
            //return defaultData;
        }
    };
};

// Action pour récupérer les statistiques de performance
export const fetchStatistiquesPerformance = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: types.FETCH_STATISTIQUES_REQUEST });
            
            // Correction de l'URL pour utiliser le bon endpoint
            const response = await axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/statistiques/performance`);
            
            console.log('Statistiques de performance reçues:', response.data);
            
            dispatch({
                type: types.FETCH_STATISTIQUES_SUCCESS,
                payload: {
                    type: 'performance',
                    data: response.data
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques de performance:', error);
            
            // Données de test en cas d'erreur
            // const defaultData = [
            //     { metric: 'Temps moyen de résolution', score: 3.5, label: 'Temps moyen de résolution (jours)' },
            //     { metric: 'Taux de satisfaction', score: 85, label: 'Taux de satisfaction (%)' },
            //     { metric: 'Demandes traitées par jour', score: 2.7, label: 'Demandes traitées par jour' }
            // ];
            
            dispatch({
                type: types.FETCH_STATISTIQUES_FAILURE,
                payload: error.message
            });
            
            notify(
                `Erreur lors de la récupération des statistiques de performance: ${error.message}`, 
                'error', 
                notifyOptions
            );
            
            //return defaultData;
        }
    };
};

// Action pour récupérer les détails des statistiques
export const fetchStatistiquesDetails = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: types.FETCH_STATISTIQUES_REQUEST });
            
            // Correction de l'URL pour utiliser le bon endpoint
            const response = await axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/statistiques/details`);
            
            console.log('Détails des statistiques reçus:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des détails des statistiques:', error);
            
            notify(
                `Erreur lors de la récupération des détails des statistiques: ${error.message}`, 
                'error', 
                notifyOptions
            );
            
            throw error;
        }
    };
};