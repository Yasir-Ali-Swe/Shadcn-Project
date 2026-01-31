import {
  LayoutDashboard,
  FileText,
  Briefcase,
  UserPen,
  MessageCircle,
} from "lucide-react";

export const lawyerSidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard/lawyer",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Proposals",
    url: "/dashboard/lawyer/proposals",
    icon: FileText,
  },
  {
    title: "Cases",
    url: "/dashboard/lawyer/cases",
    icon: Briefcase,
  },
  {
    title: "Profile",
    url: "/dashboard/lawyer/profile", // This assumes existence. 
    icon: UserPen,
  },
  {
    title: "Messages",
    url: "/dashboard/lawyer/messages",
    icon: MessageCircle,
  },
];
