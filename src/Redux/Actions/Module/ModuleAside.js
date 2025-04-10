import {
    CLOSE_ASIDE_MODULE,
    RESET_ASIDE_MODULE,
    SHOW_ASIDE_ADD_MODE_MODULE,
    SHOW_ASIDE_EDIT_MODE_MODULE,
    SHOW_ASIDE_DELETE_MODE_MODULE,
    SHOW_ASIDE_CONSULT_MODE_MODULE,
    SHOW_MODAL_CONFIRMATION_MODULE,
    CLOSE_MODAL_CONFIRMATION_MODULE
} from "../../Constants/Module/ModuleAside";

export const handleOpenAddMode = (successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_ADD_MODE_MODULE,
            payload: successCallback
        });
    }
}

export const handleOpenConsultMode = (selectedModule) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_CONSULT_MODE_MODULE,
            payload: selectedModule
        });
    }
}

export const handleOpenDeleteMode = (selectedModule, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_DELETE_MODE_MODULE,
            payload: {selectedModule: selectedModule, successCallback: successCallback}
        });
    }
}

export const handleOpenEditMode = (selectedModule, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_EDIT_MODE_MODULE,
            payload: {selectedModule: selectedModule, successCallback: successCallback}
        });
    }
}

export const handleClose = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_ASIDE_MODULE
        });
    }
}

export const clearForm = () => {
    return dispatch => {
        dispatch({
            type: RESET_ASIDE_MODULE
        });
    }
}

export const handleOpenModalConfirmation = (messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CONFIRMATION_MODULE,
            messageToShow: messageToShow,
            actionBtnModalConfirmation: {handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation}
        });
    }
}

export const handleCloseModalConfirmation = (successCallback) => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CONFIRMATION_MODULE,
            payload: successCallback
        });
    }
}