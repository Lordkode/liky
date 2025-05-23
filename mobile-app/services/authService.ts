import Constants from "@/constants/constants";
import apiClient from "./api";
import { setItemAsync, getItemAsync } from "expo-secure-store";
import { AuthResponse, LoginCredentials, RegisterCredentials } from "@/types";

class AuthService {
  // Login method
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log("Sending login request with:", {
        email: credentials.email,
        passwordLength: credentials.password?.length || 0,
      });

      const response = await apiClient.post("auth/login", credentials);

      // console.log("Raw login response:", response);

      // Vérifier si la réponse est valide et contient les données attendues
      if (!response.data?.data?.token) {
        throw new Error("Invalid response format");
      }

      const { token, refreshToken } = response.data.data;

      // Store tokens securely
      await setItemAsync(Constants.AUTH_TOKEN_NAME, token);
      if (refreshToken) {
        await setItemAsync(Constants.REFRESH_TOKEN_NAME, refreshToken);
      }

      return response.data;
    } catch (error: any) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Améliorer le message d'erreur avec plus de détails
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      throw new Error(`Login failed: ${errorMessage}`);
    }
  }

  // Register method
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("auth/register", credentials);

      if (!response.data.data || !response.data.data.token) {
        throw new Error("Invalid registration response format");
      }

      const { token, refresh_token } = response.data.data;

      // Store tokens securely
      await setItemAsync(Constants.AUTH_TOKEN_NAME, token);
      if (refresh_token) {
        await setItemAsync(Constants.REFRESH_TOKEN_NAME, refresh_token);
      }

      return response.data;
    } catch (error: any) {
      console.error("Registration error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      throw new Error(`Registration failed: ${errorMessage}`);
    }
  }

  // Logout method
  async logout(): Promise<void> {
    try {
      await apiClient.post("auth/logout");

      // Remove tokens from secure storage
      await setItemAsync(Constants.AUTH_TOKEN_NAME, "");
      await setItemAsync(Constants.REFRESH_TOKEN_NAME, "");
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(`Logout failed: ${error.message || "Unknown error"}`);
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await getItemAsync(Constants.AUTH_TOKEN_NAME);
      return !!token;
    } catch (error: any) {
      console.error("Auth check error:", error);
      throw new Error(`Error checking authentication: ${error.message}`);
    }
  }

  // Get current user info
  async getCurrentUser(): Promise<any> {
    try {
      const token = await getItemAsync(Constants.AUTH_TOKEN_NAME);
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await apiClient.get("auth/me");
      return response.data;
    } catch (error: any) {
      console.error("Get user info error:", error);
      throw new Error(`Error fetching user info: ${error.message}`);
    }
  }
}

export default new AuthService();
