import { GET_ALL_MENU } from '../../Constants/Menu/Menu';
import { modules } from '../../Actions/Menu/listModules';

const initialState = {
    codeModule: 'BUD',
    menus: [],
    accessibleMenus: []
};

const MenuReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_MENU:
            return {
                ...state,
                menus: action.payload
            };
        case 'SET_USER_ROLE':
            // Filter menus based on user role
            const accessibleMenus = modules.filter(menu => 
                !menu.mnName && menu.roles && menu.roles.includes(action.payload)
            );
            return {
                ...state,
                userRole: action.payload,
                accessibleMenus
            };
        case 'FILTER_ACCESSIBLE_MENUS':
            // This action can be dispatched after login to update accessible menus
            const userRole = state.userRole || action.payload;
            const filteredMenus = modules.filter(menu => 
                !menu.mnName && menu.roles && menu.roles.includes(userRole)
            );
            return {
                ...state,
                accessibleMenus: filteredMenus
            };
        default:
            return state;
    }
};

export default MenuReducer;