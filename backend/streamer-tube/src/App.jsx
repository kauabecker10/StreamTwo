import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AddStream from './pages/AddStream'
import StreamDetail from './pages/StreamDetail'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add" element={<AddStream />} />
          <Route path="/stream/:id" element={<StreamDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App