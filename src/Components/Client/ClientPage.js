import React, { Component } from 'react';
import ClientGrid from './ClientGrid';
import ClientAside from './ClientAside';
import Impression from "../ComponentTable/Impression";
import ModalConfirmation from '../ComponentHelper/ModalConfirmation';

/**
 * ClientPage
 */
export class ClientPage extends Component {
    render() {
        return (
            <div>
                <ClientGrid />
                <ClientAside />
                <ModalConfirmation reducer="ClientAsideReducer" />
                <Impression />
            </div>
        );
    }
}

export default ClientPage;