import {
    SHOW_ASIDE_ADD_MODE_DEMANDE,
    CLOSE_ASIDE_DEMANDE,
    RESET_ASIDE_DEMANDE,
    SHOW_ASIDE_EDIT_MODE_DEMANDE,
    SHOW_ASIDE_DELETE_MODE_DEMANDE,
    SHOW_ASIDE_CONSULT_MODE_DEMANDE,
    SHOW_MODAL_CONFIRMATION_DEMANDE,
    CLOSE_MODAL_CONFIRMATION_DEMANDE
} from "../../Constants/Demande/DemandeAside";

const initialState = {
    isOpen: false,
    isOpenModalConfirmation: false,
    modeAside: '',
    selectedDemande: null,
    successCallback: null,
    messageToShow: '',
    actionBtnModalConfirmation: null,
    // Initialiser les tableaux vides pour éviter les erreurs undefined
    allClient: [],
    allModule: [],
    allEquipe: [],
    allCollaborateur: []
};

const DemandeAsideReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_ASIDE_ADD_MODE_DEMANDE:
            return {
                ...state,
                isOpen: true,
                modeAside: 'ADD',
                selectedDemande: null,
                successCallback: action.payload
            };

        case SHOW_ASIDE_EDIT_MODE_DEMANDE:
            return {
                ...state,
                isOpen: true,
                modeAside: 'EDIT',
                selectedDemande: action.payload.selectedDemande,
                successCallback: action.payload.successCallback
            };

        case SHOW_ASIDE_DELETE_MODE_DEMANDE:
            return {
                ...state,
                isOpen: true,
                modeAside: 'DELETE',
                selectedDemande: action.payload.selectedDemande,
                successCallback: action.payload.successCallback
            };

        case SHOW_ASIDE_CONSULT_MODE_DEMANDE:
            return {
                ...state,
                isOpen: true,
                modeAside: 'CONSULT',
                selectedDemande: action.payload,
                successCallback: null
            };

        case CLOSE_ASIDE_DEMANDE:
            return {
                ...state,
                isOpen: false
            };

        case RESET_ASIDE_DEMANDE:
            return {
                ...initialState
            };

        case SHOW_MODAL_CONFIRMATION_DEMANDE:
            return {
                ...state,
                isOpenModalConfirmation: true,
                messageToShow: action.payload.messageToShow,
                actionBtnModalConfirmation: {
                    handleBtnCancelModalConfirmation: action.payload.handleBtnCancelModalConfirmation,
                    handleBtnConfirmerModalConfirmation: action.payload.handleBtnConfirmerModalConfirmation
                }
            };
            
        case CLOSE_MODAL_CONFIRMATION_DEMANDE:
            return {
                ...state,
                isOpenModalConfirmation: false,
                messageToShow: '',
                actionBtnModalConfirmation: null
            };

        case 'FETCH_CLIENTS_FOR_DEMANDE_SUCCESS':
            return {
                ...state,
                allClient: action.payload
            };

        case 'FETCH_MODULES_FOR_DEMANDE_SUCCESS':
            return {
                ...state,
                allModule: action.payload
            };
            // return {
            //     ...state,
            //     isOpen: false
            // };

        default:
            return state;
    }
};

export default DemandeAsideReducer;