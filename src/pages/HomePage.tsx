import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScanLine, Shield, Zap, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/scan");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <ScanLine className="w-16 h-16 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to <span className="text-primary">Scanner Hub</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            The easy way to convert your account into a secure token and login everywhere. 
            Fast, simple, and secure authentication at your fingertips.
          </p>
          
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-6">
            {isAuthenticated ? "Go to Scanner" : "Get Started"}
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Zap className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Scanning</h3>
            <p className="text-muted-foreground">
              Instantly scan and convert your account credentials into secure tokens
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your data is encrypted and protected with industry-standard security
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Globe className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Login Everywhere</h3>
            <p className="text-muted-foreground">
              Use your tokens to seamlessly authenticate across multiple platforms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
