import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import notify from 'devextreme/ui/notify';

import store from './Redux/Store/Store';
import AuthService from './Services/AuthService';
import logger from './Helper/Logger';
import { notifyOptions } from './Helper/Config';
import { Router } from './Router';

import arTranslation from './i18n/translation_ar';
import frTranslation from './i18n/translation_fr';
import enTranslation from './i18n/translation_en';
import 'jquery/dist/jquery.slim';
import 'popper.js/dist/popper';
import 'jszip/dist/jszip.min';
import 'bootstrap/dist/js/bootstrap.min';

import 'bootstrap/dist/css/bootstrap.css';
import './assests/css/dx.common.css';
import './assests/css/dx.generic.csys.style.css';
import './assests/css/fontawesome-all.css';
import './assests/css/styleCsysAr.css';
import './assests/css/dataGrid.css';
import './assests/css/overlayCsysFr.css';
// Configuration des intercepteurs axios
axios.interceptors.response.use(
  response => response,
  error => {
    // Ne pas afficher de notification pour les requêtes silencieuses
    if (error.config && error.config.headers && error.config.headers.silent) {
      return Promise.reject(error);
    }

    // Afficher une notification pour les autres erreurs
    if (error.response) {
      const message = error.response.data?.message || 'Une erreur est survenue';
      notify(message, 'error', notifyOptions);
      logger.error('Erreur API:', error.response.status, message);
    } else if (error.request) {
      notify('Aucune réponse du serveur', 'error', notifyOptions);
      logger.error('Aucune réponse du serveur:', error.request);
    } else {
      notify('Erreur de requête', 'error', notifyOptions);
      logger.error('Erreur de requête:', error.message);
    }

    return Promise.reject(error);
  }
);

// Initialiser l'intercepteur d'authentification
AuthService.setupAuthInterceptor();

// Déterminer la langue
const cookies = new Cookies();
const lang = cookies.get('lang') || 'fr';
let messages;

switch (lang) {
  case 'ar':
    messages = arTranslation;
    break;
  case 'en':
    messages = enTranslation;
    break;
  default:
    messages = frTranslation;
}

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale={lang} messages={messages}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
);
