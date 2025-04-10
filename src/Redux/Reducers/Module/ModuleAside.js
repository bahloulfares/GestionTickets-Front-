import {
    CLOSE_ASIDE_MODULE,
    RESET_ASIDE_MODULE,
    SHOW_ASIDE_ADD_MODE_MODULE,
    SHOW_ASIDE_DELETE_MODE_MODULE,
    SHOW_ASIDE_EDIT_MODE_MODULE,
    SHOW_ASIDE_CONSULT_MODE_MODULE,
    SHOW_MODAL_CONFIRMATION_MODULE,
    CLOSE_MODAL_CONFIRMATION_MODULE
} from "../../Constants/Module/ModuleAside";

const initialState = {
    isOpen: false,
    modeAside: '',
    selectedModule: null,
};

const ModuleAsideReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_ASIDE_ADD_MODE_MODULE:
            return {
                ...state,
                isOpen: true,
                modeAside: "add",
                refreshDataGrid: action.refreshDataGrid
            };
        case SHOW_ASIDE_DELETE_MODE_MODULE:
            return {
                ...state,
                modeAside: 'DELETE',
                isOpen: true,
                selectedModule: action.payload.selectedModule,
                successCallback: action.payload.successCallback
            };
        case SHOW_ASIDE_EDIT_MODE_MODULE:
            return {
                ...state,
                modeAside: 'EDIT',
                isOpen: true,
                selectedModule: action.payload.selectedModule,
                successCallback: action.payload.successCallback
            };
        case CLOSE_ASIDE_MODULE:
            return {
                ...state,
                isOpen: false,
                selectedModule: null,
            };
        case RESET_ASIDE_MODULE:
            return {
                ...state,
                form: {
                    codeSaisie: 'test'
                },
                selectedModule: null,
            };
        case SHOW_ASIDE_CONSULT_MODE_MODULE:
            return {
                ...state,
                modeAside: 'CONSULT',
                isOpen: true,
                selectedModule: action.payload
            };
        case SHOW_MODAL_CONFIRMATION_MODULE:
            return {
                ...state,
                isConfirmationOpen: true,
                messageToShow: action.messageToShow,
                actionBtnModalConfirmation: action.actionBtnModalConfirmation
            };
        case CLOSE_MODAL_CONFIRMATION_MODULE:
            return {
                ...state,
                isConfirmationOpen: false,
            };
        default:
            return state;
    }
};

export default ModuleAsideReducer;