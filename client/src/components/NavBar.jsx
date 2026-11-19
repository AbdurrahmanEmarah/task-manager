import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

// NavLink adds class="active" to the link for the current URL (styled in index.css).
// `end` on "/" means it's only active on exactly "/", not on every path.
export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav>
      {user ? (
        <>
          <NavLink to="/" end>
            Tasks
          </NavLink>
          <span className="nav-right">
            <span className="muted">{user.email}</span>
            <button onClick={handleLogout}>Log out</button>
          </span>
        </>
      ) : (
        <>
          <NavLink to="/login">Log in</NavLink>
          <NavLink to="/register">Register</NavLink>
        </>
      )}
    </nav>
  )
}
