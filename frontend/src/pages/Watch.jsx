import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Watch() {
  const { id } = useParams()
  const [stream, setStream] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [userVote, setUserVote] = useState(null)  // null, 'like' ou 'dislike'
  const token = localStorage.getItem('token')

  useEffect(() => {
    loadEverything()
  }, [id])

  const loadEverything = async () => {
    // Carrega o vídeo
    const videoRes = await axios.get(`http://localhost:3000/streams/${id}`)
    setStream(videoRes.data)

    // Carrega contagem de likes/dislikes
    const likesRes = await axios.get(`http://localhost:3000/streams/${id}/likes`)
    setLikes(likesRes.data.likes || 0)
    setDislikes(likesRes.data.dislikes || 0)

    // Se tá logado, verifica se já votou
    if (token) {
      try {
        const voteRes = await axios.get(`http://localhost:3000/streams/${id}/myvote`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUserVote(voteRes.data.type || null)
      } catch (err) {
        setUserVote(null)
      }
    }

    // Carrega comentários
    const commentsRes = await axios.get(`http://localhost:3000/streams/${id}/comments`)
    setComments(commentsRes.data)
  }

  const handleVote = async (type) => {
    if (!token) return alert('Faça login pra votar!')
    
    await axios.post(`http://localhost:3000/streams/${id}/like`, { type }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    loadEverything()  // recarrega tudo certinho
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!token) return alert('Faça login pra comentar!')
    await axios.post(`http://localhost:3000/streams/${id}/comments`, { text: newComment }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setNewComment('')
    loadEverything()
  }

  const share = (platform) => {
    const url = window.location.href
    const text = `Assista: ${stream?.title || 'Vídeo foda no StreamerTube'}`
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`)
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
    if (platform === 'x') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`)
  }

  if (!stream) return <div className="text-white text-center py-32 text-2xl">Carregando vídeo...</div>

  const embedUrl = stream.url.replace("watch?v=", "embed/").split("&")[0]

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-8 text-white">
      <Link to="/" className="text-blue-400 hover:underline mb-6 inline-block">← Voltar</Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Vídeo */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            <iframe src={embedUrl} className="w-full h-full" allowFullScreen allow="autoplay"></iframe>
          </div>

          <h1 className="text-3xl font-bold mt-6">{stream.title}</h1>
          <p className="text-gray-400 mt-2 text-lg">{stream.summary || 'Sem descrição'}</p>

          {/* LIKES / DISLIKES + COMPARTILHAR */}
          <div className="flex items-center justify-between mt-8 py-6 border-b border-gray-800">
            <div className="flex items-center gap-8">
              {/* LIKE */}
              <button
                onClick={() => handleVote('like')}
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition ${userVote === 'like' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.96 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                </svg>
                <span className="font-bold text-lg">{likes}</span>
              </button>

              {/* DISLIKE - MÃOZINHA CORRIGIDA */}
              <button
                onClick={() => handleVote('dislike')}
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition ${userVote === 'dislike' ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <svg className="w-7 h-7 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.96 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                </svg>
                <span className="font-bold text-lg">{dislikes}</span>
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={() => share('whatsapp')} className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-full font-medium flex items-center gap-2">
                WhatsApp
              </button>
              <button onClick={() => share('facebook')} className="bg-blue-700 hover:bg-blue-800 px-5 py-3 rounded-full font-medium">
                Facebook
              </button>
              <button onClick={() => share('x')} className="bg-black hover:bg-gray-900 border border-gray-700 px-5 py-3 rounded-full font-medium">
                X
              </button>
            </div>
          </div>

          {/* COMENTÁRIOS */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6">Comentários ({comments.length})</h2>
            
            {token ? (
              <form onSubmit={handleComment} className="mb-10">
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="O que achou do vídeo?"
                  className="w-full bg-[#1f1f1f] border border-gray-700 rounded-xl p-5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
                  rows="4"
                  required
                />
                <div className="flex justify-end mt-3">
                  <button type="submit" className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-bold text-lg">
                    Comentar
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-400 mb-8">Faça login para comentar</p>
            )}

            <div className="space-y-6">
              {comments.map(c => (
                <div key={c.id} className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {c.User.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 bg-[#1f1f1f] rounded-xl p-5">
                    <p className="font-medium text-lg">{c.User.email.split('@')[0]}</p>
                    <p className="text-gray-300 mt-1">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}