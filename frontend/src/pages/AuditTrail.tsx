import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  FileText, 
  Search, 
  Download,
  Clock,
  User,
  Hash,
  ExternalLink,
  Shield,
  Database
} from "lucide-react"

export default function AuditTrail() {
  const [searchTerm, setSearchTerm] = useState("")

  const auditEvents = [
    {
      id: "AE-001234",
      timestamp: "2024-01-15 14:23:15",
      event: "QA Stamp Applied",
      entityType: "Batch",
      entityId: "B-2024-001",
      user: "Dr. Sarah Johnson",
      role: "Quality Manager",
      details: "Final Product Release approved",
      hederaHash: "0x1a2b3c4d5e6f...",
      blockNumber: "12,345,678",
      severity: "High"
    },
    {
      id: "AE-001235",
      timestamp: "2024-01-15 14:15:42",
      event: "QC Test Completed",
      entityType: "Sample",
      entityId: "S-2024-0156",
      user: "Dr. Emily Zhang", 
      role: "Lab Analyst",
      details: "API Purity test result: 98.7% (Pass)",
      hederaHash: "0x2b3c4d5e6f7a...",
      blockNumber: "12,345,677",
      severity: "Medium"
    },
    {
      id: "AE-001236",
      timestamp: "2024-01-15 13:58:03",
      event: "Process Step Completed",
      entityType: "Batch",
      entityId: "B-2024-001",
      user: "John Doe",
      role: "Production Operator",
      details: "Tablet compression completed with parameters verified",
      hederaHash: "0x3c4d5e6f7a8b...",
      blockNumber: "12,345,676",
      severity: "Low"
    },
    {
      id: "AE-001237",
      timestamp: "2024-01-15 13:45:20",
      event: "CAPA Initiated",
      entityType: "CAPA",
      entityId: "CAPA-2024-003",
      user: "Dr. Michael Chen",
      role: "QA Manager",
      details: "Temperature deviation investigation started",
      hederaHash: "0x4d5e6f7a8b9c...",
      blockNumber: "12,345,675",
      severity: "High"
    },
    {
      id: "AE-001238",
      timestamp: "2024-01-15 12:30:15",
      event: "Batch Created",
      entityType: "Batch",
      entityId: "B-2024-002",
      user: "Jane Smith",
      role: "Production Supervisor",
      details: "New batch created for Ibuprofen 200mg production",
      hederaHash: "0x5e6f7a8b9c0d...",
      blockNumber: "12,345,674",
      severity: "Medium"
    },
    {
      id: "AE-001239",
      timestamp: "2024-01-15 11:15:08",
      event: "Material Released", 
      entityType: "Material",
      entityId: "M-API-2024-0045",
      user: "Dr. Sarah Johnson",
      role: "Quality Manager",
      details: "Raw material lot released for production use",
      hederaHash: "0x6f7a8b9c0d1e...",
      blockNumber: "12,345,673",
      severity: "High"
    }
  ]

  const filteredEvents = auditEvents.filter(event =>
    event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.details.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "High": return "non-compliant"
      case "Medium": return "pending"
      case "Low": return "compliant"
      default: return "default"
    }
  }

  const getEntityTypeColor = (entityType: string) => {
    switch (entityType) {
      case "Batch": return "bg-primary/10 text-primary border-primary/20"
      case "Sample": return "bg-success/10 text-success border-success/20"
      case "CAPA": return "bg-warning/10 text-warning border-warning/20"
      case "Material": return "bg-accent/10 text-accent-foreground border-accent/20"
      default: return "bg-secondary text-secondary-foreground border-border"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Audit Trail</h2>
          <p className="text-muted-foreground">Immutable record of all system activities anchored to Hedera blockchain</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Trail
          </Button>
          <Button variant="outline">
            <Shield className="mr-2 h-4 w-4" />
            Verify Integrity
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audit events, entities, users, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Latest Block</p>
                <p className="text-2xl font-bold text-foreground">12,345,678</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Hash className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Events Today</p>
                <p className="text-2xl font-bold text-foreground">247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium">Integrity Status</p>
                <p className="text-sm font-bold text-success">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Events Table */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Audit Events ({filteredEvents.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Hedera Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id} className="hover:bg-accent/50">
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{event.timestamp}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{event.event}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getEntityTypeColor(event.entityType)}`}
                      >
                        {event.entityType}
                      </Badge>
                      <div className="text-xs text-muted-foreground">{event.entityId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>{event.user}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{event.role}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-64">
                    <div className="truncate text-sm">{event.details}</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge variant={getSeverityVariant(event.severity)}>
                      {event.severity}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-secondary px-2 py-1 rounded">
                        {event.hederaHash.substring(0, 12)}...
                      </code>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Block: {event.blockNumber}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}