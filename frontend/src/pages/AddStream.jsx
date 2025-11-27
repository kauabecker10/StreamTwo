import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AddStream() {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  if (!token) { navigate('/login'); return null }

  const handleSubmit = async (e) => {
  e.preventDefault()
  if (!title || !url) return alert('Título e URL são obrigatórios!')

  setLoading(true)
  try {
    await axios.post('http://localhost:3000/streams', {
      title,
      summary,
      url,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    }, { headers: { Authorization: `Bearer ${token}` } })
    alert('Vídeo publicado com sucesso!')
    navigate('/')
  } catch (err) {
    alert('Erro ao publicar. Tenta de novo.')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-[#121212] rounded-2xl shadow-2xl border border-gray-800 p-8">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Publicar novo vídeo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Título do vídeo *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: O melhor react do ano"
              className="w-full px-4 py-4 bg-[#1f1f1f] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition text-lg"
              required
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Link do YouTube *</label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-4 bg-[#1f1f1f] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition text-lg"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Descrição (opcional)</label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Fale sobre o vídeo..."
              rows="5"
              className="w-full px-4 py-4 bg-[#1f1f1f] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags (separadas por vírgula)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="react, javascript, tutorial, foda"
              className="w-full px-4 py-4 bg-[#1f1f1f] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white font-bold py-4 px-8 rounded-xl text-lg transition flex items-center justify-center gap-3"
            >
              {loading ? (
                <>Publicando...</>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Publicar vídeo
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}