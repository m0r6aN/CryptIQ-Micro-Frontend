import React from 'react'
import { AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'features/shared/ui/card'
import { Progress } from 'features/shared/ui/progress'
import { Badge } from 'features/shared/ui/badge'
import { HealthMetrics } from './HealthMetrics'

export default function SafetyDashboard({ metrics }: { metrics: HealthMetrics }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Liquidity Score</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.liquidityScore.toFixed(2)}</div>
          <Progress value={metrics.liquidityScore} className="mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toxicity Score</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.toxicityScore.toFixed(2)}</div>
          <Progress value={metrics.toxicityScore} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {metrics.toxicityScore < 50 ? "Low risk" : "High risk"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Volatility Index</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.volatilityIndex.toFixed(2)}</div>
          <Badge variant={metrics.volatilityIndex < 20 ? "secondary" : "destructive"} className="mt-2">
            {metrics.volatilityIndex < 20 ? "Stable" : "Volatile"}
          </Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit Ratio</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.profitRatio.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {metrics.profitRatio > 1.5 ? "Profitable" : "Unprofitable"}
          </p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Circuit Breaker Status</CardTitle>
          <CardDescription>Current status of the safety circuit breaker</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          {metrics.isCircuitBroken ? (
            <div className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-lg font-semibold">Circuit Breaker Triggered</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-green-500">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-semibold">System Operational</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}