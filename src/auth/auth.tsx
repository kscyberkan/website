import React, { useEffect, useState } from 'react';
import auth from './function';
import Login from './login/login';
import './auth.css';
import Register from './register/register';
import type { LoginData } from '../types/login_data';

type AuthProps = {
  children?: React.ReactNode
}

type AuthFunctionType = {
  setAuthMode: React.Dispatch<React.SetStateAction<'login' | 'register'>>;
  setLoginData: React.Dispatch<React.SetStateAction<false | LoginData>>;
}

export const authFunction: AuthFunctionType = {
  setAuthMode: () => { },
  setLoginData: () => { }
}

function Auth(props: AuthProps) {

  const [loginData, setData] = useState(auth.getLoginData());
  const [mode, setMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    authFunction.setAuthMode = setMode;
    authFunction.setLoginData = setData;
    setData(auth.getLoginData());
  }, [])

  return (
    <>
      {loginData ? props.children : mode == 'login' ? <Login /> : mode == 'register' ? <Register /> : ""}
    </>
  )
}

export default Auth
