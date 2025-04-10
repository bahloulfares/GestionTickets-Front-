import {
    GET_ALL_CLIENT,
    GET_CLIENT_BY_CODE,
    ADD_NEW_CLIENT,
    DELETE_CLIENT,
    EDIT_CLIENT,
} from '../../Constants/Client/Client';

const initialState = {
    allClient: [],
    selectedClient: null,
    btnAddInstance: null,
    btnConsultInstance: null,
    btnEditInstance: null,
    btnDeleteInstance: null,
    btnEditionInstance: null,
    dateDebut: null,
    dateFin: null 
};

const ClientsReducer = (state = initialState, action) => {
    switch (action.type) {
        // Assurez-vous que le reducer met à jour correctement l'état
        case GET_ALL_CLIENT:
            return {
                ...state,
                allClient: action.payload
            };
        case GET_CLIENT_BY_CODE:
            return {
                ...state,
                selectedClient: action.payload
            };
        case ADD_NEW_CLIENT:
            return {
                ...state,
                allClient: [...state.allClient, action.payload],
            };
        case EDIT_CLIENT:
            return {
                ...state,
                allClient: state.allClient.map(client => 
                    client.idClient === action.payload.idClient ? action.payload : client
                ) 
            };
        case DELETE_CLIENT:
            return {
                ...state,
                allClient: state.allClient.filter(client => client.idClient !== action.payload)
            };
        default:
            return state;
    }
}
export default ClientsReducer;