
import { 
    LOGIN, 
    LOGOUT, 
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGIN_FAILURE,
    AUTH_CHECK,
    AUTH_CHECK_SUCCESS,
    AUTH_CHECK_FAILURE
} from "../../Constants/Login/Login";

const initialState = {
    userAuthentification: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

const LoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case AUTH_CHECK:
            return {
                ...state,
                loading: true,
                error: null
            };
        case LOGIN_SUCCESS:
        case AUTH_CHECK_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                userAuthentification: action.payload,
                loading: false,
                error: null
            };
        case LOGIN_FAILURE:
        case AUTH_CHECK_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            };
        case LOGIN:
            return {
                ...state,
                isAuthenticated: true,
                userAuthentification: action.payload,
                loading: false
            };
        case LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                userAuthentification: null,
                loading: false
            };
        default:
            return state;
    }
}

export default LoginReducer;
