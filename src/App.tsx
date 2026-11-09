import { Route, Routes } from 'react-router'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Flagbit from './pages/projects/Flagbit'
import TaskForge from './pages/projects/TaskForge'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="projects/taskforge" element={<TaskForge />} />
        <Route path="projects/flagbit" element={<Flagbit />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
