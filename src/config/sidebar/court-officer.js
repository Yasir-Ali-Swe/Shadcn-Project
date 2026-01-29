import {
  LayoutDashboard,
  Gavel,
  CalendarDays,
  UserPen,
} from "lucide-react";

export const courtOfficerSidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard/court-officer",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Assigned Cases",
    url: "/dashboard/court-officer/cases",
    icon: Gavel,
  },
  // {
  //   title: "Hearings",
  //   url: "/dashboard/court-officer/hearings",
  //   icon: CalendarDays,
  // },
   {
    title: "Profile",
    url: "/dashboard/court-officer/profile",
    icon: UserPen,
  },
];
