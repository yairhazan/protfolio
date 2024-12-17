import { useLocation } from "wouter"
import { Home, PieChart, TrendingUp, DollarSign, Settings, AlertOctagon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const [, setLocation] = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: PieChart, label: 'Investments', path: '/investments' },
    { icon: TrendingUp, label: 'Pension', path: '/pension' },
    { icon: DollarSign, label: 'Stocks', path: '/stocks' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: AlertOctagon, label: 'Diagnostics', path: '/diagnostics' },
  ]

  return (
    <div className={cn(
      "relative flex flex-col h-full bg-gray-800 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-gray-700">
        <h1 className={cn(
          "text-green-500 font-bold transition-all duration-300",
          collapsed ? "text-xl" : "text-3xl uppercase"
        )}>
          {collapsed ? "P" : "Pro-tfolio"}
        </h1>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-green-500"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => setLocation(item.path)}
                className={cn(
                  "flex items-center w-full h-12 px-3 rounded-lg transition-all duration-200",
                  "text-gray-300 hover:text-green-500 hover:bg-gray-700",
                  collapsed ? "justify-center" : "justify-start"
                )}
              >
                <item.icon className={cn(
                  "transition-all duration-200",
                  collapsed ? "h-6 w-6" : "h-5 w-5 mr-3"
                )} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section if needed */}
      <div className="p-4 border-t border-gray-700">
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-300">User Name</p>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  )
}
