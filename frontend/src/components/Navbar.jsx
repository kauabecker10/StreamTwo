import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.get('http://localhost:3000/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem('token'))
    }
  }, [])

  const logout = () => { 
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      // depois você conecta com a busca real
      alert('Pesquisando por: ' + search)
    }
  }

  return (
    <div className="bg-[#0f0f0f] border-b border-gray-800 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 flex-shrink-0">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">S</div>
          <h1 className="text-2xl font-bold hidden sm:block">Streamer<span className="text-red-600">Tube</span></h1>
        </Link>

        {/* BARRA DE PESQUISA PERFEITA */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
          <div className="flex">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar"
              className="flex-1 bg-[#121212] border border-gray-700 rounded-l-full pl-5 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white transition"
            />
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 border border-l-0 border-gray-700 rounded-r-full px-6 flex items-center justify-center transition"
            >
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* PERFIL + BOTÕES */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user.email.split('@')[0]}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>

              <Link to="/add" className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-full font-medium flex items-center gap-2 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Criar
              </Link>

              <button onClick={logout} className="text-gray-300 hover:text-white font-medium">
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black px-6 py-3 rounded-full font-medium transition">
              Fazer login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}