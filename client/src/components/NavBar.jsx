import { NavLink } from 'react-router-dom'

// NavLink adds class="active" to the link for the current URL (styled in index.css).
// `end` on "/" means it's only active on exactly "/", not on every path.
export default function NavBar() {
  return (
    <nav>
      <NavLink to="/" end>
        Tasks
      </NavLink>
      <NavLink to="/login">Log in</NavLink>
      <NavLink to="/register">Register</NavLink>
    </nav>
  )
}
