import { Button as OsButton } from "@onesaz/ui";

const VARIANT_MAP = {
  primary: "contained",
  secondary: "outlined",
  ghost: "ghost",
  contained: "contained",
  outlined: "outlined",
  destructive: "destructive",
  link: "link",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  loading,
  disabled,
  type = "button",
  ...props
}) {
  return (
    <OsButton
      type={type}
      variant={VARIANT_MAP[variant] || "contained"}
      color={variant === "primary" || variant === "contained" ? "accent" : "default"}
      className={className}
      loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </OsButton>
  );
}
