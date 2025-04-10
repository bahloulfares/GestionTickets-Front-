import {
  CLOSE_ASIDE_CLIENT,
  RESET_ASIDE_CLIENT,
  SHOW_ASIDE_ADD_MODE_CLIENT,
  SHOW_ASIDE_DELETE_MODE_CLIENT,
  SHOW_ASIDE_EDIT_MODE_CLIENT,
  SHOW_ASIDE_CONSULT_MODE_CLIENT,
  SHOW_MODAL_CONFIRMATION_CLIENT,
  CLOSE_MODAL_CONFIRMATION_CLIENT,
} from "../../Constants/Client/ClientAside";

const initialState = {
  isOpen: false,
  modeAside: "",
  selectedClient: null,
  successCallback: null,
  isOpenModalConfirmation: false,
  messageToShow: "",
  actionBtnModalConfirmation: {
    handleBtnCancelModalConfirmation: null,
    handleBtnConfirmerModalConfirmation: null,
  },
};

export default function ClientAsideReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_ASIDE_ADD_MODE_CLIENT:
      return {
        ...state,
        isOpen: true,
        modeAside: "ADD",
        selectedClient: null,
        successCallback: action.payload,
      };
    case SHOW_ASIDE_EDIT_MODE_CLIENT:
      return {
        ...state,
        isOpen: true,
        modeAside: "EDIT",
        selectedClient: action.payload.selectedClient,
        successCallback: action.payload.successCallback,
      };
    case SHOW_ASIDE_DELETE_MODE_CLIENT:
      return {
        ...state,
        isOpen: true,
        modeAside: "DELETE",
        selectedClient: action.payload.selectedClient,
        successCallback: action.payload.successCallback,
      };
    case SHOW_ASIDE_CONSULT_MODE_CLIENT:
      return {
        ...state,
        isOpen: true,
        modeAside: "CONSULT",
        selectedClient: action.payload,
      };
    case CLOSE_ASIDE_CLIENT:
      return {
        ...state,
        isOpen: false,
        modeAside: "",
        selectedClient: null,
        successCallback: null,
      };
    case RESET_ASIDE_CLIENT:
      return {
        ...state,
        selectedClient: null,
      };
    case SHOW_MODAL_CONFIRMATION_CLIENT:
      return {
        ...state,
        isOpenModalConfirmation: true,
        messageToShow: action.messageToShow,
        actionBtnModalConfirmation: action.actionBtnModalConfirmation,
      };
    case CLOSE_MODAL_CONFIRMATION_CLIENT:
      return {
        ...state,
        isOpenModalConfirmation: false,
        messageToShow: "",
        actionBtnModalConfirmation: {
          handleBtnCancelModalConfirmation: null,
          handleBtnConfirmerModalConfirmation: null,
        },
      };
    default:
      return state;
  }
}
