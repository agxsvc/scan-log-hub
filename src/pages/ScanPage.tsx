import DashboardLayout from "@/components/DashboardLayout";
import CameraScanner from "@/components/CameraScanner";
import { useAuth } from "@/contexts/AuthContext";

interface ScanResult {
  name: string;
  email: string;
  accountId: string;
  timestamp: string;
}

const ScanPage = () => {
  const { user } = useAuth();

  const handleScanSuccess = (result: ScanResult) => {
    if (!user) return;
    
    // Store in localStorage with user association
    const history = JSON.parse(localStorage.getItem("scanHistory") || "[]");
    const newItem = {
      id: result.accountId,
      ...result,
      scannedBy: user.id,
      scannedByName: user.name,
    };
    localStorage.setItem("scanHistory", JSON.stringify([newItem, ...history]));
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Scanner</h1>
          <p className="text-muted-foreground mt-2">
            Scan QR codes or barcodes to create accounts
          </p>
        </div>
        <CameraScanner onScanSuccess={handleScanSuccess} />
      </div>
    </DashboardLayout>
  );
};

export default ScanPage;
