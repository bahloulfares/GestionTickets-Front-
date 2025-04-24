import {
    GET_ALL_EQUIPE,
    GET_EQUIPE_BY_CODE,
    ADD_NEW_EQUIPE,
    DELETE_EQUIPE,
    EDIT_EQUIPE,
} from '../../Constants/Equipe/Equipe';

const initialState = {
    allEquipe: [],
    selectedEquipe: null,
    loading: false,
    error: null
};

const EquipesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_EQUIPE:
            return {
                ...state,
                allEquipe: action.payload,
                error: null
            };
        case GET_EQUIPE_BY_CODE:
            return {
                ...state,
                selectedEquipe: action.payload,
                error: null
            };
        case ADD_NEW_EQUIPE:
            return {
                ...state,
                allEquipe: [...state.allEquipe, action.payload],
                error: null
            };
        case EDIT_EQUIPE:
            return {
                ...state,
                allEquipe: state.allEquipe.map(equipe => 
                    equipe.idEquipe === action.payload.idEquipe ? action.payload : equipe
                ),
                selectedEquipe: action.payload,
                error: null
            };
        case DELETE_EQUIPE:
            return {
                ...state,
                allEquipe: state.allEquipe.filter(equipe => equipe.idEquipe !== action.payload),
                selectedEquipe: null,
                error: null
            };
        default:
            return state;
    }
};

export default EquipesReducer;