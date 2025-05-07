import * as types from '../../Constants/Demande/DemandeConstants';

const initialState = {
    allDemande: [],
    selectedDemande: null,
    loading: false,
    error: null,
    success: false,
    btnAddInstance: null,
    btnConsultInstance: null,
    btnEditInstance: null,
    btnDeleteInstance: null,
    btnEditionInstance: null,
    dateDebut: null,
    dateFin: null
};

const DemandesReducer = (state = initialState, action) => {
    switch (action.type) {
        // Requêtes en cours
        case types.GET_ALL_DEMANDES_REQUEST:
        case types.GET_DEMANDE_BY_CODE_REQUEST:
        case types.ADD_DEMANDE_REQUEST:
        case types.UPDATE_DEMANDE_REQUEST:
        case types.DELETE_DEMANDE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: false
            };
            
        // Succès des requêtes
        case types.GET_ALL_DEMANDES_SUCCESS:
            return {
                ...state,
                allDemande: action.payload || state.allDemande,
                loading: false,
                success: true
            };
            
        case types.GET_DEMANDE_BY_CODE_SUCCESS:
            return {
                ...state,
                selectedDemande: action.payload,
                loading: false,
                success: true
            };
            
        case types.ADD_DEMANDE_SUCCESS:
            return {
                ...state,
                allDemande: [...state.allDemande, action.payload],
                loading: false,
                success: true
            };
            
        case types.UPDATE_DEMANDE_SUCCESS:
            return {
                ...state,
                allDemande: state.allDemande.map(demande => 
                    demande.idDemande === action.payload.idDemande ? action.payload : demande
                ),
                selectedDemande: action.payload,
                loading: false,
                success: true
            };
            
        case types.DELETE_DEMANDE_SUCCESS:
            return {
                ...state,
                allDemande: state.allDemande.filter(demande => demande.idDemande !== action.payload),
                selectedDemande: null,
                loading: false,
                success: true
            };
            
        // Échecs des requêtes
        case types.GET_ALL_DEMANDES_FAILURE:
        case types.GET_DEMANDE_BY_CODE_FAILURE:
        case types.ADD_DEMANDE_FAILURE:
        case types.UPDATE_DEMANDE_FAILURE:
        case types.DELETE_DEMANDE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };
            
        // Autres actions
        case types.SET_SELECTED_DEMANDE:
            return {
                ...state,
                selectedDemande: action.payload
            };
            
        case types.RESET_DEMANDE:
            return {
                ...state,
                selectedDemande: null,
                error: null,
                success: false
            };
            
        default:
            return state;
    }
};

export default DemandesReducer;