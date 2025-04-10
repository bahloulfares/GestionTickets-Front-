import {ADD_TAB, CHANGE_TAB, REMOVE_TAB} from "../../Constants/MenuTabs/MenuTabs";
import {CHANGE_BREADCRUMBS} from "../../Constants/Header/Header";

export const addTab = (tab) => {
    return dispatch => {
        dispatch({
            type: ADD_TAB,
            payload: tab
        });

        dispatch({
            type: CHANGE_BREADCRUMBS,
            payload: tab.title
        });
    }
};

export const removeTab = (newTabs, activeKey) => {
    return dispatch => {
        dispatch({
            type: REMOVE_TAB,
            payload: {
                newTabs: newTabs,
                activeKey: activeKey
            }
        });

        dispatch({
            type: CHANGE_BREADCRUMBS,
            payload: newTabs[0].title
        });
    }
};

export const changeTab = (activeKey) => {
    return (dispatch, getState) => {
        dispatch({
            type: CHANGE_TAB,
            payload: activeKey
        });

        let title = "";
        let activeTab = getState().MenuReducer.menus.filter(el => el.codMnP === activeKey);
        if(activeTab.length === 1) {
            title = activeTab[0].desMenuP;
        } else if(activeTab.length === 0) {
            for (let menu of getState().MenuReducer.menus) {
                activeTab = menu.boutonSubMenu.filter(el => el.codMnP === activeKey);
                if(activeTab.length === 1) {
                    title = `${activeTab[0].descSecParent}/${activeTab[0].desMenuP}`;
                    break;
                }
            }
        }

        dispatch({
            type: CHANGE_BREADCRUMBS,
            payload: title
        });
    }
};