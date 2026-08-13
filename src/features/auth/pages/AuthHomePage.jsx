import { useUser } from '@/context/UserContext'
import { Button } from '@/components/ui/button'

export function AuthHomePage() {
  const { user, logout } = useUser()

  async function handleLogout() {
    await logout()
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">You are signed in</h1>
      <p className="text-sm text-muted-foreground">
        Authenticated as {user?.email}
      </p>
      <Button type="button" variant="outline" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  )
}
