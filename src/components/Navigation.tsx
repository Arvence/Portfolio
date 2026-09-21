import { NavLink } from 'react-router'

export default function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-wrap gap-6">
        <li>
          <NavLink
            to="/"
            end
            className="text-neutral-300 hover:text-white aria-[current=page]:text-white aria-[current=page]:underline"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/projects"
            className="text-neutral-300 hover:text-white aria-[current=page]:text-white aria-[current=page]:underline"
          >
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className="text-neutral-300 hover:text-white aria-[current=page]:text-white aria-[current=page]:underline"
          >
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
