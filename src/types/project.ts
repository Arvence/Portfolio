export interface Project {
  slug: string
  name: string
  summary: string
  description: string
  technologies: string[]
  repositoryUrl?: string
  demoUrl?: string
  featured: boolean
  placeholder?: boolean
}
