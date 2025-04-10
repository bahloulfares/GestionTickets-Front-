import {
    SHOW_MODAL_IMPRESSION,
    CLOSE_MODAL_IMPRESSION
} from "../../Constants/ComponentTable/ModalImpression";

export const handleOpenModal = () => {
  return dispatch => {
      dispatch({
          type: SHOW_MODAL_IMPRESSION,
      });
  }
}

export const handleCloseModal = () => {
  return dispatch => {
      dispatch({
          type: CLOSE_MODAL_IMPRESSION
      });
  }
}

