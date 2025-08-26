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
  Search, 
  Plus, 
  Filter, 
  Download,
  ExternalLink,
  Calendar,
  User,
  Package
} from "lucide-react"

export default function Batches() {
  const [searchTerm, setSearchTerm] = useState("")

  const batches = [
    {
      id: "B-2024-001",
      product: "Amoxicillin 500mg",
      status: "In Production",
      startDate: "2024-01-15",
      operator: "John Doe",
      upstreamRef: "API-2024-0045",
      progress: 65,
      qaStatus: "Pending",
      hederaHash: "0x1a2b3c4d..."
    },
    {
      id: "B-2024-002", 
      product: "Ibuprofen 200mg",
      status: "QC Testing",
      startDate: "2024-01-14",
      operator: "Jane Smith",
      upstreamRef: "API-2024-0044",
      progress: 85,
      qaStatus: "In Review",
      hederaHash: "0x2b3c4d5e..."
    },
    {
      id: "B-2024-003",
      product: "Paracetamol 500mg", 
      status: "Completed",
      startDate: "2024-01-12",
      operator: "Mike Wilson",
      upstreamRef: "API-2024-0043",
      progress: 100,
      qaStatus: "Approved",
      hederaHash: "0x3c4d5e6f..."
    },
    {
      id: "B-2024-004",
      product: "Metformin 850mg",
      status: "Packaging",
      startDate: "2024-01-13",
      operator: "Sarah Lee",
      upstreamRef: "API-2024-0042",
      progress: 95,
      qaStatus: "Approved", 
      hederaHash: "0x4d5e6f7g..."
    }
  ]

  const filteredBatches = batches.filter(batch =>
    batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.operator.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed": return "compliant"
      case "In Production": return "active"
      case "QC Testing": return "pending"
      case "Packaging": return "pending"
      default: return "default"
    }
  }

  const getQAStatusVariant = (status: string) => {
    switch (status) {
      case "Approved": return "compliant"
      case "In Review": return "pending"
      case "Pending": return "pending"
      default: return "default"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Batch Management</h2>
          <p className="text-muted-foreground">Track and manage all production batches with full traceability</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Batch
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search batches, products, or operators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Batches Table */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-primary" />
            <span>Production Batches ({filteredBatches.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>QA Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Upstream Ref</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.map((batch) => (
                <TableRow key={batch.id} className="hover:bg-accent/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{batch.id}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{batch.product}</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge variant={getStatusVariant(batch.status)}>
                      {batch.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge variant={getQAStatusVariant(batch.qaStatus)}>
                      {batch.qaStatus}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div className="w-16 space-y-1">
                      <div className="text-xs text-right">{batch.progress}%</div>
                      <div className="w-full bg-secondary rounded-full h-1">
                        <div 
                          className="bg-gradient-primary h-1 rounded-full transition-all" 
                          style={{ width: `${batch.progress}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{batch.startDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span>{batch.operator}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {batch.upstreamRef}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                        Hedera ↗
                      </Button>
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