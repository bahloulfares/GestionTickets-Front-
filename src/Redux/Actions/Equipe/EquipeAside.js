import {
    CLOSE_ASIDE_EQUIPE,
    RESET_ASIDE_EQUIPE,
    SHOW_ASIDE_ADD_MODE_EQUIPE,
    SHOW_ASIDE_EDIT_MODE_EQUIPE,
    SHOW_ASIDE_DELETE_MODE_EQUIPE,
    SHOW_ASIDE_CONSULT_MODE_EQUIPE,
    SHOW_MODAL_CONFIRMATION_EQUIPE,
    CLOSE_MODAL_CONFIRMATION_EQUIPE
} from "../../Constants/Equipe/EquipeAside";

export const handleOpenAddMode = (successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_ADD_MODE_EQUIPE,
            payload: successCallback
        });
    }
}

export const handleOpenConsultMode = (selectedEquipe) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_CONSULT_MODE_EQUIPE,
            payload: selectedEquipe
        });
    }
}

export const handleOpenDeleteMode = (selectedEquipe, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_DELETE_MODE_EQUIPE,
            payload: {selectedEquipe: selectedEquipe, successCallback: successCallback}
        });
    }
}

export const handleOpenEditMode = (selectedEquipe, successCallback) => {
    return dispatch => {
        dispatch({
            type: SHOW_ASIDE_EDIT_MODE_EQUIPE,
            payload: {selectedEquipe: selectedEquipe, successCallback: successCallback}
        });
    }
}

export const handleClose = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_ASIDE_EQUIPE
        });
    }
}

export const handleReset = () => {
    return dispatch => {
        dispatch({
            type: RESET_ASIDE_EQUIPE
        });
    }
}

export const handleOpenModalConfirmation = (messageToShow, handleBtnCancelModalConfirmation, handleBtnConfirmerModalConfirmation) => {
    return dispatch => {
        dispatch({
            type: SHOW_MODAL_CONFIRMATION_EQUIPE,
            payload: {
                messageToShow,
                handleBtnCancelModalConfirmation,
                handleBtnConfirmerModalConfirmation
            }
        });
    }
}

export const handleCloseModalConfirmation = () => {
    return dispatch => {
        dispatch({
            type: CLOSE_MODAL_CONFIRMATION_EQUIPE
        });
    }
}