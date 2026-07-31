import { Card, CardContent } from "@onesaz/ui";

export default function AppCard({ children, className = "", contentClassName = "p-6" }) {
  return (
    <Card className={`border-border bg-card text-card-foreground shadow-sm ${className}`}>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
