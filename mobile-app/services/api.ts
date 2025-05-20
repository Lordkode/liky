import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "@/constants/constants";

// API BASE URL - Utiliser une valeur en dur pour le débogage
const BASE_URL = "http://192.168.100.16:3000/api/v1/";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000, // 15 secondes
});

// Interceptor for adding authentification token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItem(Constants.AUTH_TOKEN_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptors for managing response error
interface TokenResponse {
  token: string;
  refresh_token: string;
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  config: any;
  message?: string;
}

apiClient.interceptors.response.use(
  (response) => response, // Retourne l'objet response complet, pas seulement response.data
  async (error: ApiError) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStore.getItem(
          Constants.REFRESH_TOKEN_NAME,
        );
        if (!refreshToken) {
          return Promise.reject(error);
        }
        // Call for refreshing token
        const response = await axios.post<TokenResponse>(
          `${BASE_URL}/auth/refresh`, // Correction du chemin d'endpoint
          {
            refresh_token: refreshToken,
          },
        );
        const { token, refresh_token } = response.data;
        await SecureStore.setItem(Constants.AUTH_TOKEN_NAME, token);
        await SecureStore.setItem(Constants.REFRESH_TOKEN_NAME, refresh_token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync(Constants.AUTH_TOKEN_NAME);
        await SecureStore.deleteItemAsync(Constants.REFRESH_TOKEN_NAME);
        return Promise.reject(refreshError);
      }
    }
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred!";
    return Promise.reject(errorMessage);
  },
);

export default apiClient;
