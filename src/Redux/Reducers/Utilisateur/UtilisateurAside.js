import {
    CLOSE_ASIDE_UTILISATEUR,
    RESET_ASIDE_UTILISATEUR,
    SHOW_ASIDE_ADD_MODE_UTILISATEUR,
    SHOW_ASIDE_DELETE_MODE_UTILISATEUR,
    SHOW_ASIDE_EDIT_MODE_UTILISATEUR,
    GET_ALL_POSTE,
    GET_ALL_ROLE,
    SHOW_ASIDE_CONSULT_MODE_UTILISATEUR,
    SHOW_MODAL_CONFIRMATION_UTILISATEUR,
    CLOSE_MODAL_CONFIRMATION_UTILISATEUR
} from "../../Constants/Utilisateur/UtilisateurAside";

const initialState = {
    isOpen: false,
    modeAside: '',
    allPoste: '',
    allRole: '',
    selectedUtilisateur: null,


};

const UtilisateurAsideReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_ASIDE_ADD_MODE_UTILISATEUR:
            return {
                ...state,
                modeAside: 'ADD',
                isOpen: true,
                selectedUtilisateur: null,
                successCallback: action.payload
            };
        case SHOW_ASIDE_DELETE_MODE_UTILISATEUR:
            return {
                ...state,
                modeAside: 'DELETE',
                isOpen: true,
                selectedUtilisateur: action.payload.selectedUtilisateur,
                successCallback: action.payload.successCallback
            };
        case SHOW_ASIDE_EDIT_MODE_UTILISATEUR:
            return {
                ...state,
                modeAside: 'EDIT',
                isOpen: true,
                selectedUtilisateur: action.payload.selectedUtilisateur,
                successCallback: action.payload.successCallback
            };
        case CLOSE_ASIDE_UTILISATEUR:
            return {
                ...state,
                isOpen: false,
                selectedUtilisateur: null,
            };
        case RESET_ASIDE_UTILISATEUR:
            return {
                ...state,
                form: {
                    codeSaisie: 'test'
                },
                selectedUtilisateur: null,
            };
        case GET_ALL_POSTE:
            return {
                ...state,
                allPoste: action.payload
            };
        case GET_ALL_ROLE:
            return {
                ...state,
                allRole: action.payload
            };
        case SHOW_ASIDE_CONSULT_MODE_UTILISATEUR:
            return {
                ...state,
                modeAside: 'CONSULT',
                isOpen: true,
                selectedUtilisateur: action.payload
            };
        case SHOW_MODAL_CONFIRMATION_UTILISATEUR:
            return {
                ...state,
                isConfirmationOpen: true,
                messageToShow: action.messageToShow,
                actionBtnModalConfirmation: action.actionBtnModalConfirmation
            };
        case CLOSE_MODAL_CONFIRMATION_UTILISATEUR:
            return {
                ...state,
                isConfirmationOpen: false,
            };
        default:
            return state;
    }
};

export default UtilisateurAsideReducer;