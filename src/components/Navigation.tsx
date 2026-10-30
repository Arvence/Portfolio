import { FileText, FolderKanban, House } from 'lucide-react'
import { NavLink } from 'react-router'

export default function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <li>
          <NavLink to="/" end className="nav-link" aria-label="Home">
            <House size={20} aria-hidden="true" />
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className="nav-link" aria-label="Projects">
            <FolderKanban size={20} aria-hidden="true" />
            <span>Projects</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/resume" className="nav-link" aria-label="Resume">
            <FileText size={20} aria-hidden="true" />
            <span>Resume</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
