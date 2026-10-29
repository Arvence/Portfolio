export interface Project {
  slug: string
  name: string
  category: string
  summary: string
  description: string
  technologies: string[]
  coverImage?: {
    src: string
    alt: string
  }
  repositoryUrl?: string
  liveUrl?: string
  featured: boolean
}
