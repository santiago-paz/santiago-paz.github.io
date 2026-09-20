'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Strikes each row of marks once, the first time it comes into view.
 * The marks are fully visible without this; it only adds the press.
 */
export function StrikeObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const rows = document.querySelectorAll<HTMLElement>('[data-strike]:not([data-struck])')
    if (!rows.length || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const row = entry.target as HTMLElement
          row.dataset.struck = ''
          observer.unobserve(row)
        }
      },
      { threshold: 0.4 },
    )
    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [pathname])

  return null
}
