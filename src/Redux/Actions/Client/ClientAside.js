import {
    CLOSE_ASIDE_CLIENT,
    RESET_ASIDE_CLIENT,
    SHOW_ASIDE_ADD_MODE_CLIENT,
    SHOW_ASIDE_EDIT_MODE_CLIENT,
    SHOW_ASIDE_DELETE_MODE_CLIENT,
    SHOW_ASIDE_CONSULT_MODE_CLIENT,
    SHOW_MODAL_CONFIRMATION_CLIENT,
    CLOSE_MODAL_CONFIRMATION_CLIENT
} from "../../Constants/Client/ClientAside";

export const handleOpenAddMode = (successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_ADD_MODE_CLIENT,
            payload: successCallback
        });
    }
}

export const handleOpenConsultMode = (selectedClient) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_CONSULT_MODE_CLIENT,
            payload: selectedClient
        });
    }
}

export const handleOpenDeleteMode = (selectedClient, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_DELETE_MODE_CLIENT,
            payload: {selectedClient: selectedClient, successCallback: successCallback}
        });
    }
}

export const handleOpenEditMode = (selectedClient, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_EDIT_MODE_CLIENT,
            payload: {selectedClient: selectedClient, successCallback: successCallback}
        });
    }
}

export const handleClose = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_ASIDE_CLIENT
        });
    }
}

export const clearForm = () => {
    return dispatch => {
        dispatch({
            type: RESET_ASIDE_CLIENT
        });
    }
}

export const handleOpenModalConfirmation = (messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CONFIRMATION_CLIENT,
            messageToShow: messageToShow,
            actionBtnModalConfirmation: {handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation}
        });
    }
}

export const handleCloseModalConfirmation = (successCallback) => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CONFIRMATION_CLIENT,
            payload: successCallback
        });
    }
}