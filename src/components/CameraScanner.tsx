import { useRef, useState, useEffect, useCallback } from "react";
import { Camera, SwitchCamera, CheckCircle2, XCircle, Download, RefreshCw, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type ScanStatus = "idle" | "scanning" | "success" | "error";

interface ScanResult {
  name: string;
  email: string;
  accountId: string;
  timestamp: string;
}

interface CameraScannerProps {
  onScanSuccess?: (result: ScanResult) => void;
}

const CameraScanner = ({ onScanSuccess }: CameraScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLaptop, setIsLaptop] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string>("");
  const [cameraActive, setCameraActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user, decreaseBalance } = useAuth();

  // Detect device type
  useEffect(() => {
    const checkDeviceType = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsLaptop(!isMobile);
      if (!isMobile) {
        setFacingMode("user");
      }
    };
    checkDeviceType();
  }, []);

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);
      setStatus("scanning");
      setError("");
    } catch (err) {
      console.error("Camera error:", err);
      setError("Failed to access camera. Please grant permission.");
      setStatus("error");
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setStatus("idle");
  }, []);

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
  }, [facingMode, cameraActive, startCamera]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const simulateScan = async () => {
    if (user && user.balance <= 0) {
      setError("Insufficient balance. Please top up your credits.");
      setStatus("error");
      return;
    }

    setStatus("scanning");
    
    try {
      const mockApiCall = new Promise<ScanResult>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.2) {
            resolve({
              name: "John Doe",
              email: "john.doe@example.com",
              accountId: `ACC-${Date.now()}`,
              timestamp: new Date().toISOString(),
            });
          } else {
            reject(new Error("QR Code not recognized"));
          }
        }, 2000);
      });

      // Example of how to call external API:
      // const response = await fetch('https://your-api.com/scan', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ scanData: capturedImageData }),
      // });
      // const result = await response.json();

      const result = await mockApiCall;
      setScanResult(result);
      setStatus("success");
      decreaseBalance(); // Decrease balance by 1 on success
      onScanSuccess?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
      setStatus("error");
    }
  };

  const downloadResult = () => {
    if (!scanResult) return;

    const content = `Account Created Successfully
========================
Name: ${scanResult.name}
Email: ${scanResult.email}
Account ID: ${scanResult.accountId}
Created At: ${scanResult.timestamp}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `account-${scanResult.accountId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyResult = async () => {
    if (!scanResult) return;

    const content = `Account Created Successfully
========================
Name: ${scanResult.name}
Email: ${scanResult.email}
Account ID: ${scanResult.accountId}
Created At: ${scanResult.timestamp}
Scanned By: ${user?.name || "Unknown"}
`;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Data copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy data");
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError("");
    setCopied(false);
    setStatus(cameraActive ? "scanning" : "idle");
  };

  return (
    <div className="space-y-6">
      {/* Balance Warning */}
      {user && user.balance <= 5 && user.balance > 0 && (
        <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500 text-sm border border-yellow-500/20">
          ⚠️ Low balance: {user.balance} credits remaining
        </div>
      )}
      {user && user.balance === 0 && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
          ❌ No credits remaining. Please top up to continue scanning.
        </div>
      )}

      {/* Camera Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <Select
          value={facingMode}
          onValueChange={(value: "user" | "environment") => setFacingMode(value)}
        >
          <SelectTrigger className="w-48 bg-secondary border-border">
            <SelectValue placeholder="Select Camera" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Front Camera</SelectItem>
            <SelectItem value="environment">Back Camera</SelectItem>
          </SelectContent>
        </Select>

        {!isLaptop && (
          <Button variant="outline" onClick={switchCamera} className="gap-2">
            <SwitchCamera className="w-4 h-4" />
            Switch
          </Button>
        )}

        {isLaptop && (
          <span className="text-sm text-muted-foreground">
            📍 Laptop detected - using webcam
          </span>
        )}
      </div>

      {/* Scanner Box - Now Square */}
      <div
        className={cn(
          "relative rounded-xl overflow-hidden scanner-box",
          status === "success" && "success animate-pulse-success",
          status === "error" && "error animate-shake"
        )}
      >
        <div className="aspect-square max-w-md mx-auto bg-secondary/50 relative">
          {!cameraActive ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Camera className="w-16 h-16 text-muted-foreground" />
              <Button onClick={startCamera} className="gap-2" disabled={user?.balance === 0}>
                <Camera className="w-4 h-4" />
                Start Camera
              </Button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              {status === "scanning" && (
                <div className="absolute inset-4 border-2 border-primary rounded-lg">
                  <div className="scan-line absolute left-0 right-0 h-1 bg-primary/80 rounded" />
                </div>
              )}
              {status === "success" && (
                <div className="absolute inset-0 bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="w-24 h-24 text-success animate-bounce" />
                </div>
              )}
              {status === "error" && (
                <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                  <XCircle className="w-24 h-24 text-destructive" />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {cameraActive && (
        <div className="flex flex-wrap gap-3 justify-center">
          <Button 
            onClick={simulateScan} 
            disabled={status === "scanning" || user?.balance === 0} 
            className="gap-2"
          >
            {status === "scanning" ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                Capture & Scan
              </>
            )}
          </Button>
          <Button variant="outline" onClick={stopCamera}>
            Stop Camera
          </Button>
          {(status === "success" || status === "error") && (
            <Button variant="secondary" onClick={resetScanner}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      )}

      {/* Result Box */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Scan Result</h3>
        
        {status === "idle" && (
          <p className="text-muted-foreground">Start camera and scan to see results here.</p>
        )}

        {status === "scanning" && (
          <div className="flex items-center gap-3 text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Waiting for scan...</span>
          </div>
        )}

        {status === "success" && scanResult && (
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{scanResult.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{scanResult.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Account ID</span>
                <span className="font-mono text-primary">{scanResult.accountId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Created At</span>
                <span className="font-medium">
                  {new Date(scanResult.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Scanned By</span>
                <span className="font-medium text-primary">{user?.name || "Unknown"}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={copyResult} variant="outline" className="flex-1 gap-2">
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Data
                  </>
                )}
              </Button>
              <Button onClick={downloadResult} className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                Download TXT
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-4">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
            <p className="text-destructive font-medium">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please try scanning again
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraScanner;
