
import { 
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGIN_FAILURE,
    LOGOUT,
    AUTH_CHECK,
    AUTH_CHECK_SUCCESS,
    AUTH_CHECK_FAILURE
} from "../../Constants/Login/Login";
const initialState = {
    userAuthentification: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    userRole: null
  };
  
  const LoginReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_REQUEST:
      case AUTH_CHECK:
        return { ...state, loading: true, error: null };
  
      case LOGIN_SUCCESS:
      case AUTH_CHECK_SUCCESS:
        return {
          ...state,
          loading: false,
          isAuthenticated: true,
          userAuthentification: action.payload,
          userRole: action.payload.role,
          error: null
        };
  
      case LOGIN_FAILURE:
      case AUTH_CHECK_FAILURE:
        return {
          ...state,
          loading: false,
          isAuthenticated: false,
          userAuthentification: null,
          userRole: null,
          error: action.payload
        };
  
      case LOGOUT:
        return initialState;
  
      default:
        return state;
    }
  };
  
  export default LoginReducer;
  