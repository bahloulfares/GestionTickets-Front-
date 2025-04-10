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
    btnAddInstance: null,
    btnConsultInstance: null,
    btnEditInstance: null,
    btnDeleteInstance: null,
    btnEditionInstance: null,
    dateDebut: null,
    dateFin: null 
};

const UtilisateursReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_UTILISATEUR:
            return {
                ...state,
                allUtilisateur: action.payload
            };
        case GET_UTILISATEUR_BY_CODE:
            return {
                ...state,
                selectedUtilisateur: action.payload
            };
        case ADD_NEW_UTILISATEUR:
            return {
                ...state,
                allUtilisateur: [...state.allUtilisateur, action.payload],

            };
        case EDIT_UTILISATEUR:
            return {
                ...state,
                allUtilisateur: [...state.allUtilisateur, action.payload]
            };
        case DELETE_UTILISATEUR:
            return {
                ...state,
                allUtilisateur: [...state.allUtilisateur, action.payload]
            }; 

        default:
            return state;
    }
}
export default UtilisateursReducer;
