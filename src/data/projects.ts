import type { Project } from '../types/project'

export const projects: Project[] = [
  {
    slug: 'placeholder-project-one',
    name: 'Project one',
    summary: 'A space for the first project: its purpose, the problem it solves, and what makes it useful.',
    description:
      'This is a placeholder project. Replace this overview with the project context, your contribution, key decisions, and what you learned.',
    technologies: [],
    featured: true,
    placeholder: true,
  },
  {
    slug: 'placeholder-project-two',
    name: 'Project two',
    summary: 'A space for another project, with a short introduction and a closer look at the work.',
    description:
      'This is a placeholder project. Use this space to explain the idea, the implementation, and the outcome once real project content is available.',
    technologies: [],
    featured: true,
    placeholder: true,
  },
  {
    slug: 'placeholder-project-three',
    name: 'Project three',
    summary: 'A space for an experiment, a small tool, or another piece of development work.',
    description:
      'This is a placeholder project. Add the motivation, the approach, and the lessons learned when this entry is ready to share.',
    technologies: [],
    featured: false,
    placeholder: true,
  },
]

export const featuredProjects = projects.filter((project) => project.featured)
