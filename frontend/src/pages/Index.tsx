import { Header } from "@/components/layout/header"
import Dashboard from "./Dashboard"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
