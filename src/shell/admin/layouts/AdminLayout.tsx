import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "@/shell/admin/header/AdminHeader";
import { AdminSidebar } from "@/shell/admin/sidebar/AdminSidebar";

export function AdminLayout(): ReactElement {
  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminHeader />

      <div className="flex min-h-[calc(100vh-81px)] flex-col md:flex-row">
        <AdminSidebar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}