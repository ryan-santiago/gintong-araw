"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ClipboardCheck, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
  {
    icon: Users,
    label: "Members",
    href: "/members",
  },
  {
    icon: ClipboardCheck,
    label: "Attendance",
    href: "/attendance",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <Image src="/logo.png" alt="Logo" width={36} height={36} />
          <p className="text-2xl font-semibold">Gintong Araw</p>
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <Separator className="opacity-100 text-[#5d6b68]" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5d6b68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                      pathname === item.href &&
                        "bg-linear-to-r/oklch border-[#5d6b68]/10 ",
                    )}
                    asChild
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-2">
          <Separator className="opacity-100 text-[#5d6b68]" />
        </div>
      </SidebarContent>

      <SidebarFooter className="text-white">
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
