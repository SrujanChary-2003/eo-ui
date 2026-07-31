import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Typography } from "@onesaz/ui";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { getApiErrorMessage } from "../../utils/authErrors";

export default function PendingVerificationPage() {
  const { resendVerification } = useAuth();
  const location = useLocation();
  const email = location.state?.email || "";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await resendVerification(email);
      setMessage("A new verification code has been sent to your email.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to resend verification code"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-3xl">
        ✉️
      </div>
      <Typography variant="h4" className="mb-2 font-bold">
        Check your email
      </Typography>
      <Typography variant="body2" className="mb-2 text-muted-foreground">
        We sent a 6-digit verification code to
      </Typography>
      {email && (
        <Typography variant="body1" className="mb-6 font-medium text-accent">
          {email}
        </Typography>
      )}

      {error && <div className="mb-4"><Alert message={error} /></div>}
      {message && <div className="mb-4"><Alert type="success" message={message} /></div>}

      <div className="space-y-3">
        <Link to="/verify-email" state={{ email }}>
          <Button className="w-full py-3">Enter verification code</Button>
        </Link>
        <Button
          variant="secondary"
          className="w-full py-3"
          onClick={handleResend}
          loading={loading}
          disabled={!email}
        >
          Resend code
        </Button>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Wrong email?{" "}
        <Link to="/signup" className="font-medium text-accent hover:underline">
          Sign up again
        </Link>
      </p>
    </div>
  );
}
