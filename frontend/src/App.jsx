import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AddStream from './pages/AddStream'
import Watch from './pages/Watch'   // ← ADICIONA ESSA LINHA
import Navbar from './components/Navbar'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0f0f0f]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add" element={<AddStream />} />
          <Route path="/watch/:id" element={<Watch />} />   // ← NOVA ROTA
        </Routes>
      </div>
    </BrowserRouter>
  )
}