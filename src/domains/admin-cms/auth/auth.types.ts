export interface IAdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

export interface IAuthContextValue {
  user: IAdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}