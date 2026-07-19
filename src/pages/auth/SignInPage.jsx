import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";
import { getApiErrorMessage, getFieldErrors } from "../../utils/authErrors";

export default function SignInPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      const errorCode = err.response?.data?.errorCode;

      if (errorCode === "EMAIL_NOT_VERIFIED") {
        navigate("/pending-verification", {
          state: { email: form.email.trim().toLowerCase() },
        });
        return;
      }

      setFieldErrors(getFieldErrors(err));
      setError(getApiErrorMessage(err, "Sign in failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Welcome back</h1>
      <p className="mb-6 text-sm text-slate-400">Sign in to manage your events and bookings.</p>

      {error && <div className="mb-4"><Alert message={error} /></div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={fieldErrors.email}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={fieldErrors.password}
          required
        />
        <Button type="submit" className="w-full py-3" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-medium text-violet-400 hover:text-violet-300">
          Sign up
        </Link>
      </p>
    </div>
  );
}
