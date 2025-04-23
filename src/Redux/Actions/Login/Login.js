import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS, 
  LOGIN_FAILURE,
  AUTH_CHECK, 
  AUTH_CHECK_SUCCESS, 
  AUTH_CHECK_FAILURE,
  LOGOUT
} from '../../Constants/Login/Login';
import AuthService from '../../../Services/AuthService';

export const signIn = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    
    // Appel à la méthode de connexion du service
    const user = await AuthService.login(username, password);
    
    // Dispatch de l'action de succès avec les données utilisateur
    dispatch({ type: LOGIN_SUCCESS, payload: user });
    
    return user;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    
    // Dispatch de l'action d'échec avec le message d'erreur
    dispatch({ 
      type: LOGIN_FAILURE, 
      payload: error.message || 'Erreur lors de la connexion' 
    });
    
    throw error;
  }
};

export const checkAuthentication = () => async (dispatch) => {
  try {
    dispatch({ type: AUTH_CHECK });
    
    // Vérification de l'authentification
    const user = await AuthService.checkAuthentication();
    
    // Dispatch de l'action de succès avec les données utilisateur
    dispatch({ type: AUTH_CHECK_SUCCESS, payload: user });
    
    return user;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    
    // Dispatch de l'action d'échec avec le message d'erreur
    dispatch({ type: AUTH_CHECK_FAILURE, payload: error.message });
    
    throw error;
  }
};

// Add this export for the logout function
// Modified logout function to handle both direct calls and dispatch
export const logOut = () => {
  // Function to perform the actual logout operations
  const performLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('rememberedUser');
    
    // Redirect to login page
    window.location.href = '/';
    
    // Return the action for Redux
    return { type: LOGOUT };
  };
  
  // Check if this is being called with dispatch or directly
  return (dispatch) => {
    if (typeof dispatch === 'function') {
      // Normal Redux thunk flow
      dispatch(performLogout());
    } else {
      // Direct call without dispatch
      performLogout();
    }
  };
};