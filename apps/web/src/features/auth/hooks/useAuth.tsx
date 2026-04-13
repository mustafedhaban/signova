import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:3000/api/v1';

interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const interceptorRef = useRef<number | null>(null);

  // Set up axios interceptor to auto-refresh on 401
  useEffect(() => {
    interceptorRef.current = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes('/auth/')
        ) {
          originalRequest._retry = true;
          const storedRefresh = localStorage.getItem('refresh_token');
          if (storedRefresh) {
            try {
              const { data } = await axios.post(`${API}/auth/refresh`, {
                refresh_token: storedRefresh,
              });
              const newToken = data.access_token;
              localStorage.setItem('token', newToken);
              localStorage.setItem('refresh_token', data.refresh_token);
              axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return axios(originalRequest);
            } catch {
              logout();
            }
          } else {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      if (interceptorRef.current !== null) {
        axios.interceptors.response.eject(interceptorRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API}/auth/profile`);
      setUser(response.data);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (accessToken: string, refreshToken?: string) => {
    localStorage.setItem('token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    setToken(accessToken);
    navigate('/');
  };

  const logout = () => {
    // Fire-and-forget server-side revocation
    const t = localStorage.getItem('token');
    if (t) {
      axios
        .post(`${API}/auth/logout`, {}, { headers: { Authorization: `Bearer ${t}` } })
        .catch(() => {});
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
