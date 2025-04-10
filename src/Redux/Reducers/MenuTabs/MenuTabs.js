import React from 'react';
import {ADD_TAB, CHANGE_TAB, REMOVE_TAB} from '../../Constants/MenuTabs/MenuTabs';
import Menu from "../../../Components/Menu/menu_hooks";

const initialState = {
    tabs: [{
        key: '0',
        title: '',
        icon: <i className="fas fa-home"/>,
        component: <Menu/>,
    }],
    activeKey: '0'
};

const MenuTabsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TAB:
            return {
                ...state,
                tabs: [...state.tabs, action.payload],
                activeKey: action.payload.key
            };
        case CHANGE_TAB:
            return {
                ...state,
                activeKey: action.payload
            };
        case REMOVE_TAB:
            return {
                ...state,
                tabs: action.payload.newTabs,
                activeKey: action.payload.activeKey
            };
        default:
            return state;
    }
};

export default MenuTabsReducer;