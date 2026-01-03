import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { loginVendor } from "../api/vendor";
 
import { Eye, EyeOff, FileText, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginVendor(email, password);

      // ✅ Store JWT token under key "vendorToken"
      localStorage.setItem("vendorToken", data.token);

      // ✅ Also store vendorId if needed
      localStorage.setItem("vendorId", data.vendor.vendorId);

      // Redirect to vendor dashboard
      navigate("/vendordashboard");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #05060A 0%, #0B1020 50%, #0E1A2F 100%)'
      }}
    >
      {/* Radial glow effects */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)'
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)'
        }}
      />

      <div className="w-full max-w-6xl flex items-center gap-12 relative z-10">
        {/* Login Card */}
        <div 
          className={`w-full max-w-md mx-auto lg:mx-0 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div 
            className="rounded-2xl border p-8 transition-all duration-300 hover:shadow-2xl"
            style={{ 
              backgroundColor: '#0B1020',
              borderColor: 'rgba(59,130,246,0.25)',
              boxShadow: '0 0 40px rgba(59,130,246,0.1), 0 0 80px rgba(124,58,237,0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 60px rgba(59,130,246,0.15), 0 0 100px rgba(124,58,237,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(59,130,246,0.1), 0 0 80px rgba(124,58,237,0.05)';
            }}
          >
            {/* Logo/Brand */}
            <div className="flex items-center gap-2 mb-8">
              <FileText 
                className="w-8 h-8 transition-all duration-300"
                style={{ color: '#3B82F6' }}
              />
              <span 
                className="text-xl font-semibold"
                style={{ color: '#E5E7EB' }}
              >
                SandBox
              </span>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 
                className="text-2xl font-semibold mb-1"
                style={{ color: '#E5E7EB' }}
              >
                Sign in to your account
              </h1>
              <p 
                className="text-sm"
                style={{ color: '#9CA3AF' }}
              >
                Enter your credentials to continue
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div 
                className="mb-4 p-3 rounded-lg border flex items-start gap-2 animate-fade-in"
                style={{ 
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  borderColor: 'rgba(220, 38, 38, 0.3)',
                  animation: 'fadeInSlide 0.3s ease-out'
                }}
              >
                <AlertCircle 
                  className="w-4 h-4 mt-0.5 flex-shrink-0" 
                  style={{ color: '#EF4444' }}
                />
                <span 
                  className="text-sm"
                  style={{ color: '#FCA5A5' }}
                >
                  {error}
                </span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Email Input */}
              <div>
                <label 
                  htmlFor="email"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#E5E7EB' }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0"
                  style={{ 
                    backgroundColor: '#0E122A',
                    borderColor: 'rgba(59,130,246,0.25)',
                    color: '#E5E7EB',
                    '--tw-ring-color': '#3B82F6'
                  }}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3B82F6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15), 0 0 0 6px rgba(124,58,237,0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(59,130,246,0.25)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Password Input */}
              <div>
                <label 
                  htmlFor="password"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#E5E7EB' }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-3 py-2 pr-10 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0"
                    style={{ 
                      backgroundColor: '#0E122A',
                      borderColor: 'rgba(59,130,246,0.25)',
                      color: '#E5E7EB',
                      '--tw-ring-color': '#3B82F6'
                    }}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3B82F6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15), 0 0 0 6px rgba(124,58,237,0.08)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(59,130,246,0.25)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200"
                    style={{ color: '#6B7280' }}
                    disabled={isLoading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#3B82F6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#6B7280';
                    }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-sm transition-all duration-200"
                  style={{ color: '#9CA3AF' }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#3B82F6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#9CA3AF';
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ 
                  background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 0 20px rgba(59,130,246,0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(59,130,246,0.5), 0 0 60px rgba(124,58,237,0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.3)';
                }}
              >
                {isLoading ? (
                  <>
                    <svg 
                      className="animate-spin h-4 w-4" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                      style={{
                        filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))'
                      }}
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* Footer Link */}
            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: '#9CA3AF' }}>
                Don't have an account?{' '}
                <button
                onClick={() => navigate('/register')}
                  type="button"
                  className="font-medium transition-all duration-200"
                  style={{ color: '#3B82F6' }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#7C3AED';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#3B82F6';
                  }}
                >
                  Create account
                  
                </button>
              </p>
            </div>
          </div>

          {/* Privacy Note */}
          <p 
            className="mt-6 text-center text-xs"
            style={{ color: '#6B7280' }}
          >
            By signing in, you agree to our{' '}
            <button
              type="button"
              className="transition-all duration-200 underline"
              style={{ color: '#6B7280' }}
              onMouseEnter={(e) => {
                e.target.style.color = '#3B82F6';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#6B7280';
              }}
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button
              type="button"
              className="transition-all duration-200 underline"
              style={{ color: '#6B7280' }}
              onMouseEnter={(e) => {
                e.target.style.color = '#3B82F6';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#6B7280';
              }}
            >
              Privacy Policy
            </button>
          </p>
        </div>

        {/* Illustration (Desktop Only) */}
        <div className="">
          <div 
            className=""
            style={{ 
              backgroundColor: '#FFFFFF',
              borderColor: '#E5E7EB'
            }}
          >
            <div className="space-y-4">
              <div className="pt-4 space-y-3">
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;