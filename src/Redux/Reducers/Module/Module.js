import {
    GET_ALL_MODULE,
    GET_MODULE_BY_CODE,
    ADD_NEW_MODULE,
    DELETE_MODULE,
    EDIT_MODULE,
} from '../../Constants/Module/Module';

const initialState = {
    allModule: [],
    selectedModule: null,
    btnAddInstance: null,
    btnConsultInstance: null,
    btnEditInstance: null,
    btnDeleteInstance: null,
    btnEditionInstance: null,
    dateDebut: null,
    dateFin: null 
};

const ModulesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_MODULE:
            return {
                ...state,
                allModule: action.payload
            };
        case GET_MODULE_BY_CODE:
            return {
                ...state,
                selectedModule: action.payload
            };
        case ADD_NEW_MODULE:
            return {
                ...state,
                allModule: [...state.allModule, action.payload],
            };
        case EDIT_MODULE:
            console.log('EDIT_MODULE payload:', action.payload);
            return {
                ...state,
                allModule: state.allModule.map(module => 
                    module.id === action.payload.id ? action.payload : module
                )
            };
        case DELETE_MODULE:
            console.log('DELETE_MODULE payload:', action.payload);
            return {
                ...state,
                allModule: state.allModule.filter(module => module.id !== action.payload)
            }; 
        default:
            return state;
    }
}
export default ModulesReducer;