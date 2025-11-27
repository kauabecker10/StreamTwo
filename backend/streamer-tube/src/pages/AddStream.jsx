import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AddStream() {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState('')
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  if (!token) {
    navigate('/login')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3000/streams', {
        title, summary, url, tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      }, { headers: { Authorization: `Bearer ${token}` } })
      navigate('/')
    } catch (err) {
      alert('Erro ao adicionar stream')
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-8">Adicionar Novo Stream</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 border rounded" required />
        <textarea placeholder="Resumo" value={summary} onChange={e => setSummary(e.target.value)} className="w-full px-4 py-3 border rounded h-32" />
        <input placeholder="URL do vídeo" value={url} onChange={e => setUrl(e.target.value)} className="w-full px-4 py-3 border rounded" required />
        <input placeholder="Tags (separadas por vírgula)" value={tags} onChange={e => setTags(e.target.value)} className="w-full px-4 py-3 border rounded" />
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700">Publicar</button>
      </form>
    </div>
  )
}