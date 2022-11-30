import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../api/api';

interface IAuthProviderProps {
    children?: JSX.Element | JSX.Element[]
}

interface AuthContextData {
  signed: boolean;
  user: object | null;
  Login(user: object): Promise<void>;
  Logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider= ({ children }: IAuthProviderProps ) => {
  const [user, setUser] = useState<object | null>(null);

  useEffect(() => {
    const storagedUser = sessionStorage.getItem('@EasySurveys:user');
    const storagedToken = sessionStorage.getItem('@EasySurveys:token');

    if (storagedToken && storagedUser) {
      setUser(JSON.parse(storagedUser));
      api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
    }
  }, []);

  async function Login(userData: object) {
    const response = await api.post('login', {...userData});

    setUser(response.data.user);
    api.defaults.headers.Authorization = `Bearer ${response.data.token}`;

    sessionStorage.setItem('@EasySurveys:user', JSON.stringify(response.data.user));
    sessionStorage.setItem('@EasySurveys:token', response.data.token);
  }

  function Logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ signed: Boolean(user), user, Login, Logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}