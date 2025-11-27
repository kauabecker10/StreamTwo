import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Home() {
  const [streams, setStreams] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get(`http://localhost:3000/streams?search=${search}`)
      .then(res => setStreams(res.data.streams || res.data))
      .catch(() => setStreams([]))
  }, [search])

  return (
    <div className="max-w-7xl mx-auto p-6">
      <input
        type="text"
        placeholder="Buscar streams..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-xl mb-8 px-4 py-3 rounded-lg border"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {streams.map(s => (
          <Link key={s.id} to={`/stream/${s.id}`} className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden">
            <div className="bg-gray-300 h-48 border-2 border-dashed" />
            <div className="p-4">
              <h3 className="font-bold text-lg">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.summary?.slice(0, 80)}...</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {s.tags?.map(t => <span key={t} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">{t}</span>)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}