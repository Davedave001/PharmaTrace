import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavigationItem {
  href: string
  label: string
  icon?: React.ReactNode
}

interface NavigationProps {
  items: NavigationItem[]
  className?: string
}

export function Navigation({ items, className }: NavigationProps) {
  const location = useLocation()

  return (
    <nav className={cn("flex space-x-2", className)}>
      {items.map((item) => (
        <Button
          key={item.href}
          asChild
          variant={location.pathname === item.href ? "default" : "ghost"}
          size="sm"
          className="justify-start"
        >
          <Link to={item.href} className="flex items-center space-x-2">
            {item.icon}
            <span>{item.label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  )
}