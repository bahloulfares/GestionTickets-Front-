import axios from 'axios';
import Ressources from '../../../Helper/Ressources';
import { GET_ALL_UTILISATEUR, ADD_NEW_UTILISATEUR, DELETE_UTILISATEUR, EDIT_UTILISATEUR, GET_UTILISATEUR_BY_CODE } from "../../Constants/Utilisateur/Utilisateur";
// Fix the import path to use the correct function from UtilisateurAside
import { handleCloseModalConfirmation, handleClose } from './UtilisateurAside';

export const getAllUtilisateurs = (dataGrid) => {
    return dispatch => {
        if (dataGrid && dataGrid.instance) {
            dataGrid.instance.beginCustomLoading();
        }
        
        // Fix the URL format - remove the slash between CoreUrlB and template-core
        return axios.get(`${Ressources.CoreUrlB}/template-core/api/users`)
            .then(res => {
                console.log('User data from API:', res.data);
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
                // Ajouter une notification d'erreur pour l'utilisateur
                if (window.notify) {
                    window.notify("Erreur lors de la récupération des utilisateurs", "error", { position: "top", timeout: 3000 });
                }
                throw error;
            });
    };
};

export const getUtilisateurByCode = (username) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            // Fix the URL format
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
            // Extraction de l'ID du poste de manière plus claire
            let idPoste = null;
            
            if (data.poste) {
                console.log("Données du poste reçues:", data.poste);
                // Si poste est un objet (sélectionné depuis une liste déroulante)
                if (typeof data.poste === 'object' && data.poste !== null) {
                    idPoste = data.poste.idPoste;
                    console.log("ID du poste extrait de l'objet:", idPoste);
                } 
                // Si poste est déjà un nombre (ID direct)
                else if (typeof data.poste === 'number') {
                    idPoste = data.poste;
                    console.log("ID du poste (nombre):", idPoste);
                } 
                // Si poste est une chaîne qui peut être convertie en nombre
                else if (typeof data.poste === 'string' && !isNaN(parseInt(data.poste))) {
                    idPoste = parseInt(data.poste);
                    console.log("ID du poste converti de chaîne en nombre:", idPoste);
                }
            }

            // Construction de l'objet utilisateur selon le format attendu par le backend
            const userDTO = {
                username: data.username,
                password: data.password,
                nom: data.nom,
                prenom: data.prenom,
                description: data.description,
                role: data.role,
                idPoste: idPoste, // Utilisation de idPoste comme dans le DTO du backend
                actif: data.actif === undefined ? true : data.actif
            };
            
            console.log("Utilisateur à ajouter:", userDTO);
 
            axios.post(`${Ressources.CoreUrlB}/template-core/api/users`, userDTO)
                .then(res => {
                    dispatch({
                        type: ADD_NEW_UTILISATEUR,
                        payload: res.data
                    });
                    
                    // Fermeture des modales après succès
                    dispatch(handleCloseModalConfirmation());
                    dispatch(handleClose());
                    
                    resolve(res.data);
                })
                .catch(error => {
                    console.error("Erreur lors de l'ajout d'utilisateur:", error.response ? error.response.data : error);
                    reject(error);
                });
        });
    }
};

export const editUtilisateur = (utilisateur) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            // Création d'une copie pour éviter de modifier l'objet original
            let utilisateurModifie = {...utilisateur};
            
            // Traitement du poste de manière cohérente avec la fonction d'ajout
            if (utilisateur.poste) {
                console.log("Modification - Données du poste reçues:", utilisateur.poste);
                
                // Si poste est un objet (sélectionné depuis une liste déroulante)
                if (typeof utilisateur.poste === 'object' && utilisateur.poste !== null) {
                    utilisateurModifie.idPoste = utilisateur.poste.idPoste;
                    console.log("Modification - ID du poste extrait de l'objet:", utilisateurModifie.idPoste);
                } 
                // Si poste est déjà un nombre (ID direct)
                else if (typeof utilisateur.poste === 'number') {
                    utilisateurModifie.idPoste = utilisateur.poste;
                    console.log("Modification - ID du poste (nombre):", utilisateurModifie.idPoste);
                } 
                // Si poste est une chaîne qui peut être convertie en nombre
                else if (typeof utilisateur.poste === 'string' && !isNaN(parseInt(utilisateur.poste))) {
                    utilisateurModifie.idPoste = parseInt(utilisateur.poste);
                    console.log("Modification - ID du poste converti de chaîne en nombre:", utilisateurModifie.idPoste);
                }
                
                // Suppression de l'objet poste car le backend attend seulement l'ID
                delete utilisateurModifie.poste;
            }
            
            // Conversion de id_poste en idPoste si nécessaire
            if (utilisateurModifie.id_poste !== undefined) {
                utilisateurModifie.idPoste = utilisateurModifie.id_poste;
                delete utilisateurModifie.id_poste;
            }
            
            // Suppression des champs non attendus par le backend
            if (utilisateurModifie.posteDesignation) {
                delete utilisateurModifie.posteDesignation;
            }
            
            console.log("Utilisateur à modifier:", utilisateurModifie);
            
            // Fermer la modal avant d'envoyer la requête
            dispatch(handleCloseModalConfirmation());
            
            axios.put(`${Ressources.CoreUrlB}/template-core/api/users`, utilisateurModifie)
                .then(res => {
                    dispatch({
                        type: EDIT_UTILISATEUR,
                        payload: res.data
                    });
                    
                    // Fermer le panneau latéral après succès
                    dispatch(handleClose());
                    
                    resolve(res.data);
                })
                .catch(error => {
                    console.error("Erreur lors de la modification de l'utilisateur:", error);
                    // Ne pas fermer le panneau en cas d'erreur
                    reject(error);
                });
        });
    };
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
                    // Close modal confirmation to prevent dimming effect
                    dispatch(handleCloseModalConfirmation());
                    // Also close the aside panel
                    dispatch(handleClose());
                    resolve(res.data);
                })
                .catch(error => {
                    console.error("Erreur lors de la suppression de l'utilisateur:", error);
                    // Close modal confirmation even on error
                    dispatch(handleCloseModalConfirmation());
                    // Also close the aside panel on error
                    dispatch(handleClose());
                    
                    reject(error);
                });
        });
    };
};

