import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard-sidebar";
import DasboardNavbar from "@/components/dasboard-navbar";
import AuthGuard from "@/components/auth/AuthGuard";
import { SocketProvider } from "@/providers/socket-provider";
import { cookies } from "next/headers";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AuthGuard>
        <SocketProvider>
          <DashboardSidebar />
          <div className="flex flex-col w-screen">
            <DasboardNavbar />
            <main className="flex-1 m-3">{children}</main>
          </div>
        </SocketProvider>
      </AuthGuard>
    </SidebarProvider>
  );
}
