import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import TasksPage from './pages/TasksPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'

// URL → page mapping, like ASP.NET routing / Razor Pages' @page "/login".
// The NavBar sits outside <Routes>, so it shows on every page.
export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<TasksPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
