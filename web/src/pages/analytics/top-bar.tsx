import { calendarRangeAtom, formattedRangeAtom } from '@/atoms/analytics'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAtom } from 'jotai'
import { CalendarIcon } from 'lucide-react'

function TopBar() {
  const [range, setRange] = useAtom(calendarRangeAtom)
  const [formattedRange] = useAtom(formattedRangeAtom)

  return (
    <div className="flex justify-end">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarIcon />
            {formattedRange}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={range.from}
            selected={range}
            onSelect={(newRange) => {
              // Only update if both dates are selected
              if (newRange?.from && newRange?.to) {
                setRange({ from: newRange.from, to: newRange.to })
              }
            }}
            className="rounded-lg border shadow-sm"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default TopBar
