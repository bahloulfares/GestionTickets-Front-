import React, { useEffect } from 'react'
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

const Menu_Hooks = () => {
  const dispatch = useDispatch()
  const menus = useSelector(state => state.MenuReducer.menus)
  const module = useSelector(state => state.intl.messages.module)
  const codeModule = useSelector(state => state.MenuReducer.codeModule)
  const menusTabs = useSelector(state => state.MenuTabsReducer.tabs)


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
      }
    } else
      dispatch(changeTab(submenu.codMnP))
  }


  return (
    <section id="listModules">
      <div className="module">
        <i className="fas fa-cog fa-2x" />
        <p>{module}</p>
      </div>
      <div id="listModules" className="modulesContainer">
        <ul>
          {menus.map((menu) => (
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
                    {menu.boutonSubMenu.map((submenu) => (
                      <li key={submenu.codMnP} adresse={submenu.mnName} className="link"
                        onClick={(event) => goToPage(event, submenu)}
                        breadcrumb={`${menu.desMenuP}/${submenu.desMenuP}`}>
                        <i className={submenu.logo} />
                        <p>{submenu.desMenuP}</p>
                      </li>
                    ))}
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
