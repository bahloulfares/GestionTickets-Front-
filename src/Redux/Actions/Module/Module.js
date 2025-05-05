import axios from 'axios';
import Ressources from '../../../Helper/Ressources';
import { GET_ALL_MODULE, ADD_NEW_MODULE, DELETE_MODULE, EDIT_MODULE, GET_MODULE_BY_CODE } from "../../Constants/Module/Module";

export const getAllModules = (dataGrid) => {
   return dispatch => {
       dataGrid.instance.beginCustomLoading();
       return axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.modules}`)
           .then(res => {
               dispatch({
                   type: GET_ALL_MODULE,
                   payload: res.data
               });
               dataGrid.instance.endCustomLoading();
               return res.data;
           })
           .catch(error => {
               dataGrid.instance.endCustomLoading();
               console.error("Erreur lors de la récupération des modules:", error);
               throw error;
           });
   }
}; 

export const getModuleByCode = (code) => {
   return dispatch => {
       return new Promise((resolve, reject) => {
           // Check if code is undefined or empty
           if (!code) {
               console.error("Module code is undefined or empty");
               return reject(new Error("Module code is required"));
           }
           
           axios.get(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.modules}/${encodeURI(code)}`)
               .then(res => {
                   dispatch({
                       type: GET_MODULE_BY_CODE,
                       payload: res.data
                   });
                   resolve(res.data);
               })
               .catch(error => {
                   console.error("Error fetching module:", error);
                   reject(error);
               });
       });
   }
};

export const addNewModule = (data) => {
   return dispatch => {
       return new Promise((resolve, reject) => {
           // Log the data being sent for debugging
           console.log("Sending module data:", data);
           
           axios.post(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.modules}`, data)
               .then(res => {
                   dispatch({
                       type: ADD_NEW_MODULE,
                       payload: res.data
                   });
                   resolve(res.data);
               })
               .catch(function (error) {
                   console.error("Error adding module:", error);
                   if (error.response) {
                       // The request was made and the server responded with a status code
                       // that falls out of the range of 2xx
                       console.error("Response data:", error.response.data);
                       console.error("Response status:", error.response.status);
                   }
                   reject(error);
               });
       });
   }
};

export const editModule = (data) => {
   return dispatch => {
       return new Promise((resolve, reject) => {
           // Log the data being sent for debugging
           console.log("Editing module data:", data);
           
           axios.put(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.modules}/${data.idModule}`, data)
               .then(() => {
                   dispatch({
                       type: EDIT_MODULE,
                       payload: data
                   });
                   resolve(true);
               }).catch(function (error) {
                   console.error("Error editing module:", error);
                   if (error.response) {
                       console.error("Response data:", error.response.data);
                       console.error("Response status:", error.response.status);
                   }
                   reject(error);
               });
       });
   }
};

export const deleteModule = (code) => {
   return dispatch => {
       return new Promise((resolve, reject) => {
           axios.delete(`${Ressources.CoreUrlB}/${Ressources.compteClient.api}/${Ressources.compteClient.modules}/${code}`)
               .then(() => {
                   dispatch({
                       type: DELETE_MODULE,
                       payload: code
                   });
                   resolve(true);
               }).catch(function (error) {
                   console.error("Error deleting module:", error);
                   if (error.response) {
                       console.error("Response data:", error.response.data);
                       console.error("Response status:", error.response.status);
                   }
                   reject(error);
               });
       });
   }
};