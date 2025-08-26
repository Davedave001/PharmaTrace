import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ShieldCheck, 
  FlaskConical, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  FileText,
  Microscope,
  User,
  Calendar
} from "lucide-react"

export default function QualityAssurance() {
  const qaStamps = [
    {
      id: "QA-001",
      batchId: "B-2024-001",
      stage: "Raw Material Release",
      decision: "Approved",
      signer: "Dr. Sarah Johnson",
      timestamp: "2024-01-15 08:30",
      notes: "All materials meet specifications"
    },
    {
      id: "QA-002", 
      batchId: "B-2024-002",
      stage: "In-Process Control",
      decision: "Pending",
      signer: "Dr. Michael Chen",
      timestamp: "2024-01-15 10:15",
      notes: "Awaiting final pH test results"
    },
    {
      id: "QA-003",
      batchId: "B-2024-001",
      stage: "Final Product Release",
      decision: "Conditional",
      signer: "Dr. Sarah Johnson", 
      timestamp: "2024-01-15 14:20",
      notes: "Approved pending CAPA completion"
    }
  ]

  const qcTests = [
    {
      sampleId: "S-2024-0156",
      batchId: "B-2024-001",
      testName: "API Purity (HPLC)",
      result: "98.7%",
      specification: "≥98.0%",
      status: "Pass",
      analyst: "Dr. Emily Zhang",
      completedAt: "2024-01-15 11:30",
      instrument: "HPLC-001"
    },
    {
      sampleId: "S-2024-0157",
      batchId: "B-2024-002", 
      testName: "Dissolution Test",
      result: "85% at 30min",
      specification: "≥80% at 30min",
      status: "Pass",
      analyst: "John Martinez",
      completedAt: "2024-01-15 13:45",
      instrument: "DIS-002"
    },
    {
      sampleId: "S-2024-0158",
      batchId: "B-2024-003",
      testName: "Microbial Limits",
      result: "Pending",
      specification: "<10 CFU/g",
      status: "In Progress",
      analyst: "Lisa Wong",
      completedAt: null,
      instrument: "LAM-001"
    },
    {
      sampleId: "S-2024-0159",
      batchId: "B-2024-001",
      testName: "Heavy Metals",
      result: "0.8 ppm",
      specification: "≤1.0 ppm", 
      status: "Pass",
      analyst: "Dr. Emily Zhang",
      completedAt: "2024-01-15 09:20",
      instrument: "ICP-001"
    }
  ]

  const capas = [
    {
      id: "CAPA-2024-003",
      title: "Temperature Deviation in Storage",
      priority: "High",
      status: "Open",
      assignee: "Dr. Sarah Johnson",
      dueDate: "2024-01-20",
      rootCause: "HVAC system malfunction",
      affectedBatches: ["B-2024-001", "B-2024-004"]
    },
    {
      id: "CAPA-2024-002",
      title: "Packaging Line Speed Variation", 
      priority: "Medium",
      status: "In Progress",
      assignee: "Mike Wilson",
      dueDate: "2024-01-18",
      rootCause: "Conveyor belt tension adjustment needed",
      affectedBatches: ["B-2024-002"]
    }
  ]

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Pass": case "Approved": return "compliant"
      case "Fail": case "Rejected": return "non-compliant"
      case "Pending": case "In Progress": case "Conditional": return "pending"
      default: return "default"
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "High": return "non-compliant"
      case "Medium": return "pending"
      case "Low": return "compliant"
      default: return "default"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Quality Assurance & Control</h2>
          <p className="text-muted-foreground">Manage QA stamps, QC testing, and CAPA workflows</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generate CoA
          </Button>
          <Button className="bg-gradient-primary">
            <ShieldCheck className="mr-2 h-4 w-4" />
            New QA Stamp
          </Button>
        </div>
      </div>

      {/* QA/QC Tabs */}
      <Tabs defaultValue="qa-stamps" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="qa-stamps" className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4" />
            <span>QA Stamps</span>
          </TabsTrigger>
          <TabsTrigger value="qc-tests" className="flex items-center space-x-2">
            <FlaskConical className="h-4 w-4" />
            <span>QC Tests</span>
          </TabsTrigger>
          <TabsTrigger value="capa" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>CAPA</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qa-stamps" className="space-y-4">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>QA Stamps & Approvals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stamp ID</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Signer</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qaStamps.map((stamp) => (
                    <TableRow key={stamp.id}>
                      <TableCell className="font-medium">{stamp.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{stamp.batchId}</Badge>
                      </TableCell>
                      <TableCell>{stamp.stage}</TableCell>
                      <TableCell>
                        <StatusBadge variant={getStatusVariant(stamp.decision)}>
                          {stamp.decision}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{stamp.signer}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{stamp.timestamp}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-48 truncate text-sm text-muted-foreground">
                        {stamp.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qc-tests" className="space-y-4">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FlaskConical className="h-5 w-5 text-primary" />
                <span>QC Test Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample ID</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Specification</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Analyst</TableHead>
                    <TableHead>Instrument</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qcTests.map((test) => (
                    <TableRow key={test.sampleId}>
                      <TableCell className="font-medium">{test.sampleId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{test.batchId}</Badge>
                      </TableCell>
                      <TableCell>{test.testName}</TableCell>
                      <TableCell className="font-medium">
                        {test.result === "Pending" ? (
                          <span className="text-muted-foreground">Pending</span>
                        ) : (
                          test.result
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {test.specification}
                      </TableCell>
                      <TableCell>
                        <StatusBadge variant={getStatusVariant(test.status)}>
                          {test.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Microscope className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{test.analyst}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {test.instrument}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capa" className="space-y-4">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <span>CAPA Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {capas.map((capa) => (
                <div key={capa.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-foreground">{capa.id}</h4>
                      <StatusBadge variant={getPriorityVariant(capa.priority)}>
                        {capa.priority}
                      </StatusBadge>
                      <StatusBadge variant={getStatusVariant(capa.status)}>
                        {capa.status}
                      </StatusBadge>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {capa.dueDate}</span>
                    </div>
                  </div>
                  <h5 className="font-medium text-foreground">{capa.title}</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Assignee: </span>
                      <span>{capa.assignee}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Affected Batches: </span>
                      <div className="flex space-x-1 mt-1">
                        {capa.affectedBatches.map((batch) => (
                          <Badge key={batch} variant="outline" className="text-xs">
                            {batch}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Root Cause: </span>
                    <span className="text-sm">{capa.rootCause}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}