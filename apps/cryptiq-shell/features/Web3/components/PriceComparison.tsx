import { Card, CardContent, CardHeader, CardTitle } from "features/shared/ui/card";
import { BarChart3 } from "lucide-react";

// Price Comparison Component
const PriceComparison = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-green-500" />
          Live Exchange Prices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(exchangePrices).map(([exchange, prices]) => (
            <div key={exchange} className="p-4 rounded-lg bg-muted">
              <h4 className="font-medium capitalize">{exchange}</h4>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-green-600">Bid: ${prices.bid.toFixed(2)}</p>
                <p className="text-sm text-red-600">Ask: ${prices.ask.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )