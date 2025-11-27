import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3000/auth/register', { email, password })
      alert('Conta criada! Agora faça login.')
      navigate('/login')
    } catch (err) {
      alert('Erro ao criar conta')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow">
      <h2 className="text-3xl font-bold text-center mb-8">Criar Conta</h2>
      <form onSubmit={handleRegister} className="space-y-6">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded" required />
        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded" required />
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">Registrar</button>
      </form>
    </div>
  )
}