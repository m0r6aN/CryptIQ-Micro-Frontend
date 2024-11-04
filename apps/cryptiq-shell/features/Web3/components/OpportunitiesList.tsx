// Opportunities List Component
import { Badge } from "features/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "features/shared/ui/card";
import { ArrowRight } from "lucide-react";

const opportunities = [
    { buyExchange: "ExchangeA", sellExchange: "ExchangeB", profit: 5.5, estimatedGas: 20 },
    // Add more opportunity objects as needed
];

export const OpportunitiesList = () => (
    <Card>
      <CardHeader>
        <CardTitle>Recent Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {opportunities.map((opp, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{opp.buyExchange}</Badge>
                <ArrowRight className="h-4 w-4" />
                <Badge variant="outline">{opp.sellExchange}</Badge>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">
                  {opp.profit.toFixed(2)}% Profit
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Gas: {opp.estimatedGas} Gwei
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )