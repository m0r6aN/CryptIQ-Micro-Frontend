// features/portfolio/components/SliderControl.tsx
import { Slider } from '@/features/shared/ui/slider'

interface SliderControlProps {
  label: string
  value: number
  onChange: (value: number) => void
  max: number
  step?: number
}

export function SliderControl({ 
  label, 
  value, 
  onChange, 
  max, 
  step = 1 
}: SliderControlProps) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm text-muted-foreground">{value}</span>
      </div>
      <Slider 
        value={[value]}
        onValueChange={([val]) => onChange(val)}
        max={max}
        step={step}
        className="my-2"
      />
    </div>
  )
}