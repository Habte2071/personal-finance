import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 80000,
});

// Token interfaces
interface TokenPayload {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

// Request interceptor - add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('accessToken');
    
    if (token) {
      // Check if token is expired
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired - remove it
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          window.location.href = '/login';
          return Promise.reject(new Error('Token expired'));
        }
        
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        return Promise.reject(new Error('Invalid token'));
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Log full error details for debugging
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error('API No Response:', error.request);
    } else {
      console.error('API Request Error:', error.message);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = Cookies.get('refreshToken');
      
      if (refreshToken) {
        try {
          // Try to refresh token
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken }
          );
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          Cookies.set('accessToken', accessToken, { expires: 7 });
          Cookies.set('refreshToken', newRefreshToken, { expires: 30 });
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed - logout
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token - redirect to login
        window.location.href = '/login';
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      console.error('Forbidden access');
    }
    
    if (error.response?.status === 500) {
      console.error('Server error - check backend logs for details');
    }

    return Promise.reject(error);
  }
);

export default api;
