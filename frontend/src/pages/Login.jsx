import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:3000/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch {
      alert('Email ou senha errados')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#121212] rounded-2xl shadow-2xl border border-gray-800 p-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white">S</div>
          <h1 className="text-3xl font-bold text-white">Entrar no StreamerTube</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-5 py-4 bg-[#1f1f1f] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition text-lg"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full px-5 py-4 bg-[#1f1f1f] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition text-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white font-bold py-4 rounded-xl text-lg transition"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Não tem conta? <Link to="/register" className="text-blue-500 hover:underline font-medium">Criar agora</Link>
        </p>
      </div>
    </div>
  )
}