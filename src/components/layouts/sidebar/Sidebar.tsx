"use client";

import { useEffect, useState } from "react";
import type * as React from "react";
import {
  ChevronRight,
  HelpCircle,
  LayoutDashboard,
  AlertCircle,
  CreditCard,
  Users,
  Settings,
  History,
  HandCoins,
  ShoppingBag,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { db } from "@/core/config/firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { usePathname } from "next/navigation";

export function TrustBridgeSidebar() {
  const { address } = useGlobalAuthenticationStore();
  const pathname = usePathname();

  const formattedAddress = address
    ? `${address.substring(0, 8)}...${address.substring(address.length - 4)}`
    : "";

  const [hasNewRequest, setHasNewRequest] = useState(false);

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

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="pb-0">
        <div className="flex items-center gap-2 px-4 py-2">
          <img
            src="/img/TrustBridge.png"
            alt="TrustBridge Logo"
            className="h-10 w-10 object-cover"
          />
          <div className="flex flex-col">
            <span className="text-md mb-1 font-semibold leading-none">
              TrustBridge
            </span>
            <span className="text-xs text-muted-foreground">
              Decentralized Microloans
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Financial</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/loans">
                    <CreditCard className="h-4 w-4" />
                    <span>Loans</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/offer">
                    <HandCoins className="h-4 w-4" />
                    <span>Offer Loan</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/history">
                    <History className="h-4 w-4" />
                    <span>History</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Marketplace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/marketplace">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Explore Offers</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/support/issue">
                    <AlertCircle className="h-4 w-4" />
                    <span>Report an Issue</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/support/help">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {address ===
          "GBZ7KCIUGD2ME7J7YSQW6WVM2RRNYA3AQWVEKVM2VK5LMQL3CKYARBWX" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a
                      href="/dashboard/admin/loan-requests"
                      className="flex items-center gap-2"
                    >
                      <HandCoins className="h-4 w-4" />
                      <span>Loan Requests</span>
                      {hasNewRequest && (
                        <span className="ml-2 h-2 w-2 rounded-full bg-red-500 animate-ping" />
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">User</span>
              <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                {formattedAddress}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
