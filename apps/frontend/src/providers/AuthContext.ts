import { createContext } from "react";

export interface AuthContextType {
  // TODO: Define auth context interface
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
