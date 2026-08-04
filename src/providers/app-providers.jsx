import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { UserProvider } from '@/context/UserContext'
import { ThemeProvider } from '@/providers/theme-provider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <UserProvider>
            <TooltipProvider delayDuration={200}>
              {children}
              <Toaster position="top-right" richColors closeButton />
            </TooltipProvider>
          </UserProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
