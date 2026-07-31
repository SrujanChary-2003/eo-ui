import { FormControl, FormHelperText, FormLabel, Input as OsInput } from "@onesaz/ui";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function PasswordInput({
  label = "Password",
  error,
  className = "",
  ...props
}) {
  const [visible, setVisible] = useState(false);

  return (
    <FormControl fullWidth error={Boolean(error)} className={className}>
      {label ? <FormLabel>{label}</FormLabel> : null}
      <div className="relative">
        <OsInput
          error={Boolean(error)}
          type={visible ? "text" : "password"}
          className="pr-11"
          autoComplete={props.autoComplete || "current-password"}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--app-muted)] transition hover:bg-[var(--app-surface-muted)] hover:text-[var(--app-text)]"
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="h-4 w-4" strokeWidth={1.9} /> : <Eye className="h-4 w-4" strokeWidth={1.9} />}
        </button>
      </div>
      {error ? <FormHelperText>{error}</FormHelperText> : null}
    </FormControl>
  );
}
