// import axios from 'axios';
// import Ressources from '../Helper/Ressources';
// import AuthService from './AuthService';

// class SessionKeepAlive {
//     constructor() {
//         this.interval = null;
//         this.pingInterval = 10 * 60 * 1000; // 10 minutes
//         this.retryCount = 0;
//         this.maxRetries = 5;
//         this.retryDelay = 60 * 1000; // 60 seconds between retries
//         this.serverErrorCount = 0;
//         this.maxServerErrors = 20; // Increased to be more tolerant
//         this.initialDelay = 15000; // Increased to 15 seconds
//         this.isTemporarySession = false;
//         this.dashboardLoaded = false;
        
//         // Make the service globally accessible for debugging and control
//         window.sessionKeepAliveService = this;
//     }
    
//     start() {
//         if (this.interval) {
//             this.stop();
//         }
        
//         // Réinitialiser le compteur de tentatives
//         this.retryCount = 0;
//         this.serverErrorCount = 0;
        
//         // Vérifier si nous utilisons un ID de session temporaire
//         const sessionId = AuthService.getSessionId();
//         this.isTemporarySession = sessionId && sessionId.startsWith('temp-');
        
//         // Si nous avons un ID de session temporaire, augmenter le délai initial
//         const delayToUse = this.isTemporarySession ? this.initialDelay * 2 : this.initialDelay;
        
//         console.log(`Démarrage du service de maintien de session avec un délai initial de ${delayToUse}ms`);
//         console.log(`Type de session: ${this.isTemporarySession ? 'temporaire' : 'standard'}`);
        
//         // Ping différé pour vérifier la session
//         setTimeout(() => {
//             this.ping();
//         }, delayToUse);
        
//         // Configurer l'intervalle de ping
//         this.interval = setInterval(() => {
//             this.ping();
//         }, this.pingInterval);
        
//         console.log('Service de maintien de session démarré');
//     }
    
//     stop() {
//         if (this.interval) {
//             clearInterval(this.interval);
//             this.interval = null;
//             console.log('Service de maintien de session arrêté');
//         }
//     }
    
//     ping() {
//         // Récupérer l'ID de session actuel
//         const sessionId = AuthService.getSessionId();
//         const sessionActive = localStorage.getItem('session_active') === 'true';
//         const username = localStorage.getItem('username');

//         // Vérifier si nous avons un ID de session ou une session active
//         if (!sessionId && !sessionActive) {
//             console.log('Aucun ID de session ni session active trouvés, arrêt du service de maintien');
//             this.stop();
//             return;
//         }

//         // Si nous sommes sur la page de login, ne pas faire de ping
//         if (window.location.pathname === '/' || window.location.pathname === '/login') {
//             console.log('Sur la page de login, ping ignoré');
//             return;
//         }

//         // Si nous venons juste d'arriver sur le dashboard, marquer comme chargé
//         if (window.location.pathname.includes('/dashboard') && !this.dashboardLoaded) {
//             console.log('Dashboard chargé, marquage de la session comme stable');
//             this.dashboardLoaded = true;
//             localStorage.setItem('dashboard_loaded', 'true');
//         }

//         console.log(`Tentative de ping de session pour ${username || 'utilisateur inconnu'} avec ID:`, 
//             sessionId ? (sessionId.length > 10 ? sessionId.substring(0, 10) + '...' : sessionId) : 'non disponible');

//         // Effectuer la requête de ping avec l'en-tête X-Auth-Token
//         axios.get(`${Ressources.CoreUrlB}/template-core/api/users/is-authenticated`, {
//             withCredentials: true,
//             headers: {
//                 'X-Auth-Token': sessionId,
//                 'silent': true // Pour éviter les notifications d'erreur globales
//             },
//             timeout: 15000 // 15 seconds timeout
//         })
//         .then(response => {
//             // Réinitialiser les compteurs de tentatives en cas de succès
//             this.retryCount = 0;
//             this.serverErrorCount = 0;
//             console.log('Session maintenue avec succès');
            
//             // S'assurer que le marqueur de session active est présent
//             localStorage.setItem('session_active', 'true');
            
//             // Si nous avions une session temporaire et que le ping a réussi, nous pouvons considérer
//             // que la session est maintenant valide
//             if (this.isTemporarySession) {
//                 console.log('Session temporaire validée par le serveur');
//                 this.isTemporarySession = false;
//             }
//         })
//         .catch(error => {
//             console.warn('Erreur lors du ping de session:', error);
//             this.handleError(error, sessionId, sessionActive);
//         });
//     }
    
//     handleError(error, sessionId, sessionActive) {
//         // Si le dashboard vient d'être chargé (moins de 30 secondes), être plus tolérant aux erreurs
//         const dashboardJustLoaded = this.dashboardLoaded && localStorage.getItem('dashboard_loaded') === 'true';
//         const isDashboardPage = window.location.pathname.includes('/dashboard');
        
//         // Gérer les erreurs d'authentification (401, 403)
//         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//             // Si nous avons une session temporaire ou si le dashboard vient d'être chargé, soyons plus tolérants
//             if ((this.isTemporarySession || dashboardJustLoaded) && this.retryCount < this.maxRetries) {
//                 console.log(`Session temporaire/dashboard récent: erreur d'authentification, tentative ${this.retryCount + 1}/${this.maxRetries}`);
//                 this.retryCount++;
                
//                 // Planifier une nouvelle tentative après un délai
//                 setTimeout(() => {
//                     console.log('Nouvelle tentative de ping pour session temporaire/dashboard récent');
//                     this.ping();
//                 }, this.retryDelay);
//                 return;
//             }
            
