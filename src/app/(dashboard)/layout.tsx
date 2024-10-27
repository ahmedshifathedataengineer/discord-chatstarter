"use client";

import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RedirectToSignIn, SignOutButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { PlusIcon, User2Icon } from "lucide-react";
import { api } from "../../../convex/_generated/api";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Return JSX correctly
  return (
    <>
      <Authenticated>
        <SidebarProvider>
          <DashboardSidebar />
          {children}
        </SidebarProvider>
      </Authenticated>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>
    </>
  );
}

function DashboardSidebar() {
    const user = useQuery(api.functions.user.get);

    if (!user){
        return null;
    }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/friends">
                  <User2Icon /> 
                  Friends
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroup>
            <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
            <SidebarGroupAction>
                <PlusIcon />
                <span className = "sr-only">New Direct Message</span>
            </SidebarGroupAction>
          </SidebarGroup>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className = "flex items-center">
                    <Avatar className="size-6">
                <AvatarImage src={user.image} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
            <p className = "font-medium">{user.username}</p>
            </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <SignOutButton /> 
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
