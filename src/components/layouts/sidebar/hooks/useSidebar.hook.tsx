"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  ShoppingBag,
  CloudUpload,
  Bell,
  MessageSquare,
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
          href: "/dashboard/offer",
          icon: <CloudUpload className="h-4 w-4 text-muted-foreground" />,
          label: "Offer Loan",
          active: pathname === "/dashboard/offer",
          highlight: true,
        },
      ],
    },
    {
      section: "Marketplace",
      items: [
        {
          href: "/dashboard/marketplace",
          icon: <ShoppingBag className="h-4 w-4" />,
          label: "Explore Offers",
          active: pathname.startsWith("/dashboard/marketplace"),
        },
      ],
    },
    {
      section: "Communication",
      items: [
        {
          href: "/dashboard/chat",
          icon: <MessageSquare className="h-4 w-4" />,
          label: "Chat",
          active: pathname === "/dashboard/chat",
          notification: false,
        },
      ],
    },
  ];

  const adminItems: MenuSection[] = isAdmin
    ? [
        {
          section: "Administration",
          items: [
            {
              href: "/dashboard/admin/loan-requests",
              icon: <Bell className="h-4 w-4" />,
              label: "Loan Requests",
              active: pathname === "/dashboard/admin/loan-requests",
              notification: false,
            },
          ],
        },
      ]
    : [];

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return {
    formattedAddress,
    collapsed,
    toggleCollapsed,
    menuItems,
    adminItems,
    isAdmin,
  };
}
