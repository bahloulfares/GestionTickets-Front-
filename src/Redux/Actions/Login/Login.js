import axios from 'axios';
import Ressources from '../../../Helper/Ressources';
import { 
    LOGIN, 
    LOGOUT, 
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGIN_FAILURE,
    AUTH_CHECK,
    AUTH_CHECK_SUCCESS,
    AUTH_CHECK_FAILURE
} from "../../Constants/Login/Login";

// Amélioration de la fonction signIn
export const signIn = (email, password) => {
    return function(dispatch) {
        dispatch({ type: LOGIN_REQUEST });
        
        return new Promise((resolve, reject) => {
            axios.post(`${Ressources.CoreUrlB}/template-core/login?username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&submit=Login`)
                .then(res => {
                    const authToken = res.headers['x-auth-token'];
                    if (authToken) {
                        localStorage.setItem("x-auth-token", authToken);
                        // Mettre à jour les headers d'axios pour les futures requêtes
                        axios.defaults.headers.common['Authorization'] = authToken;
                        axios.defaults.headers.common['x-auth-token'] = authToken;
                    }
                    
                    dispatch({
                        type: LOGIN_SUCCESS,
                        payload: email
                    });
                    resolve(true);
                }).catch(function (error) {
                    const errorMessage = error.response?.data?.message || error.message;
                    dispatch({
                        type: LOGIN_FAILURE,
                        payload: errorMessage
                    });
                    reject(error);
                });
        });
    }
}

// Amélioration de la fonction logOut
export const logOut = () => {
    return function(dispatch) {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem("x-auth-token");
            if (!token) {
                // Si pas de token, on nettoie quand même et on résout
                performLogout(dispatch);
                resolve(true);
                return;
            }
            
            const config = {
                headers: {
                    'X-Auth-Token': token
                }
            };
            
            axios.post(`${Ressources.CoreUrlB}/template-core/logout`, {}, config)
                .then(res => {
                    performLogout(dispatch);
                    resolve(true);
                }).catch(function (error) {
                    performLogout(dispatch);
                    reject(error);
                });
        });
    }
}

// Fonction utilitaire pour effectuer le logout
const performLogout = (dispatch) => {
    localStorage.removeItem("x-auth-token");
    // Nettoyer les headers d'axios
    delete axios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['x-auth-token'];
    
    if (typeof dispatch === 'function') {
        dispatch({
            type: LOGOUT,
            payload: ""
        });
    }
    
    window.location.href = '/';
};

export const checkAuthentication = () => {
    return function(dispatch) {
        // Dispatch check action
        dispatch({ type: AUTH_CHECK });
        
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem("x-auth-token");
            
            if (!token) {
                dispatch({
                    type: AUTH_CHECK_FAILURE,
                    payload: "No token found"
                });
                resolve(false);
                return;
            }
            
            const config = {
                headers: {
                    'X-Auth-Token': token
                }
            };
            
            axios.get(`${Ressources.CoreUrlB}/template-core/api/users/is-authenticated`, config)
                .then(res => {
                    if (res.status === 200) {
                        dispatch({
                            type: AUTH_CHECK_SUCCESS,
                            payload: res.data.username
                        });
                        resolve(true);
                    } else {
                        localStorage.removeItem("x-auth-token");
                        dispatch({
                            type: AUTH_CHECK_FAILURE,
                            payload: "Authentication failed"
                        });
                        resolve(false);
                    }
                }).catch(function (error) {
                    localStorage.removeItem("x-auth-token");
                    dispatch({
                        type: AUTH_CHECK_FAILURE,
                        payload: error.message
                    });
                    resolve(false);
                });
        });
    }
}

// Fonction utilitaire pour vérifier si l'utilisateur est authentifié
export const isUserAuthenticated = () => {
    return !!localStorage.getItem("x-auth-token");
}




