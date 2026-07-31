import { Alert as OsAlert, AlertDescription, AlertTitle } from "@onesaz/ui";

const VARIANT_MAP = {
  error: "error",
  success: "success",
  info: "info",
  warning: "warning",
};

export default function Alert({ type = "error", message, title }) {
  if (!message) return null;

  return (
    <OsAlert variant={VARIANT_MAP[type] || "error"}>
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription>{message}</AlertDescription>
    </OsAlert>
  );
}
