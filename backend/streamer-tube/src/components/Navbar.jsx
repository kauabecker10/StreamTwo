import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.get('http://localhost:3000/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setUser(res.data)).catch(() => localStorage.removeItem('token'))
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Streamer Tube</Link>
        <div className="flex gap-6 items-center">
          {user ? (
            <>
              <span>Olá, {user.email}</span>
              <Link to="/add" className="bg-white text-indigo-600 px-4 py-2 rounded font-bold hover:bg-gray-100">
                + Adicionar
              </Link>
              <button onClick={logout} className="hover:underline">Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="bg-white text-indigo-600 px-4 py-2 rounded font-bold hover:bg-gray-100">
                Registrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}