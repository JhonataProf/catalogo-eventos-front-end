import { AuthProvider } from "@/domains/admin-cms/auth/AuthProvider";
import type { PropsWithChildren, ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";

export function AppProviders({
  children,
}: PropsWithChildren): ReactElement {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}