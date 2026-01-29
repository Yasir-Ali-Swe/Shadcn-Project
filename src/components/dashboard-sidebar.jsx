"use client";
import {getSidebarItemsByRole} from "@/lib/sidbar";
import React from "react";
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
} from "./ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links=getSidebarItemsByRole('client');

const DashboardSidebar = () => {
  const pathname = usePathname();

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
          <SidebarGroupLabel>Client Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => {
                const isActive = pathname === item.url

                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={`rounded-full my-2 ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "hover:bg-sidebar-accent hover:text-accent-foreground"
                    }`}
                  >
                    <SidebarMenuButton asChild className="rounded-full text-lg [&>svg]:size-5">
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon />
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
    </Sidebar>
  );
};

export default DashboardSidebar;
