import axios from 'axios';
import Ressources from '../../../Helper/Ressources';
import { GET_ALL_CLIENT, GET_CLIENT_BY_CODE, ADD_NEW_CLIENT, EDIT_CLIENT, DELETE_CLIENT } from '../../Constants/Client/Client';

export const getAllClients = (dataGrid) => {
    return dispatch => {
        if (dataGrid && dataGrid.instance) {
            dataGrid.instance.beginCustomLoading();
        }
        
        return axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.clients}`)
            .then(res => {
                dispatch({
                    type: GET_ALL_CLIENT,
                    payload: res.data
                });
                
                if (dataGrid && dataGrid.instance) {
                    dataGrid.instance.endCustomLoading();
                }
                
                return res.data;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des clients:", error);
                if (dataGrid && dataGrid.instance) {
                    dataGrid.instance.endCustomLoading();
                }
                throw error;
            });
    };
};

export const getClientByCode = (idClient) => {
    return dispatch => {
        return axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.clients}/${idClient}`)
            .then(res => {
                dispatch({
                    type: GET_CLIENT_BY_CODE,
                    payload: res.data
                });
                return res.data;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération du client:", error);
                throw error;
            });
    };
};

export const addNewClient = (client) => {
    return dispatch => {
        return axios.post(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.clients}`, client)
            .then(res => {
                dispatch({
                    type: ADD_NEW_CLIENT,
                    payload: res.data
                });
                return res.data;
            })
            .catch(error => {
                console.error("Erreur lors de l'ajout du client:", error);
                throw error;
            });
    };
};

export const editClient = (client) => {
    return dispatch => {
        return axios.put(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.clients}/${client.idClient}`, client)
            .then(res => {
                dispatch({
                    type: EDIT_CLIENT,
                    payload: res.data
                });
                return res.data;
            })
            .catch(error => {
                console.error("Erreur lors de la modification du client:", error);
                throw error;
            });
    };
};

export const deleteClient = (idClient) => {
    return dispatch => {
        return axios.delete(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.clients}/${idClient}`)
            .then(res => {
                dispatch({
                    type: DELETE_CLIENT,
                    payload: idClient
                });
                return res.data;
            })
            .catch(error => {
                console.error("Erreur lors de la suppression du client:", error);
                throw error;
            });
    };
};