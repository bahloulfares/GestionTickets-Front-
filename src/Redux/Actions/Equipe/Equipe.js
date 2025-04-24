import {
    GET_ALL_EQUIPE,
    GET_EQUIPE_BY_CODE,
    ADD_NEW_EQUIPE,
    DELETE_EQUIPE,
    EDIT_EQUIPE
} from '../../Constants/Equipe/Equipe';
import axios from 'axios';
import Ressources from '../../../Helper/Ressources';
import notify from 'devextreme/ui/notify';
import { notifyOptions } from '../../../Helper/Config';

export const getAllEquipes = () => {
    return dispatch => {
        return axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/equipes`)
            .then(res => {
                dispatch({
                    type: GET_ALL_EQUIPE,
                    payload: res.data
                });
                return res.data;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des équipes:", error);
                throw error;
            });
    }
}

export const getEquipeByCode = (idEquipe) => {
    return dispatch => {
        return axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/equipes/${idEquipe}`)
            .then(res => {
                dispatch({
                    type: GET_EQUIPE_BY_CODE,
                    payload: res.data
                });
                return res.data;
            })
            .catch(error => {
                console.error(`Erreur lors de la récupération de l'équipe ${idEquipe}:`, error);
                throw error;
            });
    }
}

// export const addNewEquipe = (equipe) => {
//     return dispatch => {
//         return axios.post(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/equipes`, equipe)
//             .then(res => {
//                 dispatch({
//                     type: ADD_NEW_EQUIPE,
//                     payload: res.data
//                 });
//                 return res.data;
//             })
//             .catch(error => {
//                 console.error("Erreur lors de l'ajout de l'équipe:", error);
//                 throw error;
//             });
//     }
// }
export const addNewEquipe = (equipe) => {
    return dispatch => {
      return axios.post(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/equipes`, equipe)
        .then(res => {
          dispatch({
            type: ADD_NEW_EQUIPE,
            payload: res.data
          });
          return res.data;
        })
        .catch(error => {
          console.error("Erreur lors de l'ajout de l'équipe:", error);
          throw error;
        });
    };
  };
export const editEquipe = (equipe) => {
    return dispatch => {
      return axios.put(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/equipes/${equipe.idEquipe}`, equipe)
        .then(res => {
          dispatch({
            type: EDIT_EQUIPE,
            payload: res.data
          });
          return res.data;
        })
        .catch(error => {
          console.error("Erreur lors de la modification de l'équipe:", error);
          throw error;
        });
    };
  };

  export const deleteEquipe = (idEquipe) => {
    return dispatch => {
      return axios.delete(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/equipes/${idEquipe}`)
        .then(res => {
          dispatch({
            type: DELETE_EQUIPE,
            payload: idEquipe
          });
          return res.data;
        })
        .catch(error => {
          console.error("Erreur lors de la suppression de l'équipe:", error);
          throw error;
        });
    };
  };

// export const deleteEquipe = (idEquipe) => {
//     return dispatch => {
//         return axios.delete(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/equipes/${idEquipe}`)
//             .then(res => {
//                 dispatch({
//                     type: DELETE_EQUIPE,
//                     payload: idEquipe
//                 });
//                 notify("Équipe supprimée avec succès", "success", notifyOptions);
//                 return res.data;
//             })
//             .catch(error => {
//                 console.error("Erreur lors de la suppression de l'équipe:", error);
//                 notify("Erreur lors de la suppression de l'équipe", "error", notifyOptions);
//                 throw error;
//             });
//     }
// }