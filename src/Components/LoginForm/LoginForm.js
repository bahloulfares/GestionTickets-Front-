import React, { useState, useRef, useCallback } from 'react';
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import {signIn } from '../../Redux/Actions/Login/Login';

import './login-form.css';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../../assests/css/images/logo_csys.png';


export default function () {
  const formData = useRef({});

  const dispatch = useDispatch();

  const userAuthentification = useSelector(state => state.LoginReducer.userAuthentification);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { email, password } = formData.current;


   if(userAuthentification === null){
     dispatch(signIn(email, password)) ;
   }
      
  
  }, []);

  const onCreateAccountClick = useCallback(() => {
    history.push('/create-account');
  }, [history]);

  return (
    <form className={'login-form'} onSubmit={onSubmit}>
      <img src={logo} alt="Logo"  className={'logo'}/>
      <Form formData={formData.current} >
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
               Connexion
            </span>
          </ButtonOptions>
        </ButtonItem>
      </Form>
    </form>
  );
}


const emailEditorOptions = { stylingMode: 'filled', placeholder: 'Login', mode: 'text' };
const passwordEditorOptions = { stylingMode: 'filled', placeholder: 'Password', mode: 'password' };
const rememberMeEditorOptions = { text: 'Enregistrer le mot de passe', elementAttr: { class: 'form-text' } };
