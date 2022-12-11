import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../api/api';
import { User } from '../model/user.model';

interface IAuthProviderProps {
    children?: JSX.Element | JSX.Element[]
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  Login(user: object): Promise<boolean>;
  Logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider= ({ children }: IAuthProviderProps ) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storagedUser = sessionStorage.getItem('@EasySurveys:user');
    const storagedToken = sessionStorage.getItem('@EasySurveys:token');

    if (storagedToken && storagedUser) {
      setUser(JSON.parse(storagedUser));
      api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
    }
  }, []);

  async function Login(userData: object) {
    try {
      const response = await api.post('login', {...userData});

      setUser(response.data.user as User);
      api.defaults.headers.Authorization = `Bearer ${response.data.token}`;

      sessionStorage.setItem('@EasySurveys:user', JSON.stringify(response.data.user));
      sessionStorage.setItem('@EasySurveys:token', response.data.token);
      return true
    } catch {
      return false
    }
  }

  function Logout() {
    sessionStorage.removeItem("@EasySurveys:user")
    sessionStorage.removeItem("@EasySurveys:token")
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, Login, Logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}