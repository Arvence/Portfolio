import { Route, Routes } from 'react-router'
import AppLayout from './layouts/AppLayout'
import About from './pages/About'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProjectDetails from './pages/ProjectDetails'
import Projects from './pages/Projects'
import Resume from './pages/Resume'
import Flagbit from './pages/projects/Flagbit'
import TaskForge from './pages/projects/TaskForge'
import WoWiki from './pages/projects/WoWiki'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/wowiki" element={<WoWiki />} />
        <Route path="projects/taskforge" element={<TaskForge />} />
        <Route path="projects/flagbit" element={<Flagbit />} />
        <Route path="projects/:slug" element={<ProjectDetails />} />
        <Route path="resume" element={<Resume />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
