"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboardIcon, AlertTriangleIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Overview",
    href: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Events",
    href: "/events",
    icon: AlertTriangleIcon,
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-lg font-semibold text-foreground">Infrastructure Monitor</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">Build: {new Date().toISOString()}</p>
      </div>
    </div>
  )
}
