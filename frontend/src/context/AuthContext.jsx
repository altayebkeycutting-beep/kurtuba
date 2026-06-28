import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('ks_token');
      const savedUser = localStorage.getItem('ks_user');

      if (token && savedUser) {
        try {
          const res = await authAPI.me();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: res.data.user, token },
          });
        } catch (error) {
          console.error('Auth init error:', error.message);
          localStorage.removeItem('ks_token');
          localStorage.removeItem('ks_user');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user } = res.data;
    localStorage.setItem('ks_token', token);
    localStorage.setItem('ks_user', JSON.stringify(user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ks_token');
    localStorage.removeItem('ks_user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
