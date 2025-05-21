import { Router } from "expo-router";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface UserHeaderProps {
    user: User;
    router: Router;
    handleLogout: () => void;
}
