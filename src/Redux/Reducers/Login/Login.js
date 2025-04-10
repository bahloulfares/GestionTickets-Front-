
import { LOGIN, LOGOUT } from "../../Constants/Login/Login";

const initialState = {
    userAuthentification: null
};

const LoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                userAuthentification: action.payload
            };
            case LOGOUT:
            return {
                ...state,
                userAuthentification: action.payload
            };

        default:
            return state;
    }
}
export default LoginReducer;
