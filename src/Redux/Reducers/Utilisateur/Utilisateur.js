import {
    GET_ALL_UTILISATEUR,
    GET_UTILISATEUR_BY_CODE,
    ADD_NEW_UTILISATEUR,
    DELETE_UTILISATEUR,
    EDIT_UTILISATEUR,
} from '../../Constants/Utilisateur/Utilisateur';

const initialState = {
    allUtilisateur: [],
    selectedUtilisateur: null,
    loading: false,
    error: null
};

const UtilisateursReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_UTILISATEUR:
            return {
                ...state,
                allUtilisateur: action.payload,
                error: null
            };
        case GET_UTILISATEUR_BY_CODE:
            return {
                ...state,
                selectedUtilisateur: action.payload,
                error: null
            };
        case ADD_NEW_UTILISATEUR:
            return {
                ...state,
                allUtilisateur: [...state.allUtilisateur, action.payload],
                error: null
            };
        case EDIT_UTILISATEUR:
            return {
                ...state,
                allUtilisateur: state.allUtilisateur.map(user => 
                    user.username === action.payload.username ? action.payload : user
                ),
                selectedUtilisateur: action.payload,
                error: null
            };
        case DELETE_UTILISATEUR:
            return {
                ...state,
                allUtilisateur: state.allUtilisateur.filter(user => user.username !== action.payload),
                selectedUtilisateur: null,
                error: null
            };
        default:
            return state;
    }
};

export default UtilisateursReducer;
