import React, { Component } from 'react';
import UtilisateurGrid from './UtilisateurGrid';
import UtilisateurAside from './UtilisateurAside';
import Impression from "../ComponentTable/Impression";
import ModalConfirmation from '../ComponentHelper/ModalConfirmation';

class UtilisateurPage extends Component {
    render() {
        return (
            <div>
                <UtilisateurGrid/>
                <UtilisateurAside/>
                <ModalConfirmation reducer="UtilisateurAsideReducer"/>
                <Impression/>
            </div>
        );
    }
}

export default UtilisateurPage;