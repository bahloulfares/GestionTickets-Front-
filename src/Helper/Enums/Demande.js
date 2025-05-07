export const ETATS_DEMANDE = {
    DEMANDE_CREEE: 'DEMANDE_CREEE',
    DEMANDE_EN_COURS_DE_VALIDATION: 'DEMANDE_EN_COURS_DE_VALIDATION',
    DEMANDE_VALIDEE: 'DEMANDE_VALIDEE',
    DEMANDE_REJETEE: 'DEMANDE_REJETEE',
    ASSIGNEE: 'ASSIGNEE',
    EN_COURS_DE_TRAITEMENT: 'EN_COURS_DE_TRAITEMENT',
    EN_ATTENTE_INFORMATIONS: 'EN_ATTENTE_INFORMATIONS',
    TERMINEE: 'TERMINEE',
    CLOTUREE: 'CLOTUREE'
};

export const PRIORITES_DEMANDE = {
    BASSE: 'BASSE',
    NORMALE: 'NORMALE',
    HAUTE: 'HAUTE',
    URGENTE: 'URGENTE'
};

// Fonction pour obtenir le libellé d'un état
export const getEtatLabel = (etat) => {
    switch (etat) {
        case ETATS_DEMANDE.DEMANDE_CREEE:
            return 'Demande créée';
        case ETATS_DEMANDE.DEMANDE_EN_COURS_DE_VALIDATION:
            return 'En cours de validation';
        case ETATS_DEMANDE.DEMANDE_VALIDEE:
            return 'Validée';
        case ETATS_DEMANDE.DEMANDE_REJETEE:
            return 'Rejetée';
        case ETATS_DEMANDE.ASSIGNEE:
            return 'Assignée';
        case ETATS_DEMANDE.EN_COURS_DE_TRAITEMENT:
            return 'En cours de traitement';
        case ETATS_DEMANDE.EN_ATTENTE_INFORMATIONS:
            return 'En attente d\'informations';
        case ETATS_DEMANDE.TERMINEE:
            return 'Terminée';
        case ETATS_DEMANDE.CLOTUREE:
            return 'Clôturée';
        default:
            return etat;
    }
};

// Fonction pour obtenir le libellé d'une priorité
export const getPrioriteLabel = (priorite) => {
    switch (priorite) {
        case PRIORITES_DEMANDE.BASSE:
            return 'Basse';
        case PRIORITES_DEMANDE.NORMALE:
            return 'Normale';
        case PRIORITES_DEMANDE.HAUTE:
            return 'Haute';
        case PRIORITES_DEMANDE.URGENTE:
            return 'Urgente';
        default:
            return priorite;
    }
};

// Options pour les listes déroulantes
export const EtatOptions = Object.keys(ETATS_DEMANDE).map(key => ({
    value: ETATS_DEMANDE[key],
    text: getEtatLabel(ETATS_DEMANDE[key])
}));

export const PrioriteOptions = Object.keys(PRIORITES_DEMANDE).map(key => ({
    value: PRIORITES_DEMANDE[key],
    text: getPrioriteLabel(PRIORITES_DEMANDE[key])
}));