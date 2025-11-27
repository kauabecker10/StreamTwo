import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Home() {
  const [streams, setStreams] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/streams')
      .then(r => setStreams(r.data.streams || []))
  }, [])

  const getYouTubeThumbnail = (url) => {
    const videoId = url.includes('v=') 
      ? url.split('v=')[1].split('&')[0] 
      : url.split('/').pop()
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  if (streams.length === 0) {
    return (
      <div className="text-center py-32">
        <h2 className="text-3xl mb-4 text-white">Nenhum vídeo ainda</h2>
        <Link to="/add" className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-full text-xl font-bold inline-block">
          Seja o primeiro a postar!
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 px-2 text-white">Vídeos em destaque</h2>
      
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {streams.map(s => (
          <Link key={s.id} to={`/watch/${s.id}`} className="group cursor-pointer">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
              <img 
                src={getYouTubeThumbnail(s.url)} 
                alt={s.title}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition"></div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                YouTube
              </div>
            </div>
            <h3 className="font-bold text-lg line-clamp-2 text-white group-hover:text-red-500 transition">{s.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{s.summary || 'Sem descrição'}</p>
            <p className="text-xs text-gray-500 mt-2">{s.tags?.join(' • ') || ''}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}