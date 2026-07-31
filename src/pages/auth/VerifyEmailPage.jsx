import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Typography } from "@onesaz/ui";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";
import { getApiErrorMessage, getFieldErrors } from "../../utils/authErrors";

export default function VerifyEmailPage() {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const autoSubmitted = useRef(false);

  const initialEmail =
    searchParams.get("email") || location.state?.email || "";
  const initialOtp = searchParams.get("otp") || "";

  const [form, setForm] = useState({
    email: initialEmail,
    otp: initialOtp,
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submitVerification = async (payload) => {
    setError("");
    setFieldErrors({});
    setSuccess("");
    setLoading(true);

    try {
      await verifyEmail(payload);
      setSuccess("Email verified! You can now sign in.");
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err) {
      setFieldErrors(getFieldErrors(err));
      setError(getApiErrorMessage(err, "Verification failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const email = searchParams.get("email") || location.state?.email || "";
    const otp = searchParams.get("otp") || "";
    if (email || otp) {
      setForm((prev) => ({
        email: email || prev.email,
        otp: otp || prev.otp,
      }));
    }

    if (email && otp && !autoSubmitted.current) {
      autoSubmitted.current = true;
      submitVerification({ email, otp });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitVerification(form);
  };

  return (
    <div>
      <Typography variant="h4" className="mb-2 font-bold">
        Verify your email
      </Typography>
      <Typography variant="body2" className="mb-6 text-muted-foreground">
        Enter the 6-digit code sent to your email address.
      </Typography>

      {error && <div className="mb-4"><Alert message={error} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          required
        />
        <Input
          label="Verification code"
          name="otp"
          value={form.otp}
          onChange={handleChange}
          placeholder="123456"
          maxLength={6}
          error={fieldErrors.otp}
          required
        />
        <Button type="submit" className="w-full py-3" loading={loading}>
          Verify email
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Need a new code?{" "}
        <Link
          to="/pending-verification"
          state={{ email: form.email }}
          className="font-medium text-accent hover:underline"
        >
          Resend verification
        </Link>
      </p>
    </div>
  );
}
