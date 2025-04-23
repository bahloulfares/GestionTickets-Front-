import {
    CLOSE_ASIDE_POSTE,
    RESET_ASIDE_POSTE,
    SHOW_ASIDE_ADD_MODE_POSTE,
    SHOW_ASIDE_EDIT_MODE_POSTE,
    SHOW_ASIDE_DELETE_MODE_POSTE,
    SHOW_ASIDE_CONSULT_MODE_POSTE,
    SHOW_MODAL_CONFIRMATION_POSTE,
    CLOSE_MODAL_CONFIRMATION_POSTE
} from "../../Constants/Poste/PosteAside";

export const handleOpenAddMode = (successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_ADD_MODE_POSTE,
            payload: successCallback
        });
    }
}

export const handleOpenConsultMode = (selectedPoste, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_CONSULT_MODE_POSTE,
            payload: {selectedPoste: selectedPoste, successCallback: successCallback}
        });
    }
}

export const handleOpenDeleteMode = (selectedPoste, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_DELETE_MODE_POSTE,
            payload: {selectedPoste: selectedPoste, successCallback: successCallback}
        });
    }
}

export const handleOpenEditMode = (selectedPoste, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_EDIT_MODE_POSTE,
            payload: {selectedPoste: selectedPoste, successCallback: successCallback}
        });
    }
}

export const handleClose = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_ASIDE_POSTE
        });
    }
}

export const handleReset = () => {
    return dispatch => {
        dispatch({
            type: RESET_ASIDE_POSTE
        });
    }
}

// Add the missing modal confirmation functions
export const handleOpenModalConfirmation = (message, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CONFIRMATION_POSTE,
            payload: {
                message,
                handleBtnCancelModalConfirmation,
                handleBtnConfirmerModalConfirmation
            }
        });
    }
}

export const handleCloseModalConfirmation = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CONFIRMATION_POSTE
        });
    }
}

