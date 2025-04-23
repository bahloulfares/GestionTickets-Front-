import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'universal-cookie';
import './LanguageSelector.css';

const LanguageSelector = ({ mode = 'header' }) => {
    const dispatch = useDispatch();
    const currentLanguage = useSelector(state => state.intl?.language) || 'fr';
    
    const changeLanguage = (lang) => {
        const cookies = new Cookies();
        cookies.set('lang', lang, { path: '/' });
        
        // Dispatch action pour changer la langue
        dispatch({
            type: 'CHANGE_LANGUAGE',
            payload: {
                language: lang
            }
        });
        
        // Recharger la page pour appliquer les changements
        window.location.reload();
    };
    
    // Styles différents selon le mode (header ou login)
    const isLoginMode = mode === 'login';
    
    return (
        <div className={`language-selector ${isLoginMode ? 'login-mode' : ''}`}>
            <button 
                className={`lang-btn ${currentLanguage === 'fr' ? 'active' : ''}`} 
                onClick={() => changeLanguage('fr')}
            >
                FR
            </button>
            <button 
                className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`} 
                onClick={() => changeLanguage('en')}
            >
                EN
            </button>
            <button 
                className={`lang-btn ${currentLanguage === 'ar' ? 'active' : ''}`} 
                onClick={() => changeLanguage('ar')}
            >
                AR
            </button>
        </div>
    );
};

export default LanguageSelector;