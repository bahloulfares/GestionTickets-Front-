import React, { useState, useRef, useCallback } from 'react';
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import { signIn } from '../../Redux/Actions/Login/Login';
import { LOGIN_FAILURE } from '../../Redux/Constants/Login/Login';
import './login-form.css';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../../assests/css/images/logo_csys.png';

// Configuration des éditeurs
const emailEditorOptions = { stylingMode: 'filled', placeholder: 'Login', mode: 'text' };
const passwordEditorOptions = { stylingMode: 'filled', placeholder: 'Password', mode: 'password' };
const rememberMeEditorOptions = { text: 'Enregistrer le mot de passe', elementAttr: { class: 'form-text' } };

export default function LoginForm() {
  const formData = useRef({
    email: '',
    password: '',
    rememberMe: false
  });

  const dispatch = useDispatch();
  const userAuthentification = useSelector(state => state.LoginReducer.userAuthentification);
  const loading = useSelector(state => state.LoginReducer.loading);
  const error = useSelector(state => state.LoginReducer.error);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { email, password, rememberMe } = formData.current;

    if (!email?.trim() || !password?.trim()) {
      dispatch({
        type: LOGIN_FAILURE,
        payload: 'Tous les champs doivent être remplis'
      });
      return;
    }

    try {
      console.log(`Tentative de connexion pour l'utilisateur: ${email}`);
      
      // Appel à l'action de connexion
      await dispatch(signIn(email, password));
      
      // Mémoriser l'utilisateur si demandé
      if (rememberMe) {
        localStorage.setItem('rememberedUser', email);
      } else {
        localStorage.removeItem('rememberedUser');
      }
      
      console.log('Connexion réussie, redirection vers le dashboard...');
      
      // Redirection vers le dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
    }
  }, [dispatch]);

  return (
    <form className={'login-form'} onSubmit={onSubmit}>
      <img src={logo} alt="Logo" className={'logo'}/>
      <Form formData={formData.current}>
        <Item
          dataField={'email'}
          editorType={'dxTextBox'}
          editorOptions={emailEditorOptions}
        >
          <RequiredRule message="Login is required" />
          <Label visible={false} />
        </Item>
        <Item
          dataField={'password'}
          editorType={'dxTextBox'}
          editorOptions={passwordEditorOptions}
        >
          <RequiredRule message="Password is required" />
          <Label visible={false} />
        </Item>
        <Item
          dataField={'rememberMe'}
          editorType={'dxCheckBox'}
          editorOptions={rememberMeEditorOptions}
        >
          <Label visible={false} />
        </Item>
        <ButtonItem>
          <ButtonOptions
            width={'100%'}
            type={'default'}
            useSubmitBehavior={true}
          >
            <span className="dx-button-text">
              {loading ? (
                <LoadIndicator width="24px" height="24px" visible={true} />
              ) : (
                'Connexion'
              )}
            </span>
          </ButtonOptions>
        </ButtonItem>
        {error && <div className="login-error">{error}</div>}
      </Form>
    </form>
  );
}