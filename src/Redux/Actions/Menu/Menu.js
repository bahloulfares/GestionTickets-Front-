import axios from 'axios';
import Ressources from '../../../Helper/Ressources';
import {GET_ALL_MENU} from "../../Constants/Menu/Menu";
import {modules} from "./listModules";

export const getAllMenus = (codeModule) => {
    return dispatch => {
       // axios.get(`${Ressources.CoreUrl}/${Ressources.CliniSys.api}/${Ressources.CliniSys.menups}/findByModule?module=${codeModule}`).then(res => {
           let res = modules;
       let boutonPrincipal = res.filter((item, index) => {
                return item.codMnP.length === 2;
            });

            for (let btn of boutonPrincipal) {
                btn.boutonSubMenu = res.filter((item, index) => {
                    return item.codMnP.length === 4 && item.codMnP.indexOf(btn.codMnP) === 0 && item.codMnP !== btn.codMnP;
                });

                for (let subMenu of btn.boutonSubMenu) {
                    subMenu.descSecParent = btn.desMenuP;
                }
            }

            dispatch({
                type: GET_ALL_MENU,
                payload: boutonPrincipal
            })
       // })
    }
};