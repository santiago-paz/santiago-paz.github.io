import profileData from '@/data/profile.json'
import projectsData from '@/data/projects.json'
import faqData from '@/data/faq.json'
import experienceData from '@/data/experience.json'

export type ProjectGroup = 'ai-engineering' | 'ai-product' | 'creative-client'

export type RegisterEntry = { mark: string; text: string }

export type Project = {
  slug: string
  title: string
  group: ProjectGroup
  order: number
  summary: string
  role: string
  /** Layers Santiago built, in build order: the base first, deploy last. */
  built: string[]
  /** Layers designed but not built yet. */
  planned?: string[]
  /** Set when the project is not simply live or in a public repo. */
  stage?: 'In progress' | 'Waitlist'
  /** Real contents for a project with no product screen to show. */
  register?: RegisterEntry[]
  registerNote?: string
  stack: string[]
  highlights: string[]
  links: { repo?: string; demo?: string }
  disclosure?: string
  description: string
}

export type Award = {
  title: string
  org: string
  year: string
  url?: string
}

export type Language = { name: string; level: string; code: string }

export type Profile = {
  name: string
  role: string
  tagline: string
  location: string
  workAuthorization: string
  availability: string
  languages: Language[]
  email: string
  image: string
  about: string
  knowsAbout: string[]
  links: { github: string; linkedin: string; cv: string }
  sameAs: string[]
  awards: Award[]
}

export type FaqItem = { q: string; a: string }

export type Role = {
  company: string
  url?: string
  title: string
  period: string
  start: string
  end?: string
  location?: string
  note: string
}

export type Education = {
  org: string
  credential: string
  period: string
}

export type Certification = {
  name: string
  status: string
}

export type Experience = {
  summary: string
  roles: Role[]
  education: Education[]
  certifications: Certification[]
}

const profile = profileData as unknown as Profile
const projects = projectsData as unknown as Project[]
const faq = faqData as unknown as FaqItem[]
const experience = experienceData as unknown as Experience

export const GROUP_LABELS: Record<ProjectGroup, string> = {
  'ai-engineering': 'Engineering',
  'ai-product': 'Product',
  'creative-client': 'Creative & client',
}

export function getProfile(): Profile {
  return profile
}

/**
 * Projects in curated order.
 *
 * `order` is global rather than per-group: the CV leads with Contract Lens,
 * Reema and Multi-Agent Trading Desk, and the site has to open with the same
 * three. Those are also the three with a public screen and their own colorway,
 * so the plates at the top of the home page stay filled. `group` is only a
 * label on the detail page.
 */
export function getProjects(): Project[] {
  return [...projects].sort((a, b) => a.order - b.order)
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug)
}

export function getFaq(): FaqItem[] {
  return faq
}

export function getExperience(): Experience {
  return experience
}
