import { FormControl, FormHelperText, FormLabel, Textarea as OsTextarea } from "@onesaz/ui";

export default function AppTextarea({ label, error, className = "", ...props }) {
  return (
    <FormControl fullWidth error={Boolean(error)} className={className}>
      {label ? <FormLabel>{label}</FormLabel> : null}
      <OsTextarea error={Boolean(error)} {...props} />
      {error ? <FormHelperText>{error}</FormHelperText> : null}
    </FormControl>
  );
}
