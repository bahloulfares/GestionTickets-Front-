import React from 'react';
import DemandeGrid from './DemandeGrid';
import DemandeAside from './DemandeAside';
import Impression from '../ComponentTable/Impression';
import ModalConfirmation from '../ComponentHelper/ModalConfirmation';

const DemandePage = () => {
    return (
        <div>
            <DemandeGrid />
            <DemandeAside />
            <ModalConfirmation reducer="DemandeAsideReducer" />
            <Impression />
        </div>
    );
};

export default DemandePage;