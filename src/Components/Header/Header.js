import React, { Component } from 'react';
import './Header.css';
import { connect } from "react-redux";
import { getDateServeur } from "../../Redux/Actions/Header/Header";
import { logOut } from '../../Redux/Actions/Login/Login';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from "universal-cookie";
import LanguageSelector from '../LanguageSelector/LanguageSelector';

// Import the storage keys
import { STORAGE_KEYS } from '../../Services/AuthService';

/**
 * Contains brand, application name, breadcrumbs, username and logout button
 *
 * @author [Nadir Louati](http://172.16.10.34:9999/nadir.louati)
 */
export class Header extends Component {

    componentDidMount() {
        this.props.getDateServeur();
    }

    launchFullscreen = () => {
        var
            el = document.documentElement
            , rfs =
                el.requestFullScreen
                || el.webkitRequestFullScreen
                || el.mozRequestFullScreen
            ;
        rfs.call(el);
    }
    
    // Ajout d'une fonction pour changer la langue
    changeLanguage = (lang) => {
        const cookies = new Cookies();
        cookies.set('lang', lang, { path: '/' });
        window.location.reload();
    }

    // Méthode pour vérifier le statut de connexion
    getConnectionStatus() {
        const isAuthenticated = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true';
        return {
            color: isAuthenticated ? '#2ecc71' : '#e74c3c', // Vert si connecté, rouge sinon
            text: isAuthenticated ? 'Connecté' : 'Déconnecté'
        };
    }

    render() {
        /* render */
        let breadcrumbs = this.props.intl.messages.home;
        return (
            <div>
                <div className={"header"}>
                    <div className="pull-left">
                        <div style={{ paddingLeft: '7px', paddingRight: '7px' }}>
                            <h1 style={{ textAlign: 'right', color: 'white', fontSize: '25px' }}>
                                <small style={{ color: 'white', fontSize: '20px' }}>CliniSys<span
                                    style={{ color: 'rgb(215, 214, 214)' }}>Erp</span>
                                </small>
                            </h1>
                        </div>
                    </div>
                    <div className="nameModule hidden-xs" style={{ width: '66vw' }}>
                        <h1 style={{ textAlign: 'right', color: 'white', marginTop: '5px', display: 'inline-block' }}>
                            <small style={{ color: 'white' }}>
                                <span id="titleModule">{this.props.intl.messages.module}</span>
                            </small>
                        </h1>
                        {/* <div className="global_breadcrumbs">{breadcrumbs}</div> */}
                    </div>
                    <div className="pull-right">
                        {/* Remplacer le sélecteur de langue par notre composant */}
                        <div className="btn-header transparent pull-right">
                            <LanguageSelector mode="header" />
                        </div>
                        <div id="logout" className="btn-header transparent pull-right">
                            <span>
                                <a data-action="logout" id="globaldeconnexion" onClick={logOut()} title={this.props.intl.messages.logout || "Déconnexion"}>
                                    <i className="fas fa-power-off" />
                                </a>
                            </span>
                        </div>
                        <div id="fullscreen" className="btn-header transparent pull-right">
                            <span>
                                <a href="#" id="launchFullscreen" data-action="launchFullscreen" title={this.props.intl.messages.fullscreen || "Plein écran"}
                                    onClick={this.launchFullscreen}>
                                    <i className="fas fa-arrows-alt" />
                                </a>
                            </span>
                        </div>
                        <div id="application" className="btn-header transparent pull-right">
                        </div>
                        <div id="acceuil" className="btn-header transparent pull-right" style={{ color: 'white' }}>
                            <span> <a data-action="acceuil" id="globalAcceuil" title={this.props.intl.messages.home}
                                href="/dashboard"><i
                                    className="fas fa-home" /></a> </span>
                        </div>
                        <div id="userAffiche" className="btn-header transparent pull-right">
                            <span name="_user" style={{ marginTop: '8px', color: 'white', display: 'inline-block' }}>
                                <div style={{ fontSize: '17px' }}>
                                    <i className="fas fa-user" />
                                    <span id="userName" style={{ marginRight: '3px' }}>{this.props.intl.username}</span>
                                    <span className="connection-indicator" style={{ 
                                        display: 'inline-block',
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: this.getConnectionStatus().color,
                                        marginLeft: '5px'
                                    }} title={this.getConnectionStatus().text}></span>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
    getDateServeur: () => dispatch(getDateServeur())
});
const ReduxHeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default () => (<ReduxHeaderContainer />)
