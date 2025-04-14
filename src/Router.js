import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import MenuTabs from './Components/MenuTabs/MenuTabs';
import LoginForm from './Components/LoginForm/LoginForm';
import { checkAuthentication } from './Redux/Actions/Login/Login';

// Helper function to check authentication status
const useAuthStatus = () => {
  const isAuthenticated = useSelector(state => state.LoginReducer.isAuthenticated);
  const userAuthentification = useSelector(state => state.LoginReducer.userAuthentification);
  return { isAuthenticated, userAuthentification };
};

// Composant PrivateRoute pour protéger les routes qui nécessitent une authentification
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, userAuthentification } = useAuthStatus();
  
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated && userAuthentification ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

// Ajout de la validation des props
PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired
};

// Composant PublicRoute pour les routes accessibles sans authentification
const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const { isAuthenticated, userAuthentification } = useAuthStatus();
  
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated && userAuthentification && restricted ? (
          <Redirect to="/dashboard" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

// Ajout de la validation des props
PublicRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  restricted: PropTypes.bool
};

export const Router = () => {
  const dispatch = useDispatch();
  
  // Vérifier l'authentification au chargement du composant
  useEffect(() => {
    dispatch(checkAuthentication());
  }, [dispatch]);
  
  return (
    <BrowserRouter>
      <Switch>
        {/* Route publique restreinte (redirige vers /dashboard si déjà connecté) */}
        <PublicRoute restricted={true} exact path="/" component={LoginForm} />
        
        {/* Routes privées (nécessitent une authentification) */}
        <PrivateRoute path="/dashboard" component={MenuTabs} />
        
        {/* Redirection par défaut */}
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;

