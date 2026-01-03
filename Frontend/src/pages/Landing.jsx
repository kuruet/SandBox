import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Upload, 
  CheckCircle, 
  FileText, 
  Shield, 
  Clock, 
  Users, 
  Zap,
  Lock,
  Eye,
  Coffee,
  Printer,
  Building2,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

  


// Reusable Button Component
const Button = ({ children, variant = 'primary', size = 'md', onClick, className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'text-white hover:opacity-90 focus:ring-blue-500',
    secondary: 'border-2 hover:bg-opacity-10 focus:ring-blue-500',
    gradient: 'text-white hover:opacity-90'
  };
  
  const sizes = {
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const primaryBg = { backgroundColor: '#2563EB' };
  const secondaryStyles = { 
    borderColor: '#2563EB', 
    color: '#2563EB',
    backgroundColor: 'transparent'
  };
  const gradientBg = { background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' };

 

     
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={variant === 'primary' ? primaryBg : variant === 'gradient' ? gradientBg : secondaryStyles}
    >
      {children}
    </button>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, dark = false }) => {
  return (
    <div 
      className="p-6 rounded-lg border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      style={{ 
        backgroundColor: dark ? 'rgba(15, 23, 42, 0.5)' : '#FFFFFF',
        borderColor: dark ? 'rgba(37, 99, 235, 0.3)' : '#E5E7EB'
      }}
      onMouseEnter={(e) => {
        if (dark) {
          e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.5)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (dark) {
          e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: dark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF' }}
      >
        <Icon className="w-6 h-6" style={{ color: '#2563EB' }} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: dark ? '#FFFFFF' : '#111827' }}>
        {title}
      </h3>
      <p className="text-sm" style={{ color: dark ? '#9CA3AF' : '#6B7280' }}>
        {description}
      </p>
    </div>
  );
};

// Step Component
const Step = ({ number, title, description, tinted = false }) => {
  return (
    <div 
      className="flex flex-col items-center text-center p-6 rounded-lg transition-all duration-200"
      style={{ backgroundColor: tinted ? 'rgba(239, 246, 255, 0.5)' : '#FFFFFF' }}
    >
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 font-bold text-xl"
        style={{ 
          backgroundColor: '#EFF6FF',
          color: '#2563EB'
        }}
      >
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: '#111827' }}>
        {title}
      </h3>
      <p className="text-sm" style={{ color: '#6B7280' }}>
        {description}
      </p>
    </div>
  );
};

