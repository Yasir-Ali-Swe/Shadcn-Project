import React from "react";
import { SidebarProvider} from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard-sidebar";
import DasboardNavbar from "@/components/dasboard-navbar";
import { cookies } from "next/headers";

const layout = async ({ children }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "14rem",
      }}
      defaultOpen={defaultOpen}
    >
      <DashboardSidebar />
      <div className="flex flex-col w-screen">
        <DasboardNavbar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default layout;
