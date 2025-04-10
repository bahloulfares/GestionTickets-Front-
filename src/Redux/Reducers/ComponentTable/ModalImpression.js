import {
    SHOW_MODAL_IMPRESSION,
    CLOSE_MODAL_IMPRESSION
} from "../../Constants/ComponentTable/ModalImpression";
const initialState = {
    isOpen: false,
}

const ModalReducerImpression = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_MODAL_IMPRESSION:
            return {
                ...state,
                isOpen: true,
            };
        case CLOSE_MODAL_IMPRESSION:
            return {
                ...state,
                isOpen: false,
            };
            default:
            return state;
    }
};
export default ModalReducerImpression