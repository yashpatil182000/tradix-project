import { cn } from '@/lib/utils'

const variantMap = {
  display: 'text-display',
  h1: 'text-heading-1',
  h2: 'text-heading-2',
  h3: 'text-heading-3',
  h4: 'text-heading-4',
  body: 'text-body',
  small: 'text-small',
  caption: 'text-caption',
}

const elementMap = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  small: 'p',
  caption: 'span',
}

export function Typography({
  variant = 'body',
  as,
  className,
  muted = false,
  children,
  ...props
}) {
  const Comp = as || elementMap[variant] || 'p'

  return (
    <Comp
      className={cn(
        variantMap[variant],
        muted && 'text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
