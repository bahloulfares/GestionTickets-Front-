import axios from 'axios';
import Ressources from '../../../Helper/Ressources';
import { LOGIN, LOGOUT } from "../../Constants/Login/Login";


export const signIn = (email, password) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`${Ressources.CoreUrlB}/compte-clients-core/login?username=${encodeURIComponent(email) }&password=${encodeURIComponent(password)}&submit=Login`)
                .then(res => {
                    dispatch({
                        type: LOGIN,
                        payload: email
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
}
export const logOut = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`${Ressources.CoreUrlB}/compte-clients-core/logout`)
                .then(res => {
                    dispatch({
                        type: LOGOUT,
                        payload: ""
                    });
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
}




