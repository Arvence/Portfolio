import { Route, Routes } from 'react-router'
import AppLayout from './layouts/AppLayout'
import About from './pages/About'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProjectDetails from './pages/ProjectDetails'
import Projects from './pages/Projects'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectDetails />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
