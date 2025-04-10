import {
    CLOSE_ASIDE_POSTE,
    RESET_ASIDE_POSTE,
    SHOW_ASIDE_ADD_MODE_POSTE,
    SHOW_ASIDE_DELETE_MODE_POSTE,
    SHOW_ASIDE_EDIT_MODE_POSTE,
    GET_ALL_TYPE_POSTE,
    SHOW_ASIDE_CONSULT_MODE_POSTE,
    SHOW_MODAL_CONFIRMATION_POSTE,
    CLOSE_MODAL_CONFIRMATION_POSTE
} from "../../Constants/Poste/PosteAside";

const initialState = {
    isOpen: false,
    modeAside: '',
    allTypePoste: '',
    selectedPoste: null,
   

};

const PosteAsideReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_ASIDE_ADD_MODE_POSTE:
            return {
                ...state,
                modeAside: 'ADD',
                isOpen: true,
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
        case CLOSE_ASIDE_POSTE:
            return {
                ...state,
                isOpen: false,
                selectedPoste: null,
            };
        case RESET_ASIDE_POSTE:
            return {
                ...state,
                form: {
                    codeSaisie: 'test'
                },
                selectedPoste: null,
            };
        case GET_ALL_TYPE_POSTE:
            return {
                ...state,
                allTypePoste: action.payload
            };
            case SHOW_ASIDE_CONSULT_MODE_POSTE:
                return {
                    ...state,
                    modeAside: 'CONSULT',
                    isOpen: true,
                    selectedPoste: action.payload
                };        
                case SHOW_MODAL_CONFIRMATION_POSTE:
                return {
                    ...state,
                    isConfirmationOpen: true,
                    messageToShow: action.messageToShow,
                    actionBtnModalConfirmation: action.actionBtnModalConfirmation
                };
            case CLOSE_MODAL_CONFIRMATION_POSTE:
                return {
                    ...state,
                    isConfirmationOpen: false,
                };
        default:
            return state;
    }
};

export default PosteAsideReducer;