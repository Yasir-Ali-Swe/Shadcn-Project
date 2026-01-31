import {
  LayoutDashboard,
  HandHelping,
  UserPen,
  MessageCircle,
  Gavel,
} from "lucide-react";

export const clientSidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard/client",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Cases",
    url: "/dashboard/client/cases",
    icon: Gavel,
  },
  {
    title: "Proposals",
    url: "/dashboard/client/proposals",
    icon: HandHelping,
  },
  {
    title: "Profile",
    url: "/dashboard/client/profile",
    icon: UserPen,
  },
  {
    title: "Messages",
    url: "/dashboard/client/messages",
    icon: MessageCircle,
  },
];
