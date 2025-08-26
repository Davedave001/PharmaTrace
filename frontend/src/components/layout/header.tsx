import { Navigation } from "@/components/ui/navigation"
import { Badge } from "@/components/ui/badge"
import { Factory, Database, ShieldCheck, FileText } from "lucide-react"

const navigationItems = [
  { href: "/", label: "Dashboard", icon: <Factory className="h-4 w-4" /> },
  { href: "/batches", label: "Batches", icon: <Database className="h-4 w-4" /> },
  { href: "/qa", label: "QA/QC", icon: <ShieldCheck className="h-4 w-4" /> },
  { href: "/audit", label: "Audit Trail", icon: <FileText className="h-4 w-4" /> },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Factory className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">PharmaTrace</h1>
              <p className="text-xs text-muted-foreground">MES + LIMS + QA/QC on Hedera</p>
            </div>
          </div>
        </div>
        
        <Navigation items={navigationItems} />
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Hedera Connected
          </Badge>
          <div className="text-right">
            <p className="text-sm font-medium">Dr. Sarah Johnson</p>
            <p className="text-xs text-muted-foreground">Quality Manager</p>
          </div>
        </div>
      </div>
    </header>
  )
}