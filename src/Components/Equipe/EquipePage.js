import React, { Component } from 'react';
import EquipeGrid from './EquipeGrid';
import EquipeAside from './EquipeAside';
import Impression from "../ComponentTable/Impression";
import ModalConfirmation from '../ComponentHelper/ModalConfirmation';

export class EquipePage extends Component {
    render() {
        return (
            <div>
                <EquipeGrid/>
                <EquipeAside/>
                <ModalConfirmation reducer="EquipeAsideReducer"/>
                <Impression/>
            </div>
        );
    }
}

export default EquipePage;