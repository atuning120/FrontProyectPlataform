import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/Auth/AuthProvider'
import Login from './pages/Login'
import Home from './pages/Home'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}