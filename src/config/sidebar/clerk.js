import {
  LayoutDashboard,
  FolderKanban,
  UserCheck,
} from "lucide-react";

export const clerkSidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard/clerk",
    icon: LayoutDashboard,
  },
  {
    title: "Submitted Cases",
    url: "/dashboard/clerk/cases",
    icon: FolderKanban,
  },
  {
    title: "Court Officers",
    url: "/dashboard/clerk/court-officers",
    icon: UserCheck,
  },
];
