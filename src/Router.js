import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import MenuTabs from './Components/MenuTabs/MenuTabs';
import LoginForm from './Components/LoginForm/LoginForm';
import { checkAuthentication } from './Redux/Actions/Login/Login';

// Helper hook pour récupérer les infos d'authentification
const useAuthStatus = () => {
  const isAuthenticated = useSelector(state => state.LoginReducer.isAuthenticated);
  const userAuthentification = useSelector(state => state.LoginReducer.userAuthentification);
  return { isAuthenticated, userAuthentification };
};

// Composant PrivateRoute
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuthStatus();
  const [isChecking, setIsChecking] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Vérifier l'authentification au chargement de la route
    const checkAuth = async () => {
      try {
        // Vérifier si un token est présent dans localStorage
        const token = localStorage.getItem('authToken');
        
        if (token) {
          await dispatch(checkAuthentication());
        }
        
        setIsChecking(false);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isChecking) {
    // Afficher un indicateur de chargement pendant la vérification
    return <div className="loading-indicator">Chargement...</div>;
  }

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  location: PropTypes.object
};

// Composant principal du routeur
export const Router = () => {
  return (
    <Switch>
      <Route exact path="/" component={LoginForm} />
      <PrivateRoute path="/dashboard" component={MenuTabs} />
      <Redirect to="/" />
    </Switch>
  );
};
