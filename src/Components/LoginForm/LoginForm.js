import React, { useRef, useCallback } from 'react';
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import { signIn } from '../../Redux/Actions/Login/Login';

import './login-form.css';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../../assests/css/images/logo_csys.png';

function LoginForm() {
  const formData = useRef({
    email: '',
    password: '',
    rememberMe: false
  });

  const dispatch = useDispatch();
  const userAuthentification = useSelector(state => state.LoginReducer.userAuthentification);
  const loading = useSelector(state => state.LoginReducer.loading);
  const error = useSelector(state => state.LoginReducer.error);

  // Dans la fonction onSubmit, mise à jour pour gérer les informations utilisateur complètes
  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { email, password } = formData.current;
    
    if(userAuthentification === null){
      try {
        const userData = await dispatch(signIn(email, password));
        // Si rememberMe est coché, on stocke le nom d'utilisateur
        if (formData.current.rememberMe) {
          localStorage.setItem('rememberedUser', userData.username);
        }
      } catch (error) {
        // L'erreur est déjà gérée dans le reducer
      }
    }
  }, [dispatch, userAuthentification]);

  return (
    <form className={'login-form'} onSubmit={onSubmit}>
      <img src={logo} alt="Logo" className={'logo'}/>
      {error && <div className="login-error">{error}</div>}
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
            disabled={loading}
          >
            <span className="dx-button-text">
              {loading ? <LoadIndicator width={'24px'} height={'24px'} /> : 'Connexion'}
            </span>
          </ButtonOptions>
        </ButtonItem>
      </Form>
    </form>
  );
}

export default React.memo(LoginForm);

const emailEditorOptions = { stylingMode: 'filled', placeholder: 'Login', mode: 'text' };
const passwordEditorOptions = { stylingMode: 'filled', placeholder: 'Password', mode: 'password' };
const rememberMeEditorOptions = { text: 'Enregistrer le mot de passe', elementAttr: { class: 'form-text' } };
