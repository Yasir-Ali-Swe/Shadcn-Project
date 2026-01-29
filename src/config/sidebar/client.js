import {
  LayoutDashboard,
  HandHelping,
  UserPen,
  MessageCircle,
} from "lucide-react";

export const clientSidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard/client",
    icon: LayoutDashboard,
    exact: true,
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
