import axios from 'axios';
import Ressources from '../../../Helper/Ressources';
import { GET_ALL_UTILISATEUR, ADD_NEW_UTILISATEUR,DELETE_UTILISATEUR, EDIT_UTILISATEUR, GET_UTILISATEUR_BY_CODE } from "../../Constants/Utilisateur/Utilisateur";

 export const getAllUtilisateurs = (dataGrid) => {
    return dispatch => {
        dataGrid.instance.beginCustomLoading();
        axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.utilisateurs}`).then(res => {
            dispatch({
                type: GET_ALL_UTILISATEUR,
                payload: res.data
            });
            dataGrid.instance.endCustomLoading();
        })
    }
}; 

export const getUtilisateurByCode = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.utilisateurs}/${encodeURI(code)}`)
                .then(res => {
                    dispatch({
                        type: GET_UTILISATEUR_BY_CODE,
                        payload: res.data
                    });
                    resolve(res.data);
                });
        });
    }
};

export const addNewUtilisateur = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.utilisateurs}`, data)
                .then(res => {
                    dispatch({
                        type: ADD_NEW_UTILISATEUR,
                        payload: res.data
                    });

                    resolve(res.data);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const editeUtilisateur = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.utilisateurs}/${data.username}`, data)
                .then(res => {
                    dispatch({
                        type: EDIT_UTILISATEUR,
                        payload: data
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const deleteUtilisateur = (code) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.utilisateurs}/${code}`)
                .then(res => {
                    dispatch({
                        type: DELETE_UTILISATEUR,
                        payload: code
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

