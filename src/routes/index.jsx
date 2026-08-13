import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PageSkeleton } from '@/components/shared/PageStates'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { PublicRoute } from '@/routes/PublicRoute'
import { ROUTES } from '@/routes/paths'

const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((module) => ({
    default: module.LoginPage,
  })),
)
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((module) => ({
    default: module.RegisterPage,
  })),
)
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/pages/ForgotPasswordPage').then((module) => ({
    default: module.ForgotPasswordPage,
  })),
)
const ResetPasswordPage = lazy(() =>
  import('@/features/auth/pages/ResetPasswordPage').then((module) => ({
    default: module.ResetPasswordPage,
  })),
)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
)
const CapitalPage = lazy(() =>
  import('@/features/capital/pages/CapitalPage').then((module) => ({
    default: module.CapitalPage,
  })),
)
const InstrumentsPage = lazy(() =>
  import('@/features/instruments/pages/InstrumentsPage').then((module) => ({
    default: module.InstrumentsPage,
  })),
)
const TradesPage = lazy(() =>
  import('@/features/trades/pages/TradesPage').then((module) => ({
    default: module.TradesPage,
  })),
)
const CreateTradePage = lazy(() =>
  import('@/features/trades/pages/CreateTradePage').then((module) => ({
    default: module.CreateTradePage,
  })),
)
const EditTradePage = lazy(() =>
  import('@/features/trades/pages/EditTradePage').then((module) => ({
    default: module.EditTradePage,
  })),
)
const TradeDetailsPage = lazy(() =>
  import('@/features/trades/pages/TradeDetailsPage').then((module) => ({
    default: module.TradeDetailsPage,
  })),
)
const AnalyticsPage = lazy(() =>
  import('@/features/analytics/pages/AnalyticsPage').then((module) => ({
    default: module.AnalyticsPage,
  })),
)
const ReportsPage = lazy(() =>
  import('@/features/reports/pages/ReportsPage').then((module) => ({
    default: module.ReportsPage,
  })),
)
const SettingsLayout = lazy(() =>
  import('@/features/settings/pages/SettingsLayout').then((module) => ({
    default: module.SettingsLayout,
  })),
)
const SettingsInstrumentsPage = lazy(() =>
  import('@/features/settings/pages/SettingsInstrumentsPage').then((module) => ({
    default: module.SettingsInstrumentsPage,
  })),
)
const ConfigCategoryPage = lazy(() =>
  import('@/features/settings/pages/ConfigCategoryPage').then((module) => ({
    default: module.ConfigCategoryPage,
  })),
)

function LazyPage({ children }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route element={<PublicRoute />}>
          <Route
            path={ROUTES.LOGIN}
            element={
              <LazyPage>
                <LoginPage />
              </LazyPage>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <LazyPage>
                <RegisterPage />
              </LazyPage>
            }
          />
          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={
              <LazyPage>
                <ForgotPasswordPage />
              </LazyPage>
            }
          />
        </Route>

        <Route
          path={ROUTES.RESET_PASSWORD}
          element={
            <LazyPage>
              <ResetPasswordPage />
            </LazyPage>
          }
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <LazyPage>
                <DashboardPage />
              </LazyPage>
            }
          />
          <Route
            path={ROUTES.CAPITAL}
            element={
              <LazyPage>
                <CapitalPage />
              </LazyPage>
            }
          />
          <Route
            path={ROUTES.INSTRUMENTS}
            element={
              <LazyPage>
                <InstrumentsPage />
              </LazyPage>
            }
          />

          <Route path={ROUTES.TRADE_JOURNAL}>
            <Route
              index
              element={
                <LazyPage>
                  <TradesPage />
                </LazyPage>
              }
            />
            <Route
              path="new"
              element={
                <LazyPage>
                  <CreateTradePage />
                </LazyPage>
              }
            />
            <Route
              path=":tradeId/edit"
              element={
                <LazyPage>
                  <EditTradePage />
                </LazyPage>
              }
            />
            <Route
              path=":tradeId"
              element={
                <LazyPage>
                  <TradeDetailsPage />
                </LazyPage>
              }
            />
          </Route>

          <Route
            path={ROUTES.ANALYTICS}
            element={
              <LazyPage>
                <AnalyticsPage />
              </LazyPage>
            }
          />
          <Route
            path={ROUTES.REPORTS}
            element={
              <LazyPage>
                <ReportsPage />
              </LazyPage>
            }
          />

          <Route
            path={ROUTES.SETTINGS}
            element={
              <LazyPage>
                <SettingsLayout />
              </LazyPage>
            }
          >
            <Route index element={<Navigate to="instruments" replace />} />
            <Route
              path="instruments"
              element={
                <LazyPage>
                  <SettingsInstrumentsPage />
                </LazyPage>
              }
            />
            <Route
              path=":categoryPath"
              element={
                <LazyPage>
                  <ConfigCategoryPage />
                </LazyPage>
              }
            />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  )
}
