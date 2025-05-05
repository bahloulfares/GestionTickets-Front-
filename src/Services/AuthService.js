import axios from 'axios';
import Ressources from '../Helper/Ressources';
import store from '../Redux/Store/Store';
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../Redux/Constants/Login/Login';
import notify from 'devextreme/ui/notify';// Centralisation des clés de stockage
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    USER_DATA: 'userData',
    IS_AUTHENTICATED: 'isAuthenticated'
};

const AuthService = {
    // Connexion de l'utilisateur
    login: async (username, password) => {
        try {
            console.log('Tentative de connexion avec:', { username, password: '***' });

            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);

            const response = await axios.post(
                `${Ressources.CoreUrlB}/template-core/login`,
                params.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    withCredentials: true
                }
            );

            console.log('Réponse de login:', response);
            
            // Récupérer le token d'authentification
            const authToken = response.data;
            
            if (!authToken) {
                throw new Error('Aucun token d\'authentification reçu');
            }
            
            // Stocker le token dans localStorage
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
            localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
            
            // Récupérer les informations de l'utilisateur
            const userInfo = await AuthService.getUserInfo(authToken);
            
            return userInfo;
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    },
    
    // Récupérer les informations de l'utilisateur
    getUserInfo: async (token) => {
        try {
            const response = await axios.get(
                `${Ressources.CoreUrlB}/template-core/api/users/is-authenticated`,
                {
                    headers: {
                        'X-Auth-Token': token
                    },
                    withCredentials: true
                }
            );
            
            const userData = response.data;
            console.log('Informations utilisateur récupérées:', userData);
            
            // Stocker les données utilisateur
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
            
            return userData;
        } catch (error) {
            console.error('Erreur lors de la récupération des informations utilisateur:', error);
            throw error;
        }
    },
    
    // Vérifier l'authentification
    checkAuthentication: async () => {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
            
            if (!token) {
                throw new Error('Aucun token d\'authentification trouvé');
            }
            
            // Récupérer les informations utilisateur avec le token stocké
            const userData = await AuthService.getUserInfo(token);
            
            // Afficher une notification de connexion réussie
            // notify({
            //     message: `Connecté en tant que ${userData.username}`,
            //     type: 'success',
            //     displayTime: 3000,
            //     position: { at: 'top right', my: 'top right' }
            // });
            
            return userData;
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'authentification:', error);
            AuthService.logout();
            throw error;
        }
    },
    
    // Déconnexion
    logout: () => {
        // Supprimer les données de session
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
        
        // Dispatch l'action de déconnexion
        store.dispatch({ type: LOGOUT });
        
        // Rediriger vers la page de connexion
        window.location.href = '/';
    },
    
    // Configurer l'intercepteur pour les requêtes authentifiées
    setupAuthInterceptor: () => {
        // Intercepteur pour ajouter le token à toutes les requêtes
        axios.interceptors.request.use(
            config => {
                const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
                if (token) {
                    config.headers['X-Auth-Token'] = token;
                }
                return config;
            },
            error => Promise.reject(error)
        );
        
        // Intercepteur pour gérer les erreurs d'authentification
        axios.interceptors.response.use(
            response => response,
            error => {
                // Ne pas traiter les erreurs si nous sommes sur le dashboard
                const isDashboardPage = window.location.pathname.includes('/dashboard');
                
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    console.warn('Erreur d\'authentification détectée:', error.response.status);
                    
                    // Si nous sommes sur le dashboard, ignorer l'erreur
                    if (isDashboardPage) {
                        console.log('Erreur d\'authentification sur le dashboard ignorée');
                        return Promise.reject(error);
                    }
                    
                    // Sinon, déconnecter l'utilisateur
                    AuthService.logout();
                }
                
                // Ignorer les erreurs 500 sur le dashboard
                if (error.response && error.response.status === 500 && isDashboardPage) {
                    console.log('Erreur 500 sur le dashboard ignorée');
                    return Promise.reject(error);
                }
                
                return Promise.reject(error);
            }
        );
    }
};

export default AuthService;
