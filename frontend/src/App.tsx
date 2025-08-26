import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Batches from "./pages/Batches";
import QualityAssurance from "./pages/QualityAssurance";
import AuditTrail from "./pages/AuditTrail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/batches" element={
            <div className="min-h-screen bg-background">
              <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">M</span>
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-foreground">PharmaTrace</h1>
                        <p className="text-xs text-muted-foreground">MES + LIMS + QA/QC on Hedera</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Batches />
            </div>
          } />
          <Route path="/qa" element={
            <div className="min-h-screen bg-background">
              <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">M</span>
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-foreground">PharmaTrace</h1>
                        <p className="text-xs text-muted-foreground">MES + LIMS + QA/QC on Hedera</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <QualityAssurance />
            </div>
          } />
          <Route path="/audit" element={
            <div className="min-h-screen bg-background">
              <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">M</span>
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-foreground">PharmaTrace</h1>
                        <p className="text-xs text-muted-foreground">MES + LIMS + QA/QC on Hedera</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <AuditTrail />
            </div>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
