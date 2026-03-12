import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";

export function AdminAuthLayout(): ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-light)] px-4 py-10">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}