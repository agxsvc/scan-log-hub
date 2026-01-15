import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import HistoryList from "@/components/HistoryList";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface HistoryItem {
  id: string;
  name: string;
  email: string;
  accountId: string;
  timestamp: string;
  avatar?: string;
  scannedBy?: string;
  scannedByName?: string;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { user } = useAuth();

  const loadHistory = () => {
    const stored = localStorage.getItem("scanHistory");
    if (stored && user) {
      const allHistory: HistoryItem[] = JSON.parse(stored);
      // Filter by current user
      const userHistory = allHistory.filter(item => item.scannedBy === user.id);
      setHistory(userHistory);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  const clearHistory = () => {
    if (!user) return;
    // Only clear current user's history
    const stored = localStorage.getItem("scanHistory");
    if (stored) {
      const allHistory: HistoryItem[] = JSON.parse(stored);
      const otherUsersHistory = allHistory.filter(item => item.scannedBy !== user.id);
      localStorage.setItem("scanHistory", JSON.stringify(otherUsersHistory));
    }
    setHistory([]);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My History</h1>
            <p className="text-muted-foreground mt-2">
              {user?.name}'s scanned accounts ({history.length})
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
