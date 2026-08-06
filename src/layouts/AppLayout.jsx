import { Link, NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  CircleUserRound,
  FileText,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Settings,
  Shapes,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SkipLink } from "@/components/shared/PageStates";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { TradixLogo } from "@/components/shared/TradixLogo";
import {
  AppContent,
  AppHeader,
  AppShell,
  AppSidebar,
  useSidebar,
} from "@/components/shared/layout/AppShell";
import { useUser } from "@/context/UserContext";
import { ROUTES } from "@/routes/paths";
import { cn } from "@/lib/utils";

const navItems = [
  { to: ROUTES.DASHBOARD, label: "Home", icon: LayoutDashboard },
  { to: ROUTES.TRADE_JOURNAL, label: "Journal", icon: BookOpen },
  { to: ROUTES.ANALYTICS, label: "Analytics", icon: BarChart3 },
  { to: ROUTES.REPORTS, label: "Reports", icon: FileText },
  { to: ROUTES.CAPITAL, label: "Capital", icon: Wallet },
  { to: ROUTES.INSTRUMENTS, label: "Instruments", icon: Shapes },
  { to: ROUTES.SETTINGS, label: "Settings", icon: Settings },
];

function SidebarBrand() {
  const { collapsed } = useSidebar();

  return (
    <div
      className={cn(
        "flex h-14 items-center border-b border-sidebar-border",
        collapsed ? "justify-center px-2" : "px-4",
      )}
    >
      <Link
        to={ROUTES.DASHBOARD}
        className="inline-flex items-center"
        aria-label="Tradix"
      >
        <TradixLogo size="md" compact={collapsed} />
      </Link>
    </div>
  );
}

function SidebarNavItem({ item, collapsed }) {
  const Icon = item.icon;

  const link = (
    <NavLink
      to={item.to}
      data-nav-item="true"
      aria-label={item.label}
      className={cn(
        "flex items-center rounded-control px-3 py-2 text-sm font-medium transition-colors",
        collapsed ? "justify-center px-0" : "gap-2.5",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {!collapsed ? <span>{item.label}</span> : null}
    </NavLink>
  );

  if (!collapsed) {
    return link;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarNav() {
  const { collapsed } = useSidebar();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-2" aria-label="Primary">
      {navItems.map((item) => (
        <SidebarNavItem key={item.to} item={item} collapsed={collapsed} />
      ))}
    </nav>
  );
}

function HeaderActions() {
  const { user, logout } = useUser();
  const { toggle, collapsed } = useSidebar();

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="hidden md:inline-flex"
        onClick={toggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
      >
        <PanelLeft className="size-4" />
      </Button>

      <Link to={ROUTES.DASHBOARD} className="inline-flex items-center">
        <TradixLogo size="md" />
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Account menu"
            >
              <CircleUserRound className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 min-w-56">
            <DropdownMenuLabel className="space-y-1 font-normal">
              <p className="text-caption text-muted-foreground">Signed in as</p>
              <p className="truncate text-sm font-medium text-foreground">
                {user?.email || "—"}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => logout()}
            >
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

export function AppLayout() {
  return (
    <AppShell>
      <SkipLink />
      <AppSidebar>
        <SidebarBrand />
        <SidebarNav />
      </AppSidebar>

      <AppContent>
        <AppHeader>
          <HeaderActions />
        </AppHeader>

        <nav
          className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 md:hidden"
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-control px-3 py-1.5 text-small font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main id="main-content" className="min-h-0 flex-1" tabIndex={-1}>
          <Outlet />
        </main>
      </AppContent>
    </AppShell>
  );
}
