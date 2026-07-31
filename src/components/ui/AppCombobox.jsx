import { Combobox, FormControl } from "@onesaz/ui";

/**
 * Theme-aware select built on Onesaz Combobox.
 * options: [{ value, label }] | string[]
 */
export default function AppCombobox({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  clearable = false,
  multiple = false,
  required = false,
  disabled = false,
  className = "",
  emptyMessage = "No options",
}) {
  const normalized = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  if (multiple) {
    const selected = normalized.filter((opt) => (value || []).includes(opt.value));
    return (
      <FormControl fullWidth className={className}>
        <Combobox
          label={label}
          options={normalized}
          value={selected}
          onChange={(next) => onChange?.((next || []).map((item) => item.value))}
          placeholder={placeholder}
          clearable={clearable}
          multiple
          required={required}
          disabled={disabled}
          emptyMessage={emptyMessage}
        />
      </FormControl>
    );
  }

  const selected = normalized.find((opt) => opt.value === value) || null;

  return (
    <FormControl fullWidth className={className}>
      <Combobox
        label={label}
        options={normalized}
        value={selected}
        onChange={(next) => onChange?.(next?.value || "")}
        placeholder={placeholder}
        clearable={clearable}
        required={required}
        disabled={disabled}
        emptyMessage={emptyMessage}
      />
    </FormControl>
  );
}
