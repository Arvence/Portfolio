import { Link } from 'react-router'
import { projects } from '../data/projects'

export default function Projects() {
  return (
    <div className="space-y-4">
      <title>Projects | Portfolio</title>
      <h1>Projects</h1>
      {projects.length === 0 ? (
        <p>No projects have been added yet.</p>
      ) : (
        <ul className="space-y-6">
          {projects.map((project) => (
            <li key={project.slug} className="space-y-2">
              <h2>
                <Link to={`/projects/${encodeURIComponent(project.slug)}`} className="underline">
                  {project.name}
                </Link>
              </h2>
              <p>{project.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
