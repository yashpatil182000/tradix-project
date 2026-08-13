import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function CapitalFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  direction,
  onDirectionChange,
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
      <div className="space-y-2">
        <Label htmlFor="capital-search">Search</Label>
        <Input
          id="capital-search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search notes..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="capital-type">Type</Label>
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger id="capital-type" className="w-full">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="starting">Initial capital</SelectItem>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="adjustment">Adjustment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="capital-direction">Direction</Label>
        <Select value={direction} onValueChange={onDirectionChange}>
          <SelectTrigger id="capital-direction" className="w-full">
            <SelectValue placeholder="All directions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All directions</SelectItem>
            <SelectItem value="in">In</SelectItem>
            <SelectItem value="out">Out</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
