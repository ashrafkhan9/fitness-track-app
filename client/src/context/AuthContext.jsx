import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { apiClient, setAccessToken, clearAccessToken } from '../services/apiClient.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = useCallback(async () => {
    try {
      const response = await apiClient.get('/profiles');
      setProfiles(response.data);
      setUser((prev) => (prev ? { ...prev, profiles: response.data } : prev));
    } catch (error) {
      console.error('Failed to fetch profiles', error);
    }
  }, []);

  const attemptRefresh = useCallback(async () => {
    try {
      const response = await apiClient.post('/auth/refresh');
      const token = response.data.accessToken;
      setAccessToken(token);
      const [userResponse, profilesResponse] = await Promise.all([
        apiClient.get('/auth/me'),
        apiClient.get('/profiles'),
      ]);
      setUser(userResponse.data);
      setProfiles(profilesResponse.data);
    } catch (error) {
      clearAccessToken();
      setUser(null);
      setProfiles([]);
    }
  }, []);

  useEffect(() => {
    attemptRefresh().finally(() => setLoading(false));
  }, [attemptRefresh]);

  const login = useCallback(async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    setUser(response.data.user);
    setAccessToken(response.data.accessToken);
    await fetchProfiles();
    return response.data.user;
  }, [fetchProfiles]);

  const register = useCallback(async (data) => {
    const response = await apiClient.post('/auth/register', data);
    setUser(response.data.user);
    setAccessToken(response.data.accessToken);
    await fetchProfiles();
    return response.data.user;
  }, [fetchProfiles]);

  const logout = useCallback(async () => {
    await apiClient.post('/auth/logout');
    clearAccessToken();
    setUser(null);
    setProfiles([]);
  }, []);

  const value = useMemo(() => ({
    user,
    profiles,
    loading,
    login,
    register,
    logout,
    refreshProfiles: fetchProfiles,
    setUser,
  }), [user, profiles, loading, login, register, logout, fetchProfiles]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
