import axios from 'axios';
import Ressources from '../../../Helper/Ressources';
import { GET_ALL_UTILISATEUR, ADD_NEW_UTILISATEUR, DELETE_UTILISATEUR, EDIT_UTILISATEUR, GET_UTILISATEUR_BY_CODE } from "../../Constants/Utilisateur/Utilisateur";

export const getAllUtilisateurs = (dataGrid) => {
    return dispatch => {
        if (dataGrid && dataGrid.instance) {
            dataGrid.instance.beginCustomLoading();
        }
        
        return axios.get(`${Ressources.CoreUrlB}/template-core/api/users`)
            .then(res => {
                dispatch({
                    type: GET_ALL_UTILISATEUR,
                    payload: res.data
                });
                
                if (dataGrid && dataGrid.instance) {
                    dataGrid.instance.endCustomLoading();
                }
                
                return res.data;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des utilisateurs:", error);
                if (dataGrid && dataGrid.instance) {
                    dataGrid.instance.endCustomLoading();
                }
                throw error;
            });
    };
};

export const getUtilisateurByCode = (username) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`${Ressources.CoreUrlB}/template-core/api/users/${encodeURIComponent(username)}`)
                .then(res => {
                    dispatch({
                        type: GET_UTILISATEUR_BY_CODE,
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

export const addNewUtilisateur = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            // Adapter le format des données au format attendu par l'API
            const userDTO = {
                username: data.username,
                password: data.password,
                nom: data.nom,
                prenom: data.prenom,
                description: data.description,
                role: data.role, // Assurez-vous que c'est au format ROLE_ADMIN ou ROLE_AUTRE
                poste: data.poste ? {
                    idPoste: data.poste.idPoste,
                    designation: data.poste.designation
                } : null,
                actif: data.actif
            };
            console.log("userDTO envoyé :", userDTO);
 
            axios.post(`${Ressources.CoreUrlB}/template-core/api/users/`, userDTO)
                .then(res => {
                    dispatch({
                        type: ADD_NEW_UTILISATEUR,
                        payload: res.data
                    });
                    resolve(res.data);
                })
                .catch(error => {
                    console.error("Erreur lors de l'ajout d'utilisateur:", error.response ? error.response.data : error);
                    reject(error);
                });
        });
    }
};

export const editUtilisateur = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            // Adapter le format des données au format attendu par l'API
            const userDTO = {
                username: data.username,
                password: data.password || undefined, // Ne pas envoyer le mot de passe s'il est vide
                nom: data.nom,
                prenom: data.prenom,
                description: data.description,
                role: data.role, // Assurez-vous que c'est au format ROLE_ADMIN ou ROLE_AUTRE
                poste: data.poste ? {
                    idPoste: data.poste.idPoste,
                    designation: data.poste.designation
                } : null,
                actif: data.actif
            };
            
            console.log("userDTO pour modification :", userDTO);
            
            axios.put(`${Ressources.CoreUrlB}/template-core/api/users/${encodeURIComponent(data.username)}`, userDTO)
                .then(res => {
                    dispatch({
                        type: EDIT_UTILISATEUR,
                        payload: res.data
                    });
                    resolve(res.data);
                })
                .catch(error => {
                    console.error("Erreur lors de la modification d'utilisateur:", error.response ? error.response.data : error);
                    reject(error);
                });
        });
    }
};

export const deleteUtilisateur = (username) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete(`${Ressources.CoreUrlB}/template-core/api/users/${encodeURIComponent(username)}`)
                .then(res => {
                    dispatch({
                        type: DELETE_UTILISATEUR,
                        payload: username
                    });
                    resolve(res.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};

