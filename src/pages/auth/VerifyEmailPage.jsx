import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";

export default function VerifyEmailPage() {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    email: searchParams.get("email") || "",
    otp: searchParams.get("otp") || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const email = searchParams.get("email");
    const otp = searchParams.get("otp");
    if (email && otp) {
      setForm({ email, otp });
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await verifyEmail(form);
      setSuccess("Email verified! You can now sign in.");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Verify your email</h1>
      <p className="mb-6 text-sm text-slate-400">
        Enter the 6-digit code sent to your email address.
      </p>

      {error && <div className="mb-4"><Alert message={error} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Verification code"
          name="otp"
          value={form.otp}
          onChange={handleChange}
          placeholder="123456"
          maxLength={6}
          required
        />
        <Button type="submit" className="w-full py-3" disabled={loading}>
          {loading ? "Verifying..." : "Verify email"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Need a new code?{" "}
        <Link
          to="/pending-verification"
          state={{ email: form.email }}
          className="font-medium text-violet-400 hover:text-violet-300"
        >
          Resend verification
        </Link>
      </p>
    </div>
  );
}
