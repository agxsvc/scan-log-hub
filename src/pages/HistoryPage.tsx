import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import HistoryList from "@/components/HistoryList";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryItem {
  id: string;
  name: string;
  email: string;
  accountId: string;
  timestamp: string;
  avatar?: string;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const loadHistory = () => {
    const stored = localStorage.getItem("scanHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("scanHistory");
    setHistory([]);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">History</h1>
            <p className="text-muted-foreground mt-2">
              Successfully created accounts ({history.length})
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={loadHistory}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            {history.length > 0 && (
              <Button variant="destructive" onClick={clearHistory}>
                Clear All
              </Button>
            )}
          </div>
        </div>
        <HistoryList items={history} />
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
