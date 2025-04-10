import {GET_ALL_MENU} from '../../Constants/Menu/Menu';

const initialState = {
    codeModule: 'BUD',
    menus: []
};

const MenuReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_MENU:
            return {
                ...state,
                menus: action.payload
            };
        default:
            return state;
    }
};

export default MenuReducer;