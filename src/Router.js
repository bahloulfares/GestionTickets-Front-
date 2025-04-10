import React, { useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import MenuTabs from './Components/MenuTabs/MenuTabs';
import LoginForm from './Components/LoginForm/LoginForm';


export const Router =  () => {


  const userAuthentification = useSelector(state => state.LoginReducer.userAuthentification);


  return (
    //userAuthentification !== null ? 
      <Route exact path='/' component={MenuTabs}/> 
      //: 
       //<Route exact path='/' component={LoginForm}/> 
  );
}

