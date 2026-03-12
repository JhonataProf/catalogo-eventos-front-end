import {
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import type { IAdminUser, IAuthContextValue } from "./auth.types";
import {
  clearAdminUser,
  loadAdminUser,
  saveAdminUser,
} from "./auth.storage";
import { AuthContext } from "./auth.context";

export function AuthProvider({
  children,
}: PropsWithChildren): ReactElement {
  const [user, setUser] = useState<IAdminUser | null>(() => loadAdminUser());

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    await new Promise<void>((resolve: () => void) => {
      window.setTimeout(resolve, 300);
    });

    if (!email || !password) {
      throw new Error("Informe email e senha.");
    }

    const nextUser: IAdminUser = {
      id: "admin-1",
      name: "Administrador",
      email,
      role: "admin",
    };

    setUser(nextUser);
    saveAdminUser(nextUser);
  }, []);

  const logout = useCallback((): void => {
    setUser(null);
    clearAdminUser();
  }, []);

  const contextValue: IAuthContextValue = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [login, logout, user]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}