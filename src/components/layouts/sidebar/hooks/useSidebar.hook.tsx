"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/core/config/firebase/firebase";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import {
  LayoutDashboard,
  CreditCard,
  ShoppingBag,
  CloudUpload,
  Bell,
  MessageSquare,
} from "lucide-react";

export function useTrustBridgeSidebar() {
  const { address } = useGlobalAuthenticationStore();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [hasNewRequest, setHasNewRequest] = useState(false);

  const formattedAddress = address
    ? `${address.substring(0, 8)}...${address.substring(address.length - 4)}`
    : "";

  const isAdmin =
    address === "GBZ7KCIUGD2ME7J7YSQW6WVM2RRNYA3AQWVEKVM2VK5LMQL3CKYARBWX";

  useEffect(() => {
    const q = query(
      collection(db, "loan_offers"),
      where("status", "==", "pending"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHasNewRequest(!snapshot.empty);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (pathname === "/dashboard/admin/loan-requests") {
      setHasNewRequest(false);
    }
  }, [pathname]);

  const menuItems = [
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

  const adminItems = [
    {
      section: "Administration",
      items: [
        {
          href: "/dashboard/admin/loan-requests",
          icon: <Bell className="h-4 w-4" />,
          label: "Loan Requests",
          active: pathname === "/dashboard/admin/loan-requests",
          notification: hasNewRequest,
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
    adminItems,
    isAdmin,
  };
}
