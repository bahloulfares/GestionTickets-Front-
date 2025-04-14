import axios from 'axios';
import Ressources from '../../../Helper/Ressources';
import { GET_ALL_POSTE, ADD_NEW_POSTE, DELETE_POSTE, EDIT_POSTE, GET_POSTE_BY_CODE } from "../../Constants/Poste/Poste";

export const getAllPostes = (dataGrid) => {
    return dispatch => {
        if (dataGrid && dataGrid.instance) {
            dataGrid.instance.beginCustomLoading();
        }
        
        return axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.postes}`)
            .then(res => {
                dispatch({
                    type: GET_ALL_POSTE,
                    payload: res.data
                });
                
                if (dataGrid && dataGrid.instance) {
                    dataGrid.instance.endCustomLoading();
                }
                
                return res.data;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des postes:", error);
                if (dataGrid && dataGrid.instance) {
                    dataGrid.instance.endCustomLoading();
                }
                throw error;
            });
    };
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
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};

export const addNewPoste = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            // Adapter le format des données au format attendu par l'API
            const posteDTO = {
                designation: data.designation,
                actif: data.actif === true || data.actif === 1
            };
            
            axios.post(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.postes}`, posteDTO)
                .then(res => {
                    if (res.status === 200 || res.status === 201) {
                        dispatch({
                            type: ADD_NEW_POSTE,
                            payload: res.data
                        });
                        resolve(res.data);
                    } else {
                        reject(new Error(`Erreur lors de l'ajout du poste: ${res.statusText}`));
                    }
                })
                .catch(error => {
                    console.error("Erreur lors de l'ajout du poste:", error);
                    reject(error.response?.data?.message || "Une erreur est survenue lors de l'ajout du poste");
                });
        });
    }
};

export const editPoste = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            // Adapter le format des données au format attendu par l'API
            const posteDTO = {
                designation: data.designation,
                actif: data.actif === true || data.actif === 1
            };
            
            axios.put(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.postes}/${data.idPoste}`, posteDTO)
                .then(res => {
                    if (res.status === 200) {
                        dispatch({
                            type: EDIT_POSTE,
                            payload: res.data
                        });
                        resolve(res.data);
                    } else {
                        reject(new Error(`Erreur lors de la modification du poste: ${res.statusText}`));
                    }
                })
                .catch(error => {
                    console.error("Erreur lors de la modification du poste:", error);
                    reject(error.response?.data?.message || "Une erreur est survenue lors de la modification du poste");
                });
        });
    }
};

export const deletePoste = (idPoste) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            if (!idPoste) {
                reject(new Error("ID du poste non spécifié"));
                return;
            }
            
            axios.delete(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.postes}/${idPoste}`)
                .then(res => {
                    if (res.status === 200 || res.status === 204) {
                        dispatch({
                            type: DELETE_POSTE,
                            payload: idPoste
                        });
                        resolve(true);
                    } else {
                        reject(new Error(`Erreur lors de la suppression du poste: ${res.statusText}`));
                    }
                })
                .catch(error => {
                    console.error("Erreur lors de la suppression du poste:", error);
                    reject(error.response?.data?.message || "Une erreur est survenue lors de la suppression du poste");
                });
        });
    }
};

