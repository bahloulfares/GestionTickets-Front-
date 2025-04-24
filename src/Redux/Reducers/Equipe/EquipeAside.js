import {
    CLOSE_ASIDE_EQUIPE,
    RESET_ASIDE_EQUIPE,
    SHOW_ASIDE_ADD_MODE_EQUIPE,
    SHOW_ASIDE_DELETE_MODE_EQUIPE,
    SHOW_ASIDE_EDIT_MODE_EQUIPE,
    SHOW_ASIDE_CONSULT_MODE_EQUIPE,
    SHOW_MODAL_CONFIRMATION_EQUIPE,
    CLOSE_MODAL_CONFIRMATION_EQUIPE
} from "../../Constants/Equipe/EquipeAside";

const initialState = {
    isOpen: false,
    isOpenModalConfirmation: false,
    modeAside: '',
    selectedEquipe: null,
    successCallback: null,
    messageToShow: '',
    actionBtnModalConfirmation: null
};

const EquipeAsideReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_ASIDE_ADD_MODE_EQUIPE:
            return {
                ...state,
                isOpen: true,
                modeAside: 'ADD',
                selectedEquipe: null,
                successCallback: action.payload
            };

        case SHOW_ASIDE_EDIT_MODE_EQUIPE:
            return {
                ...state,
                isOpen: true,
                modeAside: 'EDIT',
                selectedEquipe: action.payload.selectedEquipe,
                successCallback: action.payload.successCallback
            };

        case SHOW_ASIDE_DELETE_MODE_EQUIPE:
            return {
                ...state,
                isOpen: true,
                modeAside: 'DELETE',
                selectedEquipe: action.payload.selectedEquipe,
                successCallback: action.payload.successCallback
            };

        case SHOW_ASIDE_CONSULT_MODE_EQUIPE:
            return {
                ...state,
                isOpen: true,
                modeAside: 'CONSULT',
                selectedEquipe: action.payload,
                successCallback: null
            };

        case CLOSE_ASIDE_EQUIPE:
            return {
                ...state,
                isOpen: false
            };

        case RESET_ASIDE_EQUIPE:
            return {
                ...initialState
            };

        // Vérifiez que les cas pour SHOW_MODAL_CONFIRMATION_EQUIPE et CLOSE_MODAL_CONFIRMATION_EQUIPE sont correctement implémentés
        case SHOW_MODAL_CONFIRMATION_EQUIPE:
            return {
                ...state,
                isOpenModalConfirmation: true,
                messageToShow: action.payload.messageToShow,
                actionBtnModalConfirmation: {
                    handleBtnCancelModalConfirmation: action.payload.handleBtnCancelModalConfirmation,
                    handleBtnConfirmerModalConfirmation: action.payload.handleBtnConfirmerModalConfirmation
                }
            };
        case CLOSE_MODAL_CONFIRMATION_EQUIPE:
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

export default EquipeAsideReducer;