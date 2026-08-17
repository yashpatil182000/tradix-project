import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ConfigSourceTabs({
  value,
  onValueChange,
  yoursLabel,
  catalogLabel,
  yoursCount = 0,
  catalogCount = 0,
}) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="mb-4 gap-0">
      <TabsList variant="line" className="w-full justify-start">
        <TabsTrigger value="yours" className="px-3">
          {yoursLabel}
          <span className="text-muted-foreground">{yoursCount}</span>
        </TabsTrigger>
        <TabsTrigger value="catalog" className="px-3">
          {catalogLabel}
          <span className="text-muted-foreground">{catalogCount}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
