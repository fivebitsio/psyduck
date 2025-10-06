import { calendarRangeAtom, formattedRangeAtom } from '@/atoms/analytics'
import { logoutAtom } from '@/atoms/auth'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAtom, useSetAtom } from 'jotai'
import { CalendarIcon, LogOut, Menu, Settings } from 'lucide-react'
import { Link } from 'wouter'

function TopBar() {
  const [range, setRange] = useAtom(calendarRangeAtom)
  const [formattedRange] = useAtom(formattedRangeAtom)
  const logout = useSetAtom(logoutAtom)

  return (
    <div className="flex justify-between items-center w-full">
      <div></div>
      <div className="flex gap-2">
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
              onSelect={newRange => {
                // Only update if both dates are selected
                if (newRange?.from && newRange?.to) {
                  setRange({ from: newRange.from, to: newRange.to })
                }
              }}
              className="rounded-lg border shadow-sm"
            />
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h4 w4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default TopBar
