import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addTab, changeTab } from '../../Redux/Actions/MenuTabs/MenuTabs'
import { getAllMenus } from '../../Redux/Actions/Menu/Menu'
import './MenuAr.css'
import PostePage from '../Poste/PostePage'
import UtilisateurPage from '../Utilisateur/UtilisateurPage'
import LoginForm from '../LoginForm/LoginForm'
import ModulePage from '../Module/ModulePage'
// Ajouter l'import pour ClientPage
import ClientPage from '../Client/ClientPage';
// Remove these imports that don't exist
// import DemandePage from '../Demande/DemandePage';
// import EquipePage from '../Equipe/EquipePage';
import { Role } from '../../Helper/Enums/Role';
import EquipePage from '../Equipe/EquipePage'

const Menu_Hooks = () => {
  const dispatch = useDispatch()
  const menus = useSelector(state => state.MenuReducer.menus)
  const module = useSelector(state => state.intl.messages.module)
  const codeModule = useSelector(state => state.MenuReducer.codeModule)
  const menusTabs = useSelector(state => state.MenuTabsReducer.tabs)
  const userAuthentification = useSelector(state => state.LoginReducer.userAuthentification)
  
  // État pour stocker le rôle de l'utilisateur
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur depuis le store Redux ou localStorage
    const getUserRole = () => {
      // Priorité au store Redux si disponible
      if (userAuthentification && userAuthentification.role) {
        setUserRole(userAuthentification.role)
        return
      }
      
      // Sinon, essayer de récupérer depuis localStorage
      try {
        const userData = localStorage.getItem('userData')
        if (userData) {
          const parsedUserData = JSON.parse(userData)
          if (parsedUserData && parsedUserData.role) {
            setUserRole(parsedUserData.role)
          } else {
            // Valeur par défaut si aucun rôle n'est trouvé
            setUserRole(Role.ROLE_AUTRE)
          }
        } else {
          // Valeur par défaut si aucune donnée utilisateur n'est trouvée
          setUserRole(Role.ROLE_AUTRE)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du rôle utilisateur:", error)
        setUserRole(Role.ROLE_AUTRE)
      }
    }
    
    getUserRole()
  }, [userAuthentification])

  useEffect(() => {
    dispatch(getAllMenus(codeModule))
  }, [codeModule, dispatch])

  function goToPage(e, submenu) {
    e.stopPropagation()
    let title = submenu.desMenuP
    if (submenu.descSecParent)
      title = `${submenu.descSecParent}/${submenu.desMenuP}`
    if (menusTabs && menusTabs.filter(menu => menu.key === submenu.codMnP).length === 0) {
      switch (submenu.mnName) {

        case 'AllModules':
          dispatch(addTab({
            key: `${submenu.codMnP}`,
            title: title,
            icon: <i className={submenu.logo} />,
            component: <ModulePage />,
          }))
          break;
        case 'AllUtilisateurs':
          dispatch(addTab({
            key: `${submenu.codMnP}`,
            title: title,
            icon: <i className={submenu.logo} />,
            component: <UtilisateurPage />,
          }))
          break;
        case 'AllPostes':
          dispatch(addTab({
            key: `${submenu.codMnP}`,
            title: title,
            icon: <i className={submenu.logo} />,
            component: <PostePage />,
          }))
          break;
        case 'AllClients':
          dispatch(addTab({
            key: `${submenu.codMnP}`,
            title: title,
            icon: <i className={submenu.logo} />,
            component: <ClientPage />,
          }))
          break;
        case 'AllDemandes':
          // Temporary placeholder for DemandePage
          dispatch(addTab({
            key: `${submenu.codMnP}`,
            title: title,
            icon: <i className={submenu.logo} />,
            component: <div>Demandes Page (Component not yet implemented)</div>,
          }))
          break;
        case 'AllEquipes':
          // Temporary placeholder for EquipePage
          dispatch(addTab({
            key: `${submenu.codMnP}`,
            title: title,
            icon: <i className={submenu.logo} />,
            component: <EquipePage/>
          }))
          break;
      }
    } else
      dispatch(changeTab(submenu.codMnP))
  }

  // Filtrer les menus en fonction du rôle de l'utilisateur
  const filteredMenus = menus.filter(menu => {
    // Si l'utilisateur est admin, afficher tous les menus
    if (userRole === Role.ROLE_ADMIN) {
      return true;
    }
    
    // Pour les autres utilisateurs, n'afficher que les menus de demandes
    // Vérifier si le menu est lié aux demandes (par exemple, codMnP commence par "04")
    return menu.codMnP.startsWith('04') || 
           menu.desMenuP.toLowerCase().includes('demande') ||
           (menu.mnName && menu.mnName.toLowerCase().includes('demande'));
  });

  return (
    <section id="listModules">
      <div className="module">
        <i className="fas fa-cog fa-2x" />
        <p>{module}</p>
      </div>
      <div id="listModules" className="modulesContainer">
        <ul>
          {filteredMenus.map((menu) => (
            <li key={menu.codMnP} className="tile purple w2 h1 subMenu">
              <a className="link" breadcrumb={menu.desMenuP}
                onClick={(event) => goToPage(event, menu)}>
                <i className={`${menu.logo} icon`} />
                <p className="title">{menu.desMenuP}</p>

                {menu.boutonSubMenu.length > 0 && (
                  <i className="fas fa-ellipsis-v ellipsis" aria-hidden="true" />
                )}

                {menu.boutonSubMenu.length > 0 && (
                  <ul className="sous-menus">
                    {menu.boutonSubMenu
                      // Filtrer également les sous-menus pour les non-admins
                      .filter(submenu => 
                        userRole === Role.ROLE_ADMIN || 
                        submenu.codMnP.startsWith('04') || 
                        submenu.desMenuP.toLowerCase().includes('demande') ||
                        (submenu.mnName && submenu.mnName.toLowerCase().includes('demande'))
                      )
                      .map((submenu) => (
                        <li key={submenu.codMnP} adresse={submenu.mnName} className="link"
                          onClick={(event) => goToPage(event, submenu)}
                          breadcrumb={`${menu.desMenuP}/${submenu.desMenuP}`}>
                          <i className={submenu.logo} />
                          <p>{submenu.desMenuP}</p>
                        </li>
                      ))
                    }
                  </ul>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Menu_Hooks
