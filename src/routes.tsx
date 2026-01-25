import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/home/Home'
import Info from './pages/info/Info'

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/info', element: <Info /> },
])
