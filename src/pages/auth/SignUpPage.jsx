import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";
import {
  getApiErrorMessage,
  getFieldErrors,
  validatePassword,
} from "../../utils/authErrors";

const PASSWORD_HINT =
  "Min 8 chars with uppercase, lowercase, number, and special character.";

export default function SignUpPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "customer",
  });
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

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setFieldErrors({ password: passwordError });
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      await register(form);
      navigate("/pending-verification", { state: { email: form.email.trim().toLowerCase() } });
    } catch (err) {
      const fields = getFieldErrors(err);
      setFieldErrors(fields);
      setError(getApiErrorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Create your account</h1>
      <p className="mb-6 text-sm text-slate-400">Join EventSphere and start planning events today.</p>

      {error && <div className="mb-4"><Alert message={error} /></div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="John"
            error={fieldErrors.firstName}
            required
          />
          <Input
            label="Last name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Doe"
            error={fieldErrors.lastName}
            required
          />
        </div>
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
          minLength={8}
          required
        />
        <p className="text-xs text-slate-500">{PASSWORD_HINT}</p>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">I am a</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500"
          >
            <option value="customer">Customer (planning events)</option>
            <option value="vendor">Vendor (offering services)</option>
          </select>
        </div>

        <Button type="submit" className="w-full py-3" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/signin" className="font-medium text-violet-400 hover:text-violet-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
