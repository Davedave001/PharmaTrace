import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getTraceContract } from "@/services/traceContract"
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
  Package,
  Wallet,
  AlertTriangle
} from "lucide-react"

export default function Batches() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewBatchOpen, setIsNewBatchOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [batchForm, setBatchForm] = useState({
    batchId: '',
    product: '',
    status: 'In Production',
    qaStatus: 'Pending',
    progress: 0,
    startDate: '',
    operator: '',
    upstreamRef: '',
    qaResult: '',
    serialNumber: ''
  })

  const [batches, setBatches] = useState([
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
  ])

  // Check wallet connection on component mount
  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setWalletConnected(true)
          setWalletAddress(accounts[0])
        }
      } catch (error) {
        console.log("Error checking wallet connection:", error)
      }
    }
  }

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask and connect to Hedera testnet.",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (accounts.length > 0) {
        setWalletConnected(true)
        setWalletAddress(accounts[0])
        toast({
          title: "Wallet Connected!",
          description: `Connected to address: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        })
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleNewBatch = async () => {
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your MetaMask wallet to record batches on the blockchain.",
        variant: "destructive",
      })
      return
    }

    // Validate required fields
    const requiredFields = ['batchId', 'product', 'startDate', 'operator', 'upstreamRef', 'qaResult', 'serialNumber']
    const missingFields = requiredFields.filter(field => !batchForm[field])
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      })
      return
    }

    setIsRecording(true)
    try {
      const contract = await getTraceContract(false)
      const tx = await contract.recordBatch(
        batchForm.batchId,
        batchForm.qaResult,
        batchForm.serialNumber
      )
      
      toast({
        title: "Recording Batch...",
        description: "Transaction submitted to Hedera blockchain.",
      })

      await tx.wait()
      
      // Add new batch to the list
      const newBatch = {
        id: batchForm.batchId,
        product: batchForm.product,
        status: batchForm.status,
        startDate: batchForm.startDate,
        operator: batchForm.operator,
        upstreamRef: batchForm.upstreamRef,
        progress: batchForm.progress,
        qaStatus: batchForm.qaStatus,
        hederaHash: tx.hash
      }

      setBatches(prev => [newBatch, ...prev])
      
      toast({
        title: "Batch Recorded Successfully!",
        description: `Batch ${batchForm.batchId} has been recorded on Hedera blockchain.`,
      })

      // Reset form and close modal
      setBatchForm({
        batchId: '',
        product: '',
        status: 'In Production',
        qaStatus: 'Pending',
        progress: 0,
        startDate: '',
        operator: '',
        upstreamRef: '',
        qaResult: '',
        serialNumber: ''
      })
      setIsNewBatchOpen(false)
      
    } catch (error) {
      console.error("Error recording batch:", error)
      toast({
        title: "Error Recording Batch",
        description: error.message || "Failed to record batch on blockchain.",
        variant: "destructive",
      })
    } finally {
      setIsRecording(false)
    }
  }

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

  const handleExport = () => {
    const csvContent = [
      ['Batch ID', 'Product', 'Status', 'QA Status', 'Progress', 'Start Date', 'Operator', 'Upstream Ref', 'Hedera Hash'],
      ...batches.map(batch => [
        batch.id,
        batch.product,
        batch.status,
        batch.qaStatus,
        `${batch.progress}%`,
        batch.startDate,
        batch.operator,
        batch.upstreamRef,
        batch.hederaHash
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'batch-management-export.csv'
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Successful",
      description: "Batch data exported to CSV file.",
    })
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
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          
          {!walletConnected ? (
            <Button onClick={handleConnectWallet} disabled={isConnecting} className="bg-gradient-primary">
              <Wallet className="mr-2 h-4 w-4" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Badge>
              <Dialog open={isNewBatchOpen} onOpenChange={setIsNewBatchOpen}>
                <DialogTrigger asChild>
          <Button className="bg-gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Batch
          </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Record New Batch on Hedera</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="batchId">Batch ID *</Label>
                        <Input
                          id="batchId"
                          placeholder="e.g., B-2024-005"
                          value={batchForm.batchId}
                          onChange={(e) => setBatchForm(prev => ({ ...prev, batchId: e.target.value }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="product">Product *</Label>
                        <Input
                          id="product"
                          placeholder="e.g., Amoxicillin 500mg"
                          value={batchForm.product}
                          onChange={(e) => setBatchForm(prev => ({ ...prev, product: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={batchForm.status} onValueChange={(value) => setBatchForm(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="In Production">In Production</SelectItem>
                            <SelectItem value="QC Testing">QC Testing</SelectItem>
                            <SelectItem value="Packaging">Packaging</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="qaStatus">QA Status</Label>
                        <Select value={batchForm.qaStatus} onValueChange={(value) => setBatchForm(prev => ({ ...prev, qaStatus: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Review">In Review</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="progress">Progress (%)</Label>
                        <Input
                          id="progress"
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0"
                          value={batchForm.progress}
                          onChange={(e) => setBatchForm(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={batchForm.startDate}
                          onChange={(e) => setBatchForm(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="operator">Operator *</Label>
                        <Input
                          id="operator"
                          placeholder="e.g., John Doe"
                          value={batchForm.operator}
                          onChange={(e) => setBatchForm(prev => ({ ...prev, operator: e.target.value }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="upstreamRef">Upstream Ref *</Label>
                        <Input
                          id="upstreamRef"
                          placeholder="e.g., API-2024-0047"
                          value={batchForm.upstreamRef}
                          onChange={(e) => setBatchForm(prev => ({ ...prev, upstreamRef: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="qaResult">QA Result *</Label>
                      <Textarea
                        id="qaResult"
                        placeholder="e.g., Pass - All quality parameters within specification"
                        value={batchForm.qaResult}
                        onChange={(e) => setBatchForm(prev => ({ ...prev, qaResult: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="serialNumber">Serial Number *</Label>
                      <Input
                        id="serialNumber"
                        placeholder="e.g., SN-2024-001234"
                        value={batchForm.serialNumber}
                        onChange={(e) => setBatchForm(prev => ({ ...prev, serialNumber: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsNewBatchOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleNewBatch} 
                      disabled={isRecording}
                      className="bg-gradient-primary"
                    >
                      {isRecording ? "Recording..." : "Record on Blockchain"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Connection Warning */}
      {!walletConnected && (
        <Card className="border-warning bg-warning/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-sm text-warning">
                Connect your MetaMask wallet to Hedera testnet to record batches on the blockchain.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-muted-foreground"
                        onClick={() => window.open(`https://hashscan.io/testnet/transaction/${batch.hederaHash}`, '_blank')}
                      >
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