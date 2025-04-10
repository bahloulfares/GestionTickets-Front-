import axios from 'axios';
import Ressources from '../../../Helper/Ressources';
import { GET_ALL_POSTE, ADD_NEW_POSTE,DELETE_POSTE, EDIT_POSTE, GET_POSTE_BY_CODE } from "../../Constants/Poste/Poste";

 export const getAllPostes = (dataGrid) => {
    return dispatch => {
        dataGrid.instance.beginCustomLoading();
        axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.postes}`).then(res => {
            dispatch({
                type: GET_ALL_POSTE,
                payload: res.data
            });
            dataGrid.instance.endCustomLoading();
        })
    }
}; 

export const getPosteByCode = (idPoste) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.postes}/${idPoste}`)
                .then(res => {
                    dispatch({
                        type: GET_POSTE_BY_CODE,
                        payload: res.data
                    });
                    resolve(res.data);
                });
        });
    }
};

export const addNewPoste = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.postes}`, data)
                .then(res => {
                    dispatch({
                        type: ADD_NEW_POSTE,
                        payload: res.data
                    });

                    resolve(res.data);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const editePoste = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.postes}/${data.idPoste}`, data)
                .then(res => {
                    dispatch({
                        type: EDIT_POSTE,
                        payload: data
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

export const deletePoste = (idPoste) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.postes}/${idPoste}`)
                .then(res => {
                    dispatch({
                        type: DELETE_POSTE,
                        payload: idPoste
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

