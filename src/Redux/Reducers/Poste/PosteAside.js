import {
    CLOSE_ASIDE_POSTE,
    RESET_ASIDE_POSTE,
    SHOW_ASIDE_ADD_MODE_POSTE,
    SHOW_ASIDE_DELETE_MODE_POSTE,
    SHOW_ASIDE_EDIT_MODE_POSTE,
    SHOW_ASIDE_CONSULT_MODE_POSTE,
    SHOW_MODAL_CONFIRMATION_POSTE,
    CLOSE_MODAL_CONFIRMATION_POSTE
} from "../../Constants/Poste/PosteAside";

const initialState = {
    isOpen: false,
    modeAside: '',
    selectedPoste: null,
    successCallback: null,
    // Add these new state properties for the confirmation modal
    isOpenModalConfirmation: false,
    messageToShow: '',
    actionBtnModalConfirmation: null
};

const PosteAsideReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_ASIDE_ADD_MODE_POSTE:
            return {
                ...state,
                isOpen: true,
                modeAside: "ADD",
                selectedPoste: null,
                successCallback: action.payload
            };
        case SHOW_ASIDE_DELETE_MODE_POSTE:
            return {
                ...state,
                modeAside: 'DELETE',
                isOpen: true,
                selectedPoste: action.payload.selectedPoste,
                successCallback: action.payload.successCallback
            };
        case SHOW_ASIDE_EDIT_MODE_POSTE:
            return {
                ...state,
                modeAside: 'EDIT',
                isOpen: true,
                selectedPoste: action.payload.selectedPoste,
                successCallback: action.payload.successCallback
            };
        case SHOW_ASIDE_CONSULT_MODE_POSTE:
            return {
                ...state,
                modeAside: 'CONSULT',
                isOpen: true,
                selectedPoste: action.payload.selectedPoste,
                successCallback: action.payload.successCallback
            };
        case SHOW_MODAL_CONFIRMATION_POSTE:
            return {
                ...state,
                isOpenModalConfirmation: true,
                messageToShow: action.payload.message,
                actionBtnModalConfirmation: {
                    handleBtnCancelModalConfirmation: action.payload.handleBtnCancelModalConfirmation,
                    handleBtnConfirmerModalConfirmation: action.payload.handleBtnConfirmerModalConfirmation
                }
            };
            
        case CLOSE_MODAL_CONFIRMATION_POSTE:
            return {
                ...state,
                isOpenModalConfirmation: false,
                messageToShow: '',
                actionBtnModalConfirmation: null
            };
            
        case CLOSE_ASIDE_POSTE:
            return {
                ...state,
                isOpen: false
            };
        case RESET_ASIDE_POSTE:
            return initialState;
        default:
            return state;
    }
};

export default PosteAsideReducer;