// Use Case Card Component
const UseCaseCard = ({ icon: Icon, title }) => {
  return (
    <div 
      className="p-6 rounded-lg border text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{ 
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB'
      }}
    >
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
        style={{ backgroundColor: '#F9FAFB' }}
      >
        <Icon className="w-6 h-6" style={{ color: '#7C3AED' }} />
      </div>
      <h3 className="font-medium" style={{ color: '#111827' }}>
        {title}
      </h3>
    </div>
  );
};

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

     const navigate = useNavigate();


  return (
    <div>
      {/* Navigation */}
      <nav 
        className="sticky top-0 z-50 border-b backdrop-blur-sm"
        style={{ 
          backgroundColor: 'rgba(11, 15, 26, 0.95)',
          borderColor: 'rgba(37, 99, 235, 0.2)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-8 h-8" style={{ color: '#2563EB' }} />
            <span className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>
              SandBox
            </span>
          </div>
          <button
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: '#FFFFFF' }}
            onClick={() => navigate('/register')}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section - DARK WITH GRADIENT */}
      <section 
        className="relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(180deg, #0B0F1A 0%, #0F172A 100%)'
        }}
      >
        {/* Subtle radial glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.08) 0%, rgba(124, 58, 237, 0.05) 50%, transparent 100%)'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div 
            className={`text-center transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h1 
              className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ color: '#FFFFFF' }}
            >
              Scan. Select. Send.
            </h1>
            <p 
              className="text-xl lg:text-2xl mb-10 max-w-3xl mx-auto"
              style={{ color: '#9CA3AF' }}
            >
              QR-based file sharing for shops and service counters. Zero friction, instant delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
  variant="gradient"
  size="lg"
  onClick={() => navigate('/login')}
>
  Get Started
  <ChevronRight className="w-5 h-5 ml-1" />
</Button>

              <Button 
              onClick={() => navigate('/login')}
                variant="secondary" 
                size="lg"
                className="border-white text-white hover:bg-white hover:bg-opacity-10"
              >
                See How It Works
              </Button>
            </div>
            
            {/* Hero Visual */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div 
                className="rounded-lg border p-12 flex items-center justify-center backdrop-blur-sm"
                style={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  borderColor: 'rgba(37, 99, 235, 0.3)'
                }}
              >
                <div className="grid grid-cols-3 gap-8 items-center">
                  <div className="flex flex-col items-center">
                    <QrCode className="w-24 h-24 mb-3" style={{ color: '#2563EB' }} />
                    <span className="text-sm" style={{ color: '#9CA3AF' }}>Scan</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Upload className="w-24 h-24 mb-3" style={{ color: '#7C3AED' }} />
                    <span className="text-sm" style={{ color: '#9CA3AF' }}>Upload</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CheckCircle className="w-24 h-24 mb-3" style={{ color: '#2563EB' }} />
                    <span className="text-sm" style={{ color: '#9CA3AF' }}>Done</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution Section - LIGHT RESET */}
      <section 
        className="py-20"
        style={{ backgroundColor: '#F9FAFB' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Problems */}
            <div>
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#111827' }}>
                The old way is broken
              </h2>
              <div className="space-y-6">
                {[
                  { icon: FileText, label: 'File confusion across channels' },
                  { icon: Users, label: 'WhatsApp and email chaos' },
                  { icon: Eye, label: 'No delivery confirmation' },
                  { icon: Lock, label: 'Privacy and security concerns' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <item.icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
                    <span style={{ color: '#6B7280' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div>
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#111827' }}>
                Built for real-world operations
              </h2>
              <div className="space-y-6">
                {[
                  { icon: QrCode, label: 'One QR code per location' },
                  { icon: Shield, label: 'Vendor-only file access' },
                  { icon: Eye, label: 'Instant upload visibility' },
                  { icon: CheckCircle, label: 'Real-time status tracking' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <item.icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#2563EB' }} />
                    <span style={{ color: '#111827' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - BRAND TINTED BACKGROUND */}
      <section 
        className="py-20"
        style={{ backgroundColor: 'rgba(239, 246, 255, 0.3)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ color: '#111827' }}>
            How it works
          </h2>
          <p className="text-center mb-16" style={{ color: '#6B7280' }}>
            Three simple steps. No app installation required.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Step 
              number="1"
              title="Scan QR code"
              description="Customer scans the QR code displayed at your counter"
              tinted={false}
            />
            <Step 
              number="2"
              title="Upload files"
              description="Select and upload files directly from their device"
              tinted={true}
            />
            <Step 
              number="3"
              title="Vendor receives"
              description="Files appear instantly in your dashboard for processing"
              tinted={false}
            />
          </div>
        </div>
      </section>

      {/* Features Section - DARK SURFACE STRIP */}
      <section 
        className="py-20"
        style={{ backgroundColor: '#0F172A' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ color: '#FFFFFF' }}>
            Everything you need
          </h2>
          <p className="text-center mb-16" style={{ color: '#9CA3AF' }}>
            Designed for professional service environments
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={QrCode}
              title="QR-based uploads"
              description="One unique QR code per location. No accounts needed for customers."
              dark={true}
            />
            <FeatureCard 
              icon={Zap}
              title="Zero friction"
              description="Customers upload files directly from their browser. No app installation."
              dark={true}
            />
            <FeatureCard 
              icon={Eye}
              title="Vendor dashboard"
              description="Clean interface showing all incoming files with status tracking."
              dark={true}
            />
            <FeatureCard 
              icon={CheckCircle}
              title="Lifecycle control"
              description="Mark files as printed or processed. Track completion status."
              dark={true}
            />
            <FeatureCard 
              icon={Shield}
              title="Secure by design"
              description="Files are isolated per vendor. Auto-expiration after processing."
              dark={true}
            />
            <FeatureCard 
              icon={Clock}
              title="Audit-friendly"
              description="Keep clear records of file submissions and processing times."
              dark={true}
            />
          </div>
        </div>
      </section>

      {/* Who It's For - LIGHT WITH PURPLE ACCENT */}
      <section 
        className="py-20"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-4 flex justify-center">
            <div 
              className="h-1 w-20 rounded-full"
              style={{ backgroundColor: '#7C3AED' }}
            />
          </div>
          <h2 className="text-3xl font-bold text-center mb-4" style={{ color: '#111827' }}>
            Built for service businesses
          </h2>
          <p className="text-center mb-16" style={{ color: '#6B7280' }}>
            Trusted by professionals who need reliable file handling
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <UseCaseCard icon={Printer} title="Print Shops" />
            <UseCaseCard icon={Coffee} title="Internet Cafés" />
            <UseCaseCard icon={Building2} title="Admin Offices" />
            <UseCaseCard icon={MapPin} title="Field Counters" />
          </div>
        </div>
      </section>

      {/* Trust & Safety - DARK + CALM */}
      <section 
        className="py-20"
        style={{ backgroundColor: '#0B0F1A' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div 
            className="rounded-lg border p-12"
            style={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              borderColor: 'rgba(37, 99, 235, 0.2)'
            }}
          >
            <h2 className="text-3xl font-bold text-center mb-4" style={{ color: '#FFFFFF' }}>
              Privacy and security first
            </h2>
            <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
              Built for real-world environments where trust matters
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Users, label: 'No customer login required' },
                { icon: Clock, label: 'Files auto-expire after use' },
                { icon: Lock, label: 'Vendor data isolation' },
                { icon: Shield, label: 'Designed for compliance' }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: '#2563EB' }} />
                  </div>
                  <p className="text-sm" style={{ color: '#9CA3AF' }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - BRAND SIGNATURE GRADIENT */}
      <section 
        className="py-20"
        style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Ready to streamline file handling?
          </h2>
          <p className="text-xl mb-8" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Join service businesses using QRShare for reliable, friction-free file transfers
          </p>
          <button
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{ 
              backgroundColor: '#FFFFFF',
              color: '#2563EB'
            }}
          >
            Start Free Trial
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </section>

      {/* Footer - SOLID BLACK */}
      <footer 
        className="py-12"
        style={{ backgroundColor: '#0B0F1A' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <QrCode className="w-6 h-6" style={{ color: '#2563EB' }} />
                <span className="font-semibold" style={{ color: '#FFFFFF' }}>
                  SandBox
                </span>
              </div>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                QR-based file sharing for service businesses
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center">
              <button 
              onClick={() => navigate('/login')}
                className="text-sm transition-colors duration-200"
                style={{ color: '#6B7280' }}
                onMouseEnter={(e) => e.target.style.color = '#2563EB'}
                onMouseLeave={(e) => e.target.style.color = '#6B7280'}
              >
                Sign In
              </button>
              <button 
                className="text-sm transition-colors duration-200"
                style={{ color: '#6B7280' }}
                onMouseEnter={(e) => e.target.style.color = '#7C3AED'}
                onMouseLeave={(e) => e.target.style.color = '#6B7280'}
              >
                Privacy Policy
              </button>
              <button 
                className="text-sm transition-colors duration-200"
                style={{ color: '#6B7280' }}
                onMouseEnter={(e) => e.target.style.color = '#2563EB'}
                onMouseLeave={(e) => e.target.style.color = '#6B7280'}
              >
                Contact
              </button>
            </div>
          </div>
          
          <div 
            className="mt-8 pt-8 border-t text-center"
            style={{ borderColor: 'rgba(37, 99, 235, 0.2)' }}
          >
            <p className="text-sm" style={{ color: '#6B7280' }}>
              © 2025 SandBox. All rights reserved.
            </p>
             <p className="text-sm" style={{ color: '#6B7280' }}>
              Designed and Developed by <span style={{ color: '#7C3AED'}} > <a href="https://github.com/kuruet"> Kuruet </a>  </span>  
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;