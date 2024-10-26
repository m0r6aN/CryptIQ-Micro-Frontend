// features/trading/components/SmartOptionsFlow/SmartAlerts.tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import type { OptionsAlert } from "../../types/options"

export function SmartAlerts({ alerts }: { alerts: OptionsAlert[] }) {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Alert 
          key={alert.id || alert.title} 
          variant={alert.severity}
          className="flex items-start gap-2"
        >
          <AlertTitle className="mb-1">{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
          {alert.timestamp && (
            <span className="text-xs text-muted-foreground">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
          )}
        </Alert>
      ))}
    </div>
  )
}