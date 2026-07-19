import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20 text-3xl">
        ✉️
      </div>
      <h1 className="mb-2 text-2xl font-bold text-white">Check your email</h1>
      <p className="mb-2 text-sm text-slate-400">
        We sent a 6-digit verification code to
      </p>
      {email && <p className="mb-6 font-medium text-violet-300">{email}</p>}

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
          disabled={loading || !email}
        >
          {loading ? "Sending..." : "Resend code"}
        </Button>
      </div>

      <p className="mt-6 text-sm text-slate-400">
        Wrong email?{" "}
        <Link to="/signup" className="font-medium text-violet-400 hover:text-violet-300">
          Sign up again
        </Link>
      </p>
    </div>
  );
}
