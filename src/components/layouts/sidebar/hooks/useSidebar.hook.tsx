"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  MessageSquare,
  Settings,
  ShoppingCart,
} from "lucide-react";
import { ReactNode } from "react";
import { useWalletContext } from "@/providers/wallet.provider";

type MenuItem = {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  highlight?: boolean;
  notification?: boolean;
};

type MenuSection = {
  section: string;
  items: MenuItem[];
};

export function useTrustBridgeSidebar() {
  const { walletAddress } = useWalletContext();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const formattedAddress = walletAddress
    ? `${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 4)}`
    : "";

  const isAdmin =
    walletAddress ===
    "GBZ7KCIUGD2ME7J7YSQW6WVM2RRNYA3AQWVEKVM2VK5LMQL3CKYARBWX";

  const menuItems: MenuSection[] = [
    {
      section: "Platform",
      items: [
        {
          href: "/dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
          label: "Dashboard",
          active: pathname === "/dashboard",
        },
      ],
    },
    {
      section: "Financial",
      items: [
        {
          href: "/dashboard/loans",
          icon: <CreditCard className="h-4 w-4" />,
          label: "Loans",
          active: pathname.startsWith("/dashboard/loans"),
        },
        {
          href: "/dashboard/marketplace",
          icon: <ShoppingCart className="h-4 w-4" />,
          label: "Marketplace",
          active: pathname.startsWith("/dashboard/marketplace"),
        },
      ],
    },
    {
      section: "Communication",
      items: [
        {
          href: "/dashboard/chat/[wallet]",
          icon: <MessageSquare className="h-4 w-4" />,
          label: "Chat",
          active: pathname === "/dashboard/chat",
          notification: false,
        },
      ],
    },
    {
      section: "Settings",
      items: [
        {
          href: "/dashboard/profile",
          icon: <Settings className="h-4 w-4" />,
          label: "Profile Settings",
          active: pathname === "/dashboard/profile",
        },
      ],
    },
  ];

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return {
    formattedAddress,
    collapsed,
    toggleCollapsed,
    menuItems,
    isAdmin,
  };
}
