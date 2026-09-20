'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/#work', label: 'Work', match: (p: string) => p.startsWith('/projects') },
  { href: '/about/', label: 'About', match: (p: string) => p.startsWith('/about') },
  { href: '/writing/', label: 'Writing', match: (p: string) => p.startsWith('/writing') },
]

export function SiteNav() {
  const pathname = usePathname() ?? '/'
  return (
    <nav className="nav" aria-label="Main">
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} aria-current={link.match(pathname) ? 'page' : undefined}>
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
