import React, { Component } from 'react';
import ModuleGrid from './ModuleGrid';
import ModuleAside from './ModuleAside';
import Impression from "../ComponentTable/Impression";
import ModalConfirmation from '../ComponentHelper/ModalConfirmation';

/**
 * ModulePage
 */
export class ModulePage extends Component {
    render() {
        return (
            <div>
                <ModuleGrid />
                <ModuleAside />
                <ModalConfirmation reducer="ModuleAsideReducer" />
                <Impression />
            </div>
        );
    }
}

export default ModulePage;