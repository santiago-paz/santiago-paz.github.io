import type { SVGProps } from 'react'

type IconName = 'external' | 'download' | 'arrow-left' | 'arrow-right' | 'mail'

// One stroke weight, square caps and mitred joins, to match the beveled marks.
const PATHS: Record<IconName, string> = {
  external: 'M7 17 17 7M9 7h8v8',
  download: 'M12 4v11m-5-5 5 5 5-5M5 20h14',
  'arrow-left': 'M20 12H4m6-6-6 6 6 6',
  'arrow-right': 'M4 12h16m-6-6 6 6-6 6',
  mail: 'M3.5 5.5h17v13h-17zM3.5 6.5 12 13l8.5-6.5',
}

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className="icon"
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
