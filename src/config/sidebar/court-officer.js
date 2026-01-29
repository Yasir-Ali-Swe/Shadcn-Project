import {
  LayoutDashboard,
  Gavel,
  CalendarDays,
} from "lucide-react";

export const courtOfficerSidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard/court-officer",
    icon: LayoutDashboard,
  },
  {
    title: "Assigned Cases",
    url: "/dashboard/court-officer/cases",
    icon: Gavel,
  },
  {
    title: "Hearings",
    url: "/dashboard/court-officer/hearings",
    icon: CalendarDays,
  },
];
