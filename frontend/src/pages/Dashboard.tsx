import { MetricCard } from "@/components/ui/metric-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Factory, 
  FlaskConical, 
  ShieldCheck, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users
} from "lucide-react"

export default function Dashboard() {
  const activeBatches = [
    { id: "B-2024-001", product: "Amoxicillin 500mg", status: "In Production", progress: 65, operator: "John Doe" },
    { id: "B-2024-002", product: "Ibuprofen 200mg", status: "QC Testing", progress: 85, operator: "Jane Smith" },
    { id: "B-2024-003", product: "Paracetamol 500mg", status: "Packaging", progress: 95, operator: "Mike Wilson" },
  ]

  const recentQAActivities = [
    { time: "10:30 AM", activity: "QA Stamp approved for Batch B-2024-001", signer: "Dr. Sarah Johnson", status: "approved" },
    { time: "09:15 AM", activity: "QC Test completed for API purity", result: "98.7% (Pass)", status: "passed" },
    { time: "08:45 AM", activity: "CAPA initiated for temperature deviation", priority: "High", status: "pending" },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Manufacturing Dashboard</h2>
          <p className="text-muted-foreground">Real-time view of production, quality, and compliance status</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button className="bg-gradient-primary">
            <Factory className="mr-2 h-4 w-4" />
            New Batch
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Batches"
          value="12"
          subtitle="+2 from yesterday"
          trend="up"
          icon={<Factory className="h-4 w-4" />}
        />
        <MetricCard
          title="QC Tests Pending"
          value="7"
          subtitle="3 high priority"
          trend="neutral"
          icon={<FlaskConical className="h-4 w-4" />}
        />
        <MetricCard
          title="Compliance Score"
          value="98.5%"
          subtitle="+0.3% this week"
          trend="up"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <MetricCard
          title="Active Operators"
          value="24"
          subtitle="Across 3 shifts"
          trend="neutral"
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Batches */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Factory className="h-5 w-5 text-primary" />
              <span>Active Batches</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeBatches.map((batch) => (
              <div key={batch.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{batch.id}</h4>
                    <p className="text-sm text-muted-foreground">{batch.product}</p>
                  </div>
                  <StatusBadge 
                    variant={
                      batch.status === "In Production" ? "active" :
                      batch.status === "QC Testing" ? "pending" : 
                      "compliant"
                    }
                  >
                    {batch.status}
                  </StatusBadge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{batch.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all" 
                      style={{ width: `${batch.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Operator: {batch.operator}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent QA Activities */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Recent QA Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentQAActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="mt-1">
                  {activity.status === "approved" && <CheckCircle2 className="h-4 w-4 text-success" />}
                  {activity.status === "passed" && <CheckCircle2 className="h-4 w-4 text-success" />}
                  {activity.status === "pending" && <AlertTriangle className="h-4 w-4 text-warning" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">{activity.activity}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{activity.time}</span>
                    {activity.signer && <Badge variant="outline" className="text-xs">{activity.signer}</Badge>}
                    {activity.result && <span className="text-success">• {activity.result}</span>}
                    {activity.priority && <Badge variant="destructive" className="text-xs">{activity.priority}</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}