export interface TechStackRow {
  id: string
  label: string
  technologies: readonly string[]
  direction: 'left' | 'right'
  durationSeconds: number
}

export const techStackRows: readonly TechStackRow[] = [
  {
    id: 'backend',
    label: 'Backend and languages',
    technologies: ['C#', '.NET', 'ASP.NET Core', 'Entity Framework Core', 'Node.js', 'NestJS', 'REST APIs'],
    direction: 'left',
    durationSeconds: 90,
  },
  {
    id: 'frontend',
    label: 'Frontend',
    technologies: ['TypeScript', 'JavaScript', 'React', 'HTML5', 'CSS3', 'Vite'],
    direction: 'right',
    durationSeconds: 70,
  },
  {
    id: 'databases',
    label: 'Databases',
    technologies: ['SQL', 'SQL Server', 'PostgreSQL', 'MongoDB', 'SQLite'],
    direction: 'left',
    durationSeconds: 60,
  },
  {
    id: 'tools',
    label: 'Tools and infrastructure',
    technologies: ['Docker', 'Git', 'GitHub Actions', 'CI/CD', 'Postman', 'AWS (basics)'],
    direction: 'right',
    durationSeconds: 75,
  },
]
