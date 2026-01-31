"use client";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "@/store/slices/auth-slice";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "./ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getSidebarItemsByRole } from "@/lib/sidbar";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { role, user } = useSelector((state) => state.auth);

  // Guard against null role during initial load, though AuthGuard should handle this locally if wrapped.
  const currentRole = role || "";
  const links = getSidebarItemsByRole(currentRole);

  const handleLogout = async () => {
    try {
      if (user?.email) {
        await authApi.logout(user.email);
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      dispatch(clearUser());
      router.push("/login");
    }
  };

  return (
    <Sidebar className="bg-sidebar text-sidebar-foreground">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton asChild className="text-lg">
              <Link href="/home" className="font-bold text-xl">
                LawConnect
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}{" "}
            Dashboard ({role || "null"})
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => {
                const isActive = item.exact
                  ? pathname === item.url
                  : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={`rounded-full my-2 ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "hover:bg-sidebar-accent hover:text-accent-foreground"
                    }`}
                  >
                    <SidebarMenuButton
                      asChild
                      className="rounded-full text-lg [&>svg]:size-5"
                    >
                      <Link href={item.url} className="flex items-center gap-2">
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
