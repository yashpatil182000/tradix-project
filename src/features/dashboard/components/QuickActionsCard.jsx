import { Link } from 'react-router-dom'
import {
  BookOpen,
  Plus,
  Settings2,
  Wallet,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ROUTES } from '@/routes/paths'

const actions = [
  {
    to: `${ROUTES.TRADE_JOURNAL}/new`,
    label: 'Log trade',
    description: 'Open the fast trade form',
    icon: Plus,
  },
  {
    to: ROUTES.TRADE_JOURNAL,
    label: 'Trade journal',
    description: 'Browse and review trades',
    icon: BookOpen,
  },
  {
    to: ROUTES.CAPITAL,
    label: 'Capital',
    description: 'Deposits and withdrawals',
    icon: Wallet,
  },
  {
    to: ROUTES.SETTINGS,
    label: 'Settings',
    description: 'Configure journal options',
    icon: Settings2,
  },
]

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Jump into common workflows</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.to}
              to={action.to}
              className="flex items-start gap-3 rounded-control border border-border px-3 py-3 transition-colors hover:bg-muted"
            >
              <div className="rounded-control bg-muted p-2 text-muted-foreground">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-caption text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
