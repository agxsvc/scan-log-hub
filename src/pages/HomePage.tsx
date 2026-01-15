import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScanLine, Shield, Zap, Globe, ArrowRight } from "lucide-react";
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

  const features = [
    {
      icon: Zap,
      title: "Fast Scanning",
      description: "Instantly scan and convert your account credentials into secure tokens",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and protected with industry-standard security",
    },
    {
      icon: Globe,
      title: "Login Everywhere",
      description: "Use your tokens to seamlessly authenticate across multiple platforms",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated Neon Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full animate-pulse" />
              <div className="relative p-5 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 backdrop-blur-sm">
                <ScanLine className="w-14 h-14 text-primary" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Welcome to Scanner Hub
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            The easy way to convert your account into a secure token and login everywhere. 
            Fast, simple, and secure authentication at your fingertips.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleGetStarted} 
            className="text-lg px-8 py-6 group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isAuthenticated ? "Go to Scanner" : "Get Started"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Card */}
              <div className="relative h-full p-8 rounded-2xl border border-primary/10 bg-card/50 backdrop-blur-md hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-4 rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center animate-fade-in [animation-delay:500ms]">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <button 
              onClick={() => navigate("/login")}
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
