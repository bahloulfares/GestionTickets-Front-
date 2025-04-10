import { GET_CONFIG_ERP, GET_DATE_SERVEUR } from "../../Constants/Header/Header";
import axios from "axios";
import Ressources from "../../../Helper/Ressources";

/* export const getConfigERP = () => {
    return dispatch => {
        axios.get(`${Ressources.CoreUrl}/${Ressources.CliniSys.api}/${Ressources.CliniSys.configerps}`).then(res => {
            dispatch({
                type: GET_CONFIG_ERP,
                payload: res.data
            })
        })
    }
}; */

export const getDateServeur = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
           /*  axios.get(`${Ressources.CoreUrl}/CliniSys/${Ressources.CliniSys.dateServeur}`).then(res => {
                dispatch({
                    type: GET_DATE_SERVEUR,
                    payload: res.data
                }) */
                resolve(new Date());
        //    })
        })
    }
};