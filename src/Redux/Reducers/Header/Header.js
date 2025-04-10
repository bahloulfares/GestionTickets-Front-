import {CHANGE_BREADCRUMBS, GET_CONFIG_ERP, GET_DATE_SERVEUR} from '../../Constants/Header/Header';

const initialState = {
};

const HeaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_BREADCRUMBS:
            return {
                ...state,
                breadcrumbs: action.payload
            };
        case GET_CONFIG_ERP:
            return {
                ...state,
                configERP: action.payload
            };
            case GET_DATE_SERVEUR:
                return {
                    ...state,
                    dateServeur: action.payload
                };
        default:
            return state;
    }
};

export default HeaderReducer;