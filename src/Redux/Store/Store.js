import configureStore from './configureStore';
import Cookies from "universal-cookie";
import frTranslation from "../../i18n/translation_fr";
import enTranslation from "../../i18n/translation_en";
import arTranslation from "../../i18n/translation_ar";

const cookies = new Cookies();
let locale =  'fr';

let direction;
let translation;
switch (locale) {
    case 'fr': {
        translation = frTranslation;
        direction = "LTR";
    }
        break;
    case 'en': {
        translation = enTranslation;
        direction = "LTR";
    }
        break;
    case 'ar': {
        translation = arTranslation;
        direction = "RTL";
    }
        break;
    default:
        break;
}

const initialState = {
    intl: {
        language: locale,
        cookies: cookies,
        messages: translation,
        direction: direction,
        username: localStorage.getItem("username")
    }
};

const store = configureStore(initialState);

if(process.env.NODE_ENV !== 'production') {
    window.store = store;
}

export default store;