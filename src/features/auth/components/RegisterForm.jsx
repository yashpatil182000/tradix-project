import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerSchema } from '@/features/auth/schemas/authSchemas'
import { ROUTES } from '@/routes/paths'
import { signUp } from '@/services/authServices'

export function RegisterForm() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values) {
    setIsSubmitting(true)

    try {
      const data = await signUp({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      })

      if (data.session) {
        toast.success('Account created successfully')
        navigate(ROUTES.DASHBOARD, { replace: true })
        return
      }

      toast.success('Check your email to confirm your account')
      navigate(ROUTES.LOGIN, { replace: true })
    } catch (error) {
      toast.error(error.message || 'Unable to register')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="Jane Trader"
          aria-invalid={Boolean(errors.fullName)}
          {...register('fullName')}
        />
        {errors.fullName ? (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword ? (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
