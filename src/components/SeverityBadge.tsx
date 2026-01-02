import { Badge } from '@/components/ui/badge';
import { getSeverityColor } from '@/lib/helpers';

interface SeverityBadgeProps {
  severity: string;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <Badge className={`${getSeverityColor(severity)} ${className}`} variant="outline">
      {severity}
    </Badge>
  );
}
