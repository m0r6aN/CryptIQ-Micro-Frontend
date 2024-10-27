export interface PerformanceMetricProps {
    label: string
    value: number
    icon: React.ComponentType<{ className?: string }>
    format?: 'number' | 'percent'
  }

export interface WebSocketHookProps<T> {
    data: string;
    url: string;
    options?: T;
    type: string;
    metrics: string;
  }