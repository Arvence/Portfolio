import type { Project } from '../types/project'

export const projects: Project[] = [
  {
    slug: 'wowiki',
    name: 'WoWiki',
    category: 'Full Stack Application',
    summary: 'A World of Warcraft Classic platform for game information, community content, and raid planning.',
    description:
      'WoWiki combines a React frontend, a NestJS content API, ASP.NET Core services, and a YARP gateway with local SQLite storage.',
    technologies: ['React', 'TypeScript', 'NestJS', 'ASP.NET Core', 'SQLite'],
    featured: true,
  },
  {
    slug: 'taskforge',
    name: 'TaskForge',
    category: 'Background Job System',
    summary:
      'An HTTP job orchestration server that manages job lifecycles, retries, cancellation, and recovery for external workers.',
    description:
      'TaskForge persists jobs and execution attempts in SQL Server while external clients execute business logic through HTTP or the optional .NET SDK.',
    technologies: ['C#', '.NET', 'SQL Server', 'Docker'],
    featured: true,
  },
  {
    slug: 'flagbit',
    name: 'Flagbit',
    category: 'Feature Flag Service',
    summary:
      'A feature flag service with centralized management, contextual evaluation, percentage rollouts, and an optional .NET SDK.',
    description:
      'Flagbit stores flag definitions in PostgreSQL and exposes HTTP and CLI workflows for environments, targeting rules, schedules, and dependencies.',
    technologies: ['C#', '.NET', 'PostgreSQL', 'Entity Framework Core'],
    featured: true,
  },
]

export const featuredProjects = projects.filter((project) => project.featured)
