import { NavLink } from 'react-router'

export default function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-wrap gap-5 sm:gap-7">
        <li>
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className="nav-link">
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
