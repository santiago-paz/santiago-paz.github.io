import profileData from '@/data/profile.json'
import projectsData from '@/data/projects.json'
import faqData from '@/data/faq.json'
import experienceData from '@/data/experience.json'

export type ProjectGroup = 'ai-product' | 'creative-client'

export type Project = {
  slug: string
  title: string
  group: ProjectGroup
  order: number
  summary: string
  role: string
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

export type Profile = {
  name: string
  role: string
  tagline: string
  location: string
  workAuthorization: string
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
  'ai-product': 'AI & product',
  'creative-client': 'Creative & client',
}

const groupRank = (group: ProjectGroup): number => (group === 'ai-product' ? 0 : 1)

export function getProfile(): Profile {
  return profile
}

export function getProjects(): Project[] {
  return [...projects].sort(
    (a, b) => groupRank(a.group) - groupRank(b.group) || a.order - b.order,
  )
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
