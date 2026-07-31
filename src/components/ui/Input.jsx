import { FormControl, FormHelperText, FormLabel, Input as OsInput } from "@onesaz/ui";

export default function Input({ label, error, className = "", ...props }) {
  return (
    <FormControl fullWidth error={Boolean(error)} className={className}>
      {label ? <FormLabel>{label}</FormLabel> : null}
      <OsInput error={Boolean(error)} {...props} />
      {error ? <FormHelperText>{error}</FormHelperText> : null}
    </FormControl>
  );
}
