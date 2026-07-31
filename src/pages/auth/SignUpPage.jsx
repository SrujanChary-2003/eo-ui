import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@onesaz/ui";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";
import Alert from "../../components/ui/Alert";
import AppCombobox from "../../components/ui/AppCombobox";
import {
  getApiErrorMessage,
  getFieldErrors,
  validatePassword,
} from "../../utils/authErrors";

const PASSWORD_HINT =
  "Min 8 chars with uppercase, lowercase, number, and special character.";

const ROLE_OPTIONS = [
  { value: "customer", label: "Customer (planning events)" },
  { value: "vendor", label: "Vendor (offering services)" },
];

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
      <Typography variant="h4" className="mb-2 font-bold">
        Create your account
      </Typography>
      <Typography variant="body2" className="mb-6 text-muted-foreground">
        Join EventSphere and start planning events today.
      </Typography>

      {error && (
        <div className="mb-4">
          <Alert message={error} />
        </div>
      )}

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
        <PasswordInput
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={fieldErrors.password}
          autoComplete="new-password"
          minLength={8}
          required
        />
        <p className="text-xs text-muted-foreground">{PASSWORD_HINT}</p>

        <AppCombobox
          label="I am a"
          options={ROLE_OPTIONS}
          value={form.role}
          onChange={(value) => setForm((prev) => ({ ...prev, role: value || "customer" }))}
          required
        />

        <Button type="submit" fullWidth loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/signin" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
