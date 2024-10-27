export function generateDescription(signal: SmartFlowSignal): string {
    const sentimentStr = signal.sentiment.confidence > 0.7 ? 'Strong' : 
                        signal.sentiment.confidence > 0.5 ? 'Moderate' : 'Weak'
                        
    return `${sentimentStr} ${signal.type.toUpperCase()} activity detected at strike $${signal.strike}. ` +
           `Volume/OI: ${signal.optionsActivity.volumeOIRatio.toFixed(2)}. ` +
           `IV Percentile: ${signal.ivPercentile}%. ` +
           `${signal.optionsActivity.unusualActivity ? 'Unusual activity detected! ' : ''}` +
           `${signal.sentiment.signals.join('. ')}`
  }