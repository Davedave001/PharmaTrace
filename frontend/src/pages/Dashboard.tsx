import { MetricCard } from "@/components/ui/metric-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getTraceContract } from "@/services/traceContract"
import { getSignerIfAvailable } from "@/lib/web3"
import { 
  Factory, 
  FlaskConical, 
  ShieldCheck, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Plus,
  Wallet
} from "lucide-react"
import { useState, useEffect } from "react"

export default function Dashboard() {
  const { toast } = useToast()
  const [isNewBatchOpen, setIsNewBatchOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [batchForm, setBatchForm] = useState({
    batchId: '',
    qaResult: '',
    serialNumber: ''
  })

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

    if (!batchForm.batchId || !batchForm.qaResult || !batchForm.serialNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields: Batch ID, QA Result, and Serial Number.",
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
      
      toast({
        title: "Batch Recorded Successfully!",
        description: `Batch ${batchForm.batchId} has been recorded on Hedera blockchain.`,
      })

      // Reset form and close modal
      setBatchForm({ batchId: '', qaResult: '', serialNumber: '' })
      setIsNewBatchOpen(false)
      
      // Refresh the page to show new batch
      window.location.reload()
      
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
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Record New Batch on Hedera</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="batchId">Batch ID *</Label>
                      <Input
                        id="batchId"
                        placeholder="e.g., B-2024-004"
                        value={batchForm.batchId}
                        onChange={(e) => setBatchForm(prev => ({ ...prev, batchId: e.target.value }))}
                      />
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