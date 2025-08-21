import { useState } from "react";
import { Home, Heart, Plus, Settings, Music, Search } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Início", url: "/", icon: Home },
  { title: "Favoritos", url: "/favorites", icon: Heart },
  { title: "Adicionar Hino", url: "/add", icon: Plus },
  { title: "Configurações", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-musical" 
      : "hover:bg-accent hover:text-accent-foreground transition-all duration-200";

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
      collapsible
    >
      <SidebarContent className="bg-gradient-musical">
        {/* Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-white font-bold text-lg">CifraApp</h1>
                <p className="text-white/70 text-sm">Hinos & Louvores</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-white/80 px-4">
            {!collapsed && "Navegação"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-3 h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Search */}
        {!collapsed && (
          <div className="mt-auto p-4">
            <NavLink 
              to="/search" 
              className="flex items-center gap-3 p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span>Buscar Hinos</span>
            </NavLink>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}