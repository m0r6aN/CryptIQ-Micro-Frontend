// features/trading/components/SmartOptionsFlow/PatternAnalysis.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react"
import { OptionsPatterns } from "../../types/options"

export function PatternAnalysis({ patterns }: { patterns: OptionsPatterns }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Options Flow Patterns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patterns.unusualVolume && (
            <div className="flex items-center gap-2">
              <AlertCircle className="text-yellow-500" />
              <span>Unusual Volume Detected</span>
            </div>
          )}
          {patterns.bullishFlow && (
            <div className="flex items-center gap-2">
              <TrendingUp className="text-green-500" />
              <span>Bullish Options Flow</span>
            </div>
          )}
          {patterns.bearishFlow && (
            <div className="flex items-center gap-2">
              <TrendingDown className="text-red-500" />
              <span>Bearish Options Flow</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}