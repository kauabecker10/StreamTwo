import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:3000/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch (err) {
      alert('Login ou senha incorretos')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow">
      <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
      <form onSubmit={handleLogin} className="space-y-6">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded" required />
        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded" required />
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700">Entrar</button>
      </form>
    </div>
  )
}