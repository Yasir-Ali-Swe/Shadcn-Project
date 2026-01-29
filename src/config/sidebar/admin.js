import {
  LayoutDashboard,
  Building2,
  UserCog,
  Users,
} from "lucide-react";

export const adminSidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Courts",
    url: "/dashboard/admin/courts",
    icon: Building2,
  },
  {
    title: "Clerks",
    url: "/dashboard/admin/clerks",
    icon: Users,
  },
  {
    title: "Court Officers",
    url: "/dashboard/admin/court-officers",
    icon: UserCog,
  },
];
