import { Navigate, Route, Routes } from 'react-router-dom'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
import { AuthHomePage } from '@/features/auth/pages/AuthHomePage'
import { InstrumentsPage } from '@/features/instruments/pages/InstrumentsPage'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { PublicRoute } from '@/routes/PublicRoute'
import { ROUTES } from '@/routes/paths'

function RoutePlaceholder() {
  return null
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={<ForgotPasswordPage />}
          />
        </Route>

        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<AuthHomePage />} />
          <Route path={ROUTES.INSTRUMENTS} element={<InstrumentsPage />} />
          <Route path={ROUTES.TRADE_JOURNAL} element={<RoutePlaceholder />} />
          <Route path={ROUTES.ANALYTICS} element={<RoutePlaceholder />} />
          <Route path={ROUTES.SETTINGS} element={<RoutePlaceholder />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  )
}
