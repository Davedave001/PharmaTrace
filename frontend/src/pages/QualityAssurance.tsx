import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
  ShieldCheck, 
  FlaskConical, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  FileText,
  Microscope,
  User,
  Calendar,
  Wallet
} from "lucide-react"

export default function QualityAssurance() {
  const { toast } = useToast()
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isNewStampOpen, setIsNewStampOpen] = useState(false)
  const [isGeneratingCoa, setIsGeneratingCoa] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isNewQcOpen, setIsNewQcOpen] = useState(false)
  const [isSavingQc, setIsSavingQc] = useState(false)
  const [autoIngestIot, setAutoIngestIot] = useState(false)
  const [isIngesting, setIsIngesting] = useState(false)

  const [newStamp, setNewStamp] = useState({
    id: "",
    batchId: "",
    stage: "Raw Material Release",
    decision: "Approved",
    signer: "",
    timestamp: "",
    notes: ""
  })

  const [coaForm, setCoaForm] = useState({
    product: "",
    batchId: "",
    mfgDate: "",
    expDate: "",
    specifications: "",
    testMethodsResults: "",
    referenceLimits: "",
    qaRep: ""
  })

  const [qaStamps, setQaStamps] = useState([
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
  ])

  const [qcTests, setQcTests] = useState([
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
  ])

  const [newQc, setNewQc] = useState({
    sampleId: "",
    batchId: "",
    testName: "",
    result: "",
    specification: "",
    status: "Pass",
    analyst: "",
    instrument: "",
    completedAt: ""
  })

  const [capas, setCapas] = useState([
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
  ])

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
      } catch (e) {
        // no-op
      }
    }
  }

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      toast({ title: "MetaMask Not Found", description: "Please install MetaMask and connect to Hedera testnet.", variant: "destructive" })
      return
    }
    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts.length > 0) {
        setWalletConnected(true)
        setWalletAddress(accounts[0])
        toast({ title: "Wallet Connected", description: `${accounts[0].slice(0,6)}...${accounts[0].slice(-4)}` })
      }
    } catch (error:any) {
      toast({ title: "Connection Failed", description: error.message || "Failed to connect wallet.", variant: "destructive" })
    } finally {
      setIsConnecting(false)
    }
  }

  const recordQaStampOnChain = async (stamp: typeof newStamp) => {
    const payload = {
      type: "QA_STAMP",
      id: stamp.id,
      batchId: stamp.batchId,
      stage: stamp.stage,
      decision: stamp.decision,
      signer: stamp.signer,
      timestamp: stamp.timestamp,
      notes: stamp.notes
    }
    const contract = await getTraceContract(false)
    const tx = await contract.recordBatch(stamp.batchId, JSON.stringify(payload), stamp.id)
    await tx.wait()
    return tx.hash as string
  }

  const handleCreateQaStamp = async () => {
    if (!walletConnected) {
      toast({ title: "Wallet Not Connected", description: "Connect MetaMask to record on-chain.", variant: "destructive" })
      return
    }
    const required = ["id","batchId","stage","decision","signer","timestamp"]
    const missing = required.filter((k:any)=>!(newStamp as any)[k])
    if (missing.length) {
      toast({ title: "Missing Information", description: `Please fill: ${missing.join(', ')}`, variant: "destructive" })
      return
    }
    setIsRecording(true)
    try {
      const hash = await recordQaStampOnChain(newStamp)
      setQaStamps(prev => [{...newStamp, hederaHash: hash} as any, ...prev])
      toast({ title: "QA Stamp Recorded", description: `Tx: ${hash.slice(0,10)}...` })
      setIsNewStampOpen(false)
      setNewStamp({ id: "", batchId: "", stage: "Raw Material Release", decision: "Approved", signer: "", timestamp: "", notes: "" })
    } catch (error:any) {
      toast({ title: "Error", description: error.message || "Failed to record QA Stamp", variant: "destructive" })
    } finally {
      setIsRecording(false)
    }
  }

  const handleGenerateCoa = async () => {
    if (!walletConnected) {
      toast({ title: "Wallet Not Connected", description: "Connect MetaMask to record on-chain.", variant: "destructive" })
      return
    }
    const required = ["product","batchId","mfgDate","expDate","specifications","testMethodsResults","referenceLimits","qaRep"]
    const missing = required.filter((k:any)=>!(coaForm as any)[k])
    if (missing.length) {
      toast({ title: "Missing Information", description: `Please fill: ${missing.join(', ')}`, variant: "destructive" })
      return
    }
    setIsGeneratingCoa(true)
    try {
      const payload = { type: "COA", ...coaForm, generatedAt: new Date().toISOString() }
      const contract = await getTraceContract(false)
      const tx = await contract.recordBatch(coaForm.batchId, JSON.stringify(payload), `COA-${coaForm.batchId}`)
      await tx.wait()
      const text = `Certificate of Analysis\n\nProduct: ${coaForm.product}\nBatch: ${coaForm.batchId}\nManufacture Date: ${coaForm.mfgDate}\nExpiry Date: ${coaForm.expDate}\n\nSpecifications Met:\n${coaForm.specifications}\n\nTest Methods & Results:\n${coaForm.testMethodsResults}\n\nReference / Limit Values:\n${coaForm.referenceLimits}\n\nAuthorized By: ${coaForm.qaRep}\nTransaction: ${tx.hash}\n`
      const blob = new Blob([text], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `COA_${coaForm.batchId}.txt`
      a.click()
      window.URL.revokeObjectURL(url)
      toast({ title: "CoA Generated", description: `Tx: ${tx.hash.slice(0,10)}...` })
    } catch (error:any) {
      toast({ title: "Error Generating CoA", description: error.message || "Failed to generate CoA", variant: "destructive" })
    } finally {
      setIsGeneratingCoa(false)
    }
  }

  const handleCreateQcTest = async () => {
    if (!walletConnected) {
      toast({ title: "Wallet Not Connected", description: "Connect MetaMask to record on-chain.", variant: "destructive" })
      return
    }
    const required = ["sampleId","batchId","testName","result","specification","status","analyst","instrument"]
    const missing = required.filter((k:any)=>!(newQc as any)[k])
    if (missing.length) {
      toast({ title: "Missing Information", description: `Please fill: ${missing.join(', ')}`, variant: "destructive" })
      return
    }
    setIsSavingQc(true)
    try {
      const payload = { type: "QC_TEST", ...newQc }
      const contract = await getTraceContract(false)
      const tx = await contract.recordBatch(newQc.batchId, JSON.stringify(payload), newQc.sampleId)
      await tx.wait()
      const toInsert = { ...newQc }
      setQcTests(prev => [{
        sampleId: toInsert.sampleId,
        batchId: toInsert.batchId,
        testName: toInsert.testName,
        result: toInsert.result,
        specification: toInsert.specification,
        status: toInsert.status,
        analyst: toInsert.analyst,
        completedAt: toInsert.completedAt || new Date().toISOString(),
        instrument: toInsert.instrument
      }, ...prev])
      toast({ title: "QC Test Recorded", description: `Tx: ${tx.hash.slice(0,10)}...` })
      setIsNewQcOpen(false)
      setNewQc({ sampleId: "", batchId: "", testName: "", result: "", specification: "", status: "Pass", analyst: "", instrument: "", completedAt: "" })
    } catch (error:any) {
      toast({ title: "Error Recording QC Test", description: error.message || "Failed to record QC test", variant: "destructive" })
    } finally {
      setIsSavingQc(false)
    }
  }

  // CAPA: IoT ingestion and on-chain storage
  const recordCapaOnChain = async (capa:any) => {
    const payload = { type: "CAPA", source: "IOT", ...capa }
    const batchKey = (capa.affectedBatches && capa.affectedBatches[0]) || "BATCH"
    const contract = await getTraceContract(false)
    const tx = await contract.recordBatch(batchKey, JSON.stringify(payload), capa.id)
    await tx.wait()
    return tx.hash as string
  }

  const ingestIotCapaEvent = async (event:any) => {
    setIsIngesting(true)
    try {
      const hash = await recordCapaOnChain(event)
      setCapas(prev => [event, ...prev])
      toast({ title: "CAPA Ingested", description: `Tx: ${hash.slice(0,10)}...` })
    } catch (error:any) {
      toast({ title: "CAPA Ingest Failed", description: error.message || "Failed to ingest IoT CAPA", variant: "destructive" })
    } finally {
      setIsIngesting(false)
    }
  }

  // Simple IoT simulator for demo purposes
  useEffect(() => {
    if (!autoIngestIot) return
    const interval = setInterval(() => {
      const now = new Date()
      const id = `CAPA-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}`
      const templates = [
        {
          id,
          title: "Temperature Deviation in Storage",
          priority: "High",
          status: "Open",
          assignee: "Dr. Sarah Johnson",
          dueDate: new Date(now.getTime()+5*24*60*60*1000).toISOString().slice(0,10),
          rootCause: "HVAC system malfunction",
          affectedBatches: ["B-2024-001", "B-2024-004"],
        },
        {
          id,
          title: "Packaging Line Speed Variation",
          priority: "Medium",
          status: "In Progress",
          assignee: "Mike Wilson",
          dueDate: new Date(now.getTime()+3*24*60*60*1000).toISOString().slice(0,10),
          rootCause: "Conveyor belt tension adjustment needed",
          affectedBatches: ["B-2024-002"],
        }
      ]
      const evt = templates[Math.floor(Math.random()*templates.length)]
      ingestIotCapaEvent(evt)
    }, 15000) // every 15s
    return () => clearInterval(interval)
  }, [autoIngestIot])

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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate CoA
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Generate Certificate of Analysis</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="coa-product">Product *</Label>
                    <Input id="coa-product" value={coaForm.product} onChange={(e)=>setCoaForm(p=>({...p, product: e.target.value}))} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="coa-batch">Batch *</Label>
                    <Input id="coa-batch" value={coaForm.batchId} onChange={(e)=>setCoaForm(p=>({...p, batchId: e.target.value}))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="coa-mfg">Manufacture Date *</Label>
                    <Input id="coa-mfg" type="date" value={coaForm.mfgDate} onChange={(e)=>setCoaForm(p=>({...p, mfgDate: e.target.value}))} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="coa-exp">Expiry Date *</Label>
                    <Input id="coa-exp" type="date" value={coaForm.expDate} onChange={(e)=>setCoaForm(p=>({...p, expDate: e.target.value}))} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="coa-specs">Specifications Met *</Label>
                  <Textarea id="coa-specs" value={coaForm.specifications} onChange={(e)=>setCoaForm(p=>({...p, specifications: e.target.value}))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="coa-tests">Test Methods & Results *</Label>
                  <Textarea id="coa-tests" value={coaForm.testMethodsResults} onChange={(e)=>setCoaForm(p=>({...p, testMethodsResults: e.target.value}))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="coa-limits">Reference / Limit Values *</Label>
                  <Textarea id="coa-limits" value={coaForm.referenceLimits} onChange={(e)=>setCoaForm(p=>({...p, referenceLimits: e.target.value}))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="coa-qa">QA Representative *</Label>
                  <Input id="coa-qa" value={coaForm.qaRep} onChange={(e)=>setCoaForm(p=>({...p, qaRep: e.target.value}))} />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleGenerateCoa} disabled={isGeneratingCoa} className="bg-gradient-primary">{isGeneratingCoa?"Generating...":"Generate CoA"}</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isNewStampOpen} onOpenChange={setIsNewStampOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <ShieldCheck className="mr-2 h-4 w-4" />
                New QA Stamp
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Record New QA Stamp</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stamp-id">Stamp ID *</Label>
                    <Input id="stamp-id" value={newStamp.id} onChange={(e)=>setNewStamp(p=>({...p, id: e.target.value}))} placeholder="e.g., QA-004" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stamp-batch">Batch *</Label>
                    <Input id="stamp-batch" value={newStamp.batchId} onChange={(e)=>setNewStamp(p=>({...p, batchId: e.target.value}))} placeholder="e.g., B-2024-005" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Stage *</Label>
                    <Select value={newStamp.stage} onValueChange={(v)=>setNewStamp(p=>({...p, stage: v}))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Raw Material Release">Raw Material Release</SelectItem>
                        <SelectItem value="In-Process Control">In-Process Control</SelectItem>
                        <SelectItem value="Final Product Release">Final Product Release</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Decision *</Label>
                    <Select value={newStamp.decision} onValueChange={(v)=>setNewStamp(p=>({...p, decision: v}))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Conditional">Conditional</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stamp-signer">Signer *</Label>
                    <Input id="stamp-signer" value={newStamp.signer} onChange={(e)=>setNewStamp(p=>({...p, signer: e.target.value}))} placeholder="e.g., Dr. Sarah Johnson" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stamp-time">Timestamp *</Label>
                    <Input id="stamp-time" type="datetime-local" value={newStamp.timestamp} onChange={(e)=>setNewStamp(p=>({...p, timestamp: e.target.value.replace('T',' ')}))} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stamp-notes">Notes</Label>
                  <Textarea id="stamp-notes" value={newStamp.notes} onChange={(e)=>setNewStamp(p=>({...p, notes: e.target.value}))} />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={()=>setIsNewStampOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateQaStamp} disabled={isRecording} className="bg-gradient-primary">{isRecording?"Recording...":"Record QA Stamp"}</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isNewQcOpen} onOpenChange={setIsNewQcOpen}>
            <DialogTrigger asChild>
              <Button>
                <FlaskConical className="mr-2 h-4 w-4" />
                New QC Test
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Record New QC Test</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="qc-sample">Sample ID *</Label>
                    <Input id="qc-sample" value={newQc.sampleId} onChange={(e)=>setNewQc(p=>({...p, sampleId: e.target.value}))} placeholder="e.g., S-2024-0160" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="qc-batch">Batch *</Label>
                    <Input id="qc-batch" value={newQc.batchId} onChange={(e)=>setNewQc(p=>({...p, batchId: e.target.value}))} placeholder="e.g., B-2024-005" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="qc-test">Test *</Label>
                  <Input id="qc-test" value={newQc.testName} onChange={(e)=>setNewQc(p=>({...p, testName: e.target.value}))} placeholder="e.g., API Purity (HPLC)" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="qc-result">Result *</Label>
                    <Input id="qc-result" value={newQc.result} onChange={(e)=>setNewQc(p=>({...p, result: e.target.value}))} placeholder="e.g., 98.7%" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="qc-spec">Specification *</Label>
                    <Input id="qc-spec" value={newQc.specification} onChange={(e)=>setNewQc(p=>({...p, specification: e.target.value}))} placeholder="e.g., ≥98.0%" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Status *</Label>
                    <Select value={newQc.status} onValueChange={(v)=>setNewQc(p=>({...p, status: v}))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pass">Pass</SelectItem>
                        <SelectItem value="Fail">Fail</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="qc-analyst">Analyst *</Label>
                    <Input id="qc-analyst" value={newQc.analyst} onChange={(e)=>setNewQc(p=>({...p, analyst: e.target.value}))} placeholder="e.g., Dr. Emily Zhang" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="qc-instrument">Instrument *</Label>
                    <Input id="qc-instrument" value={newQc.instrument} onChange={(e)=>setNewQc(p=>({...p, instrument: e.target.value}))} placeholder="e.g., HPLC-001" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="qc-completed">Completed At</Label>
                    <Input id="qc-completed" type="datetime-local" value={newQc.completedAt} onChange={(e)=>setNewQc(p=>({...p, completedAt: e.target.value}))} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={()=>setIsNewQcOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateQcTest} disabled={isSavingQc} className="bg-gradient-primary">{isSavingQc?"Recording...":"Record QC Test"}</Button>
              </div>
            </DialogContent>
          </Dialog>
          {!walletConnected && (
            <Button onClick={handleConnectWallet} disabled={isConnecting}>
              <Wallet className="mr-2 h-4 w-4" /> {isConnecting?"Connecting...":"Connect Wallet"}
            </Button>
          )}
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
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={()=>setAutoIngestIot(v=>!v)}>
                  {autoIngestIot?"Stop IoT Auto-Ingest":"Start IoT Auto-Ingest"}
                </Button>
                <Button onClick={()=>ingestIotCapaEvent({
                  id: `CAPA-${Date.now()}`,
                  title: "Temperature Deviation in Storage",
                  priority: "High",
                  status: "Open",
                  assignee: "Dr. Sarah Johnson",
                  dueDate: new Date(Date.now()+5*24*60*60*1000).toISOString().slice(0,10),
                  rootCause: "HVAC system malfunction",
                  affectedBatches: ["B-2024-001", "B-2024-004"],
                })} disabled={isIngesting}>
                  {isIngesting?"Ingesting...":"Simulate IoT Event"}
                </Button>
              </div>
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
                        {capa.affectedBatches.map((batch:string) => (
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