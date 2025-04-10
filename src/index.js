import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
// import {addLocaleData} from "react-intl";
import {IntlProvider} from 'react-intl-redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import logger from './Helper/Logger';
import Cookies from 'universal-cookie';
import store from './Redux/Store/Store';

// import en from '@formatjs/intl-relativetimeformat/dist/locale-data/en';
// import fr from '@formatjs/intl-relativetimeformat/dist/locale-data/fr';
// import ar from '@formatjs/intl-relativetimeformat/dist/locale-data/ar';
import arTranslation from "./i18n/translation_ar";
import frTranslation from "./i18n/translation_fr";
import enTranslation from "./i18n/translation_en";

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
import axios from "axios";
import notify from "devextreme/ui/notify";
import {notifyOptions} from './Helper/Config';

import {Router } from './Router';

const styles = [
    "border: 1px solid #3E0E02",
    "color: white",
    "padding: 20px",
    "background: -webkit-linear-gradient(#61045f, #aa076b)",
    "font-size: 1.5rem",
    "text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)",
    "box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset",
    "line-height: 40px",
    "text-align: center",
    "font-weight: bold",
    "animation: anim 5s infinite;"
].join(";");
console.log("%c " + "CliniSys", styles);

const cookies = new Cookies();
let locale = cookies.get('NG_TRANSLATE_LANG_KEY') || 'fr';
// addLocaleData([...en, ...fr, ...ar]);

let translation;
switch (locale) {
    case 'fr': {
        translation = frTranslation;
    }
        break;
    case 'en': {
        translation = enTranslation;
    }
        break;
    case 'ar': {
        translation = arTranslation;
    }
        break;
    default:
        break;
}

axios.defaults.withCredentials = true;
//axios.defaults.timeout = 10000;
axios.defaults.responseType = "json";
axios.defaults.headers.common['Accept-Language'] = locale;
axios.defaults.headers.common['Authorization'] = localStorage.getItem("x-auth-token");
axios.defaults.headers.common['x-auth-token'] = localStorage.getItem("x-auth-token");

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers.delete['Content-Type'] = 'application/json;charset=UTF-8';

axios.interceptors.request.use(function (config) {
    logger.info('Axios request %j', {
        method: config.method,
        url: config.url
    });

    return config;
});
axios.interceptors.response.use(function (response) {
    logger.info('Axios response %j', {
        method: response.config.method,
        url: response.config.url,
        status: response.status
    });

    return response;
}, function (error) {
    logger.error(`${error.message} %j`, {
        url: error.config.url,
        method: error.config.method,
        status: error.response ? error.response.status : 0
    });

    if(!error.config.headers.silent) {
        if(error.response && error.response.status === 409)
            notifyOptions.message = error.response.data.description;
        else
            notifyOptions.message = translation.Fail;
            

        notify(notifyOptions, 'error', notifyOptions.displayTime);
    }

    return Promise.reject(error);
});

logger.info('Application started on browser %j', {
    a: "aaa",
    b: "bbb"
});

ReactDOM.render(
    <Provider store={store}>
        <IntlProvider
            key={locale}
            locale={locale}
            messages={translation}
            defaultLocale="fr"
        >
            <BrowserRouter basename='/Budget'>
                <Switch>
                 {console.log('store::', store)  } 
                  <Router/>
                </Switch>
            </BrowserRouter>
        </IntlProvider>
    </Provider>, document.getElementById("root"));
