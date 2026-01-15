import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Scan, History, Menu, X, LogOut, Wallet } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: "/scan", icon: Scan, label: "Scan" },
  { to: "/history", icon: History, label: "History" },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <Scan className="w-6 h-6" />
            ScanDash
          </h1>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.name}</p>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Wallet className="w-3 h-3" />
                  <span>{user.balance} credits</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={logout}>
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-sidebar border-b border-sidebar-border z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold text-primary flex items-center gap-2">
            <Scan className="w-5 h-5" />
            ScanDash
          </h1>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-1 text-sm text-primary bg-primary/10 px-2 py-1 rounded">
                <Wallet className="w-3 h-3" />
                <span>{user.balance}</span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-sidebar-accent"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="p-4 space-y-2 border-t border-sidebar-border">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
            <Button variant="ghost" className="w-full justify-start gap-3 mt-2" onClick={logout}>
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 md:p-8 p-4 pt-20 md:pt-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
