import {
  BarChart3,
  Bot,
  FolderOpen,
  LayoutDashboard,
  Rocket,
  Satellite,
  Settings,
  TerminalSquare,
  UserCircle2,
  type LucideIcon,
} from "lucide-react";
import type { ViewId } from "@/types";

export interface NavItem {
  id: ViewId;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "mission", label: "Mission Control", icon: Rocket },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "assistant", label: "AI Assistant", icon: Bot },
  { id: "satellite", label: "Satellite", icon: Satellite },
  { id: "files", label: "Files", icon: FolderOpen },
  { id: "terminal", label: "Terminal", icon: TerminalSquare },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "profile", label: "Profile", icon: UserCircle2 },
];
