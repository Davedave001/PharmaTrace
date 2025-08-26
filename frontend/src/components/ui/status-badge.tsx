import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        compliant: "bg-success/10 text-success border-success/20 hover:bg-success/20",
        pending: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
        "non-compliant": "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
        default: "bg-secondary text-secondary-foreground border-border",
        active: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
        inactive: "bg-muted text-muted-foreground border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, variant, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ variant }), className)} {...props} />
  )
}

export { StatusBadge, statusBadgeVariants }