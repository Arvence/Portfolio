import type { Project } from '../types/project'

export const projects: Project[] = [
  {
    slug: 'taskforge',
    name: 'TaskForge',
    category: 'Background Job System',
    summary:
      'An HTTP job orchestration server that manages job lifecycles, retries, cancellation, and recovery for external workers.',
    description:
      'TaskForge persists jobs and execution attempts in SQL Server while external clients execute business logic through HTTP or the optional .NET SDK.',
    technologies: ['C#', '.NET', 'SQL Server', 'Docker'],
    repositoryUrl: 'https://github.com/Arvence/TaskForge',
    walkthrough: true,
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
    repositoryUrl: 'https://github.com/Arvence/Flagbit',
    walkthrough: true,
    featured: true,
  },
  {
    slug: 'wowiki',
    name: 'WoWiki',
    category: 'Full Stack Application',
    summary: 'A World of Warcraft Classic platform for game information, community content, and raid planning.',
    description:
      'WoWiki combines a React frontend, a NestJS content API, ASP.NET Core services, and a YARP gateway with local SQLite storage.',
    technologies: ['React', 'TypeScript', 'NestJS', 'ASP.NET Core', 'SQLite'],
    repositoryUrl: 'https://github.com/Arvence/WoWiki',
    featured: true,
  },
  {
    slug: 'fableai',
    name: 'FableAI',
    category: 'Generative AI Application',
    summary: 'A local AI writing app for explicitly fictional news, announcements, articles, and blog drafts.',
    description:
      'FableAI uses Gemini to generate structured fictional drafts, with conversation context, revision history, and local SQLite storage.',
    technologies: ['Python', 'FastAPI', 'React', 'TypeScript', 'Google Gemini', 'SQLite'],
    repositoryUrl: 'https://github.com/Arvence/FableAI',
    featured: true,
  },
  {
    slug: 'pictopia',
    name: 'Pictopia',
    category: 'Full Stack Image-Sharing Platform',
    summary: 'A social gallery for publishing, discovering, and saving visual stories.',
    description:
      'Pictopia pairs a responsive React frontend with a NestJS REST API and MongoDB, supporting image uploads, personalized feeds, favorites, comments, and profiles.',
    technologies: ['React', 'TypeScript', 'NestJS', 'MongoDB', 'Zustand', 'Tailwind CSS'],
    repositoryUrl: 'https://github.com/Arvence/Pictopia',
    featured: true,
  },
]

export const featuredProjects = projects.filter((project) => project.featured)
