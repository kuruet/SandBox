import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    shopName: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;

  if (!emailRegex.test(form.email)) {
    return "Please enter a valid email address";
  }

  if (!passwordRegex.test(form.password)) {
    return "Password must be at least 8 characters and include uppercase, lowercase, number and special character";
  }

  return null;
};


  // Handle register submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // 🔴 CRITICAL: stop native form submit
   setError("");

const validationError = validateForm();
if (validationError) {
  setError(validationError);
  return;
}


    try {
      setLoading(true);

const res = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/vendor/register`,
  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // ✅ Successful register → go to login
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="w-full min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #05060A 0%, #0B1020 50%, #0E1A2F 100%)',
      }}
    >
      {/* Radial glow effects */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)',
        }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-4 p-8 rounded-2xl relative z-10 transition-all duration-300"
        style={{
          background: '#0B1020',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.1)',
          animation: 'fadeInUp 0.5s ease-out',
        }}
      >
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeSlideIn {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .input-field {
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .input-field:focus {
            border-color: #3B82F6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), 0 0 20px rgba(124, 58, 237, 0.1);
            outline: none;
          }

          .input-field:hover:not(:focus) {
            border-color: rgba(59, 130, 246, 0.4);
          }

          .btn-primary {
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px rgba(59, 130, 246, 0.3), 0 0 30px rgba(124, 58, 237, 0.2);
          }

          .btn-primary:active:not(:disabled) {
            transform: translateY(0);
          }

          .link-hover {
            transition: all 0.2s ease-out;
          }

          .link-hover:hover {
            color: #3B82F6;
            text-decoration: underline;
            text-decoration-color: #3B82F6;
          }
        `}</style>

        <h2 
          className="text-3xl font-semibold mb-2"
          style={{ color: '#E5E7EB' }}
        >
          Create your Vendor Account
        </h2>

        {error && (
          <p 
            className="text-sm p-3 rounded-lg"
            style={{
              color: '#FCA5A5',
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              animation: 'fadeSlideIn 0.3s ease-out',
            }}
          >
            {error}
          </p>
        )}

        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          className="input-field p-3 rounded-lg"
          style={{
            background: '#0E122A',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#E5E7EB',
          }}
          value={form.firstName}
          onChange={handleChange}
          required
        />

        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          className="input-field p-3 rounded-lg"
          style={{
            background: '#0E122A',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#E5E7EB',
          }}
          value={form.lastName}
          onChange={handleChange}
          required
        />

        <input
          name="shopName"
          type="text"
          placeholder="Shop Name"
          className="input-field p-3 rounded-lg"
          style={{
            background: '#0E122A',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#E5E7EB',
          }}
          value={form.shopName}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input-field p-3 rounded-lg"
          style={{
            background: '#0E122A',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#E5E7EB',
          }}
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className="relative">
  <input
    name="password"
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="input-field p-3 rounded-lg w-full pr-12"
    style={{
      background: '#0E122A',
      border: '1px solid rgba(59, 130, 246, 0.25)',
      color: '#E5E7EB',
    }}
    value={form.password}
    onChange={handleChange}
    required
  />

  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
    style={{ color: '#9CA3AF' }}
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>


        <button
          type="submit"
          disabled={loading}
          className="btn-primary py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: loading ? '#1F2937' : 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)',
            color: '#FFFFFF',
            boxShadow: loading ? 'none' : '0 4px 14px rgba(59, 130, 246, 0.4)',
          }}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p 
          className="text-sm text-center mt-2"
          style={{ color: '#9CA3AF' }}
        >
          Already have an account?{" "}
          <Link 
            to="/login" 
            className="link-hover"
            style={{ color: '#9CA3AF' }}
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}