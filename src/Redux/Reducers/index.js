import { combineReducers } from 'redux';
import PostesReducer from './Poste/Poste';
import PosteAsideReducer from './Poste/PosteAside';
import UtilisateursReducer from './Utilisateur/Utilisateur';
import UtilisateurAsideReducer from './Utilisateur/UtilisateurAside';
import LoginReducer from './Login/Login';
import MenuTabsReducer from './MenuTabs/MenuTabs';
import MenuReducer from './Menu/Menu';
import HeaderReducer from './Header/Header';
import { intlReducer } from 'react-intl-redux';
import ModalReducerImpression from './ComponentTable/ModalImpression';
import ModulesReducer from './Module/Module';
import ModuleAsideReducer from './Module/ModuleAside';
// Import des nouveaux reducers Client
import ClientsReducer from './Client/Client';
import ClientAsideReducer from './Client/ClientAside';
import EquipesReducer from './Equipe/Equipe';
import EquipeAsideReducer from './Equipe/EquipeAside';
export default combineReducers({
    MenuTabsReducer, MenuReducer, HeaderReducer, intl: intlReducer
    , ModalReducerImpression
    , PostesReducer, PosteAsideReducer
    , UtilisateursReducer, UtilisateurAsideReducer
    , ModulesReducer, ModuleAsideReducer
    , ClientsReducer, ClientAsideReducer
    , LoginReducer,EquipesReducer,
    EquipeAsideReducer
});