//             // Si nous sommes sur le dashboard, essayer de rafraîchir la page avant de déconnecter
//             if (isDashboardPage && this.retryCount < 2) {
//                 console.log('Tentative de rafraîchissement du dashboard avant déconnexion');
//                 this.retryCount++;
                
//                 // Rafraîchir la page après un court délai
//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 2000);
//                 return;
//             }
            
//             console.log('Session expirée ou invalide, déconnexion');
//             AuthService.logout();
//             this.stop();
            
//             // Rediriger vers la page de connexion si nécessaire
//             if (window.location.pathname !== '/') {
//                 window.location.href = '/';
//             }
//             return;
//         }
        
//         // Gérer les erreurs serveur (500)
//         if (error.response && error.response.status === 500) {
//             console.error('Erreur serveur lors du ping de session');
            
//             // Incrémenter le compteur d'erreurs serveur
//             this.serverErrorCount++;
            
//             // Si nous sommes sur le dashboard, être beaucoup plus tolérant aux erreurs serveur
//             const maxErrorsToAllow = isDashboardPage ? this.maxServerErrors * 2 : this.maxServerErrors;
            
//             // Si nous avons dépassé le nombre maximum d'erreurs serveur, déconnecter l'utilisateur
//             if (this.serverErrorCount >= maxErrorsToAllow) {
//                 console.log(`Nombre maximum d'erreurs serveur atteint (${this.serverErrorCount}/${maxErrorsToAllow}), déconnexion`);
                
//                 // Si nous sommes sur le dashboard, essayer de rafraîchir la page avant de déconnecter
//                 if (isDashboardPage) {
//                     console.log('Tentative de rafraîchissement du dashboard avant déconnexion');
//                     window.location.reload();
//                     return;
//                 }
                
//                 AuthService.logout();
//                 this.stop();
                
//                 // Rediriger vers la page de connexion si nécessaire
//                 if (window.location.pathname !== '/') {
//                     window.location.href = '/';
//                 }
//             } else {
//                 console.log(`Erreur serveur ${this.serverErrorCount}/${maxErrorsToAllow}, maintien de la session`);
                
//                 // Augmenter progressivement le délai entre les tentatives
//                 const adaptiveDelay = this.retryDelay * (1 + (this.serverErrorCount * 0.2));
                
//                 // Planifier une nouvelle tentative après un délai
//                 setTimeout(() => {
//                     console.log('Nouvelle tentative de ping après erreur serveur');
//                     this.ping();
//                 }, adaptiveDelay);
//             }
//             return;
//         }
        
//         // Gérer les erreurs de réseau ou de timeout
//         if (error.code === 'ECONNABORTED' || !error.response) {
//             console.error('Erreur réseau ou timeout lors du ping:', error.message);
            
//             // Incrémenter le compteur de tentatives
//             this.retryCount++;
            
//             // Si nous sommes sur le dashboard, être plus tolérant
//             const maxRetriesToAllow = isDashboardPage ? this.maxRetries * 2 : this.maxRetries;
            
//             // Si nous avons dépassé le nombre maximum de tentatives, déconnecter l'utilisateur
//             if (this.retryCount >= maxRetriesToAllow) {
//                 console.log(`Nombre maximum de tentatives atteint (${this.retryCount}/${maxRetriesToAllow}), déconnexion`);
                
//                 // Si nous sommes sur le dashboard, essayer de rafraîchir la page avant de déconnecter
//                 if (isDashboardPage) {
//                     console.log('Tentative de rafraîchissement du dashboard avant déconnexion');
//                     window.location.reload();
//                     return;
//                 }
                
//                 AuthService.logout();
//                 this.stop();
                
//                 // Rediriger vers la page de connexion si nécessaire
//                 if (window.location.pathname !== '/') {
//                     window.location.href = '/';
//                 }
//             } else {
//                 console.log(`Tentative ${this.retryCount}/${maxRetriesToAllow}, maintien de la session`);
                
//                 // Planifier une nouvelle tentative après un délai
//                 setTimeout(() => {
//                     console.log('Nouvelle tentative de ping après erreur réseau');
//                     this.ping();
//                 }, this.retryDelay);
//             }
//             return;
//         }
        
//         // Gérer les autres erreurs
//         console.error('Erreur non liée à l\'authentification lors du ping:', error.message);
        
//         // Si nous avons une session active, continuer à maintenir la session
//         if (sessionActive || dashboardJustLoaded) {
//             console.log('Session active trouvée, maintien de la session malgré l\'erreur');
//         } else {
//             // Sinon, incrémenter le compteur de tentatives
//             this.retryCount++;
            
//             // Si nous sommes sur le dashboard, être plus tolérant
//             const maxRetriesToAllow = isDashboardPage ? this.maxRetries * 2 : this.maxRetries;
            
//             // Si nous avons dépassé le nombre maximum de tentatives, déconnecter l'utilisateur
//             if (this.retryCount >= maxRetriesToAllow) {
//                 console.log(`Nombre maximum de tentatives atteint (${this.retryCount}/${maxRetriesToAllow}), déconnexion`);
                
//                 // Si nous sommes sur le dashboard, essayer de rafraîchir la page avant de déconnecter
//                 if (isDashboardPage) {
//                     console.log('Tentative de rafraîchissement du dashboard avant déconnexion');
//                     window.location.reload();
//                     return;
//                 }
                
//                 AuthService.logout();
//                 this.stop();
                
//                 // Rediriger vers la page de connexion si nécessaire
//                 if (window.location.pathname !== '/') {
//                     window.location.href = '/';
//                 }
//             } else {
//                 // Planifier une nouvelle tentative après un délai
//                 setTimeout(() => {
//                     console.log('Nouvelle tentative de ping après erreur générique');
//                     this.ping();
//                 }, this.retryDelay);
//             }
//         }
//     }
// }

// export default new SessionKeepAlive();