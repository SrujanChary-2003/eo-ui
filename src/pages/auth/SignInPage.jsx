import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@onesaz/ui";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";
import Alert from "../../components/ui/Alert";
import { getApiErrorMessage, getFieldErrors } from "../../utils/authErrors";
import { toastError, toastSuccess } from "../../utils/toast";

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
      toastSuccess("Signed in successfully");
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
      const msg = getApiErrorMessage(err, "Sign in failed");
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h4" className="mb-2 font-bold">
        Welcome back
      </Typography>
      <Typography variant="body2" className="mb-6 text-muted-foreground">
        Sign in to manage your events and bookings.
      </Typography>

      {error && (
        <div className="mb-4">
          <Alert message={error} />
        </div>
      )}

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
        <PasswordInput
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={fieldErrors.password}
          autoComplete="current-password"
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-medium text-accent hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
