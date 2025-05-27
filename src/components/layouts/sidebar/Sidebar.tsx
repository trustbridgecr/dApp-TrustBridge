"use client";
import { SettingsIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTrustBridgeSidebar } from "./hooks/useSidebar.hook";

export function TrustBridgeSidebar() {
  const { formattedAddress, collapsed, menuItems } = useTrustBridgeSidebar();

  return (
    <Sidebar className="border-r bg-white dark:bg-gray-950">
      <SidebarHeader className="pb-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img
              src="/img/TrustBridge.png"
              alt="TrustBridge Logo"
              className="h-8 w-8 object-cover"
            />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-md font-bold leading-none text-emerald-600">
                  TrustBridge
                </span>
                <span className="text-xs text-muted-foreground">
                  Decentralized Microloans
                </span>
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-2">
        {menuItems.map((section, idx) => (
          <SidebarGroup key={idx} className="mb-3">
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2 mb-1">
                {section.section}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item, itemIdx) => (
                  <TooltipProvider key={itemIdx}>
                    <Tooltip delayDuration={collapsed ? 100 : 1000}>
                      <TooltipTrigger asChild>
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                              item.active
                                ? "bg-muted-foreground text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                              item.highlight &&
                                !item.active &&
                                " text-muted-foreground hover:from-emerald-600 hover:to-teal-600",
                            )}
                          >
                            <a
                              href={item.href}
                              className="flex items-center gap-3 w-full"
                            >
                              <span
                                className={cn(
                                  "flex-shrink-0",
                                  item.active
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : item.highlight
                                      ? "text-white"
                                      : "text-muted-foreground group-hover:text-foreground",
                                )}
                              >
                                {item.icon}
                              </span>
                              {(!collapsed || item.highlight) && (
                                <span
                                  className={cn(
                                    "transition-opacity",
                                    collapsed && !item.highlight
                                      ? "opacity-0 w-0"
                                      : "opacity-100",
                                  )}
                                >
                                  {item.label}
                                </span>
                              )}
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </TooltipTrigger>
                      {collapsed && !item.highlight && (
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-muted">
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="User"
              />
              <AvatarFallback className="bg-emerald-100 text-emerald-700"></AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">User</span>
                <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                  {formattedAddress}
                </span>
              </div>
            )}
          </div>
          <a
            href="/dashboard/settings"
            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-md transition-colors"
          >
            <SettingsIcon className="h-4 w-4" />
          </a>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
