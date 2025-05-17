import * as types from '../../Constants/Statistique/StatistiqueConstants';

const initialState = {
    loading: false,
    error: null,
    statistiquesGlobales: null,
    statistiquesEtat: [],
    statistiquesClient: [],
    statistiquesModule: [],
    statistiquesEquipe: [],
    statistiquesCollaborateur: [],
    statistiquesPeriode: [],
    statistiquesPerformance: [],
    selectedStatistique: null
};

const StatistiqueReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_STATISTIQUES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
            
        case types.FETCH_STATISTIQUES_SUCCESS: {
            const { type, data } = action.payload;
            
            // S'assurer que les données sont toujours un tableau valide
            const safeData = Array.isArray(data) ? data : (data ? [data] : []);
            
            // Mettre à jour le state en fonction du type de statistiques
            switch (type) {
                case 'globales':
                    return {
                        ...state,
                        loading: false,
                        statistiquesGlobales: data || null
                    };
                case 'etat':
                    return {
                        ...state,
                        loading: false,
                        statistiquesEtat: safeData
                    };
                case 'client':
                    return {
                        ...state,
                        loading: false,
                        statistiquesClient: safeData
                    };
                case 'module':
                    return {
                        ...state,
                        loading: false,
                        statistiquesModule: safeData
                    };
                case 'equipe':
                    return {
                        ...state,
                        loading: false,
                        statistiquesEquipe: safeData
                    };
                case 'collaborateur':
                    return {
                        ...state,
                        loading: false,
                        statistiquesCollaborateur: safeData
                    };
                case 'performance':
                    return {
                        ...state,
                        loading: false,
                        statistiquesPerformance: safeData
                    };
                default:
                    // Pour les statistiques par période
                    if (type.startsWith('periode/')) {
                        return {
                            ...state,
                            loading: false,
                            statistiquesPeriode: safeData
                        };
                    }
                    return state;
            }
        }
            
        case types.FETCH_STATISTIQUES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
            
        default:
            return state;
    }
};

export default StatistiqueReducer;