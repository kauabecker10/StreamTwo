import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('http://localhost:3000/auth/register', { email, password })
      alert('Conta criada! Agora faça login.')
      navigate('/login')
    } catch {
      alert('Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#121212] rounded-2xl shadow-2xl border border-gray-800 p-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white">S</div>
          <h1 className="text-3xl font-bold text-white">Criar conta no StreamerTube</h1>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-5 py-4 bg-[#1f1f1f] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition text-lg" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" className="w-full px-5 py-4 bg-[#1f1f1f] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition text-lg" required />

          <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-900 text-white font-bold py-4 rounded-xl text-lg transition">
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Já tem conta? <Link to="/login" className="text-blue-500 hover:underline font-medium">Fazer login</Link>
        </p>
      </div>
    </div>
  )
}