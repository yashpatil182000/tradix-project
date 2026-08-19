import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { TradixLogo } from '@/components/shared/TradixLogo'
import { cn } from '@/lib/utils'
import { CtaRipple, Magnetic } from '@/pages/Landing/motion/interactions'
import { ROUTES } from '@/routes/paths'

const NAV_LINKS = [
  { href: '#features', id: 'features', label: 'Features' },
  { href: '#how-it-works', id: 'how-it-works', label: 'How It Works' },
  { href: '#analytics', id: 'analytics', label: 'Analytics' },
]

function scrollToSection(href) {
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(Boolean)
    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActive(visible.target.id)
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: [0.15, 0.35, 0.6] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300',
          scrolled
            ? 'border-b border-[#27272A]/80 bg-[#0B0B0C]/90 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav
          className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4"
          aria-label="Main"
        >
          <Link to={ROUTES.LANDING} className="inline-flex shrink-0" aria-label="Tradix home">
            <TradixLogo size="md" />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => scrollToSection(link.href)}
                className={cn(
                  'landing-nav-link text-sm transition-colors',
                  active === link.id ? 'text-[#F4F4F5]' : 'text-[#A1A1AA] hover:text-[#F4F4F5]',
                )}
              >
                {link.label}
                {active === link.id ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-1 h-px bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                ) : null}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" asChild className="text-[#A1A1AA] hover:text-[#F4F4F5]">
              <Link to={ROUTES.LOGIN}>Login</Link>
            </Button>
            <Magnetic strength={0.22}>
              <CtaRipple>
                <Button size="sm" asChild className="landing-cta">
                  <Link to={ROUTES.REGISTER}>
                    <span className="landing-cta-shimmer" aria-hidden="true" />
                    Get Started
                  </Link>
                </Button>
              </CtaRipple>
            </Magnetic>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-0 z-40 bg-[#0B0B0C]/95 backdrop-blur-sm md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-full flex-col px-6 pt-20 pb-8">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      scrollToSection(link.href)
                    }}
                    className="rounded-control px-3 py-3 text-left text-lg text-[#F4F4F5] transition-colors hover:bg-[#151517]"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-3">
                <Button variant="outline" asChild className="w-full">
                  <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="landing-cta w-full">
                  <Link to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)}>
                    <span className="landing-cta-shimmer" aria-hidden="true" />
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
