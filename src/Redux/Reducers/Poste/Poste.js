import {
    GET_ALL_POSTE,
    GET_POSTE_BY_CODE,
    ADD_NEW_POSTE,
    DELETE_POSTE,
    EDIT_POSTE,
} from '../../Constants/Poste/Poste';

const initialState = {
    allPoste: [],
    selectedPoste: null,
    btnAddInstance: null,
    btnConsultInstance: null,
    btnEditInstance: null,
    btnDeleteInstance: null,
    btnEditionInstance: null,
    dateDebut: null,
    dateFin: null 
};

const PostesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_POSTE:
            return {
                ...state,
                allPoste: action.payload
            };
        case GET_POSTE_BY_CODE:
            return {
                ...state,
                selectedPoste: action.payload
            };
        case ADD_NEW_POSTE:
            return {
                ...state,
                allPoste: [...state.allPoste, action.payload]
            };
        case EDIT_POSTE:
            return {
                ...state,
                allPoste: state.allPoste.map((poste) =>
                    poste.idPoste === action.payload.idPoste ? action.payload : poste
                )
            };
        case DELETE_POSTE:
            return {
                ...state,
                allPoste: state.allPoste.filter((poste) => poste.idPoste !== action.payload)
            };
        default:
            return state;
    }
};

export default PostesReducer;
