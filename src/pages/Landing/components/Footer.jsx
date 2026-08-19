import { Link } from 'react-router-dom'
import { TradixLogo } from '@/components/shared/TradixLogo'
import { ROUTES } from '@/routes/paths'

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Analytics', href: '#analytics' },
    { label: 'Journal', href: '#how-it-works' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
}

function FooterLink({ href, label }) {
  if (href.startsWith('#')) {
    return (
      <a
        href={href}
        className="text-sm text-[#71717A] transition-colors hover:text-[#F4F4F5]"
      >
        {label}
      </a>
    )
  }

  return (
    <Link
      to={href}
      className="text-sm text-[#71717A] transition-colors hover:text-[#F4F4F5]"
    >
      {label}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-[#27272A] bg-[#0B0B0C] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to={ROUTES.LANDING} aria-label="Tradix home">
              <TradixLogo size="md" />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#71717A]">
              Your trading data should teach you how to trade better.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="mb-3 text-xs font-medium tracking-wider text-[#A1A1AA] uppercase">
                {group}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#27272A] pt-8 sm:flex-row">
          <p className="text-xs text-[#71717A]">
            &copy; {new Date().getFullYear()} Tradix. All rights reserved.
          </p>
          <p className="text-xs text-[#71717A]">
            Tradix is a journal and analytics product — not a broker or signal service.
          </p>
        </div>
      </div>
    </footer>
  )
}
