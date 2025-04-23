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
    isOpenModalConfirmation: false,
    modeAside: '',
    selectedUtilisateur: null,
    successCallback: null,
    allPoste: [],
    allRole: [],
    messageToShow: '',
    actionBtnModalConfirmation: null
};

const UtilisateurAsideReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_ASIDE_ADD_MODE_UTILISATEUR:
            return {
                ...state,
                isOpen: true,
                modeAside: 'ADD',
                selectedUtilisateur: null,
                successCallback: action.payload
            };

        case SHOW_ASIDE_EDIT_MODE_UTILISATEUR:
            return {
                ...state,
                isOpen: true,
                modeAside: 'EDIT',
                selectedUtilisateur: action.payload.selectedUtilisateur,
                successCallback: action.payload.successCallback
            };

        case SHOW_ASIDE_DELETE_MODE_UTILISATEUR:
            return {
                ...state,
                isOpen: true,
                modeAside: 'DELETE',
                selectedUtilisateur: action.payload.selectedUtilisateur,
                successCallback: action.payload.successCallback
            };

        case SHOW_ASIDE_CONSULT_MODE_UTILISATEUR:
            return {
                ...state,
                isOpen: true,
                modeAside: 'CONSULT',
                selectedUtilisateur: action.payload,
                successCallback: null
            };

        case CLOSE_ASIDE_UTILISATEUR:
            return {
                ...state,
                isOpen: false
            };

        case RESET_ASIDE_UTILISATEUR:
            return {
                ...initialState
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

        case SHOW_MODAL_CONFIRMATION_UTILISATEUR:
            return {
                ...state,
                isOpenModalConfirmation: true,
                messageToShow: action.payload.messageToShow,
                actionBtnModalConfirmation: {
                    handleBtnCancelModalConfirmation: action.payload.handleBtnCancelModalConfirmation,
                    handleBtnConfirmerModalConfirmation: action.payload.handleBtnConfirmerModalConfirmation
                }
            };

        // In the reducer, make sure this case is properly implemented:
        case CLOSE_MODAL_CONFIRMATION_UTILISATEUR:
            return {
                ...state,
                isOpenModalConfirmation: false,
                messageToShow: '',
                actionBtnModalConfirmation: null
            };

        default:
            return state;
    }
};

export default UtilisateurAsideReducer;