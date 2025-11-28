const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Sequelize, DataTypes } = require('sequelize')

const app = express()
app.use(cors())
app.use(express.json())

// Banco SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.db',
  logging: false
})

// Modelos
const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }
})

const Stream = sequelize.define('Stream', {
  title: { type: DataTypes.STRING, allowNull: false },
  summary: DataTypes.TEXT,
  url: { type: DataTypes.STRING, allowNull: false },
  tags: DataTypes.JSON
})
Stream.belongsTo(User)

// Likes/Dislikes
const Like = sequelize.define('Like', {
  type: { type: DataTypes.ENUM('like', 'dislike'), allowNull: false }
})
Like.belongsTo(User)
Like.belongsTo(Stream)
Stream.hasMany(Like)

// Comentários
const Comment = sequelize.define('Comment', {
  text: { type: DataTypes.TEXT, allowNull: false }
})
Comment.belongsTo(User)
Comment.belongsTo(Stream)
Stream.hasMany(Comment)
User.hasMany(Comment)

// Middleware de autenticação
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token necessário' })
  try {
    req.user = jwt.verify(token, 'secret123')
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido' })
  }
}

// Rotas de Auth
app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body
  const hash = await bcrypt.hash(password, 10)
  try {
    const user = await User.create({ email, password: hash })
    res.json({ message: 'Usuário criado' })
  } catch (err) {
    res.status(400).json({ error: 'Email já existe' })
  }
})

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }
  const token = jwt.sign({ id: user.id, email: user.email }, 'secret123', { expiresIn: '7d' })
  res.json({ token })
})

app.get('/auth/me', auth, async (req, res) => {
  const user = await User.findByPk(req.user.id)
  res.json({ email: user.email })
})

// Rotas de Streams
app.get('/streams', async (req, res) => {
  const streams = await Stream.findAll({
    include: [{ model: User, attributes: ['email'] }],
    order: [['createdAt', 'DESC']]
  })
  res.json({ streams })
})

app.get('/streams/:id', async (req, res) => {
  const stream = await Stream.findByPk(req.params.id, {
    include: [{ model: User, attributes: ['email'] }]
  })
  if (!stream) return res.status(404).json({ error: 'Vídeo não encontrado' })
  res.json(stream)
})

app.post('/streams', auth, async (req, res) => {
  const { title, summary, url, tags } = req.body
  const stream = await Stream.create({
    title, summary, url, tags, userId: req.user.id
  })
  res.json(stream)
})

// Likes
app.post('/streams/:id/like', auth, async (req, res) => {
  const stream = await Stream.findByPk(req.params.id)
  if (!stream) return res.status(404).json({ error: 'Vídeo não encontrado' })

  await Like.destroy({ where: { userId: req.user.id, streamId: req.params.id } })
  if (req.body.type) {
    await Like.create({ type: req.body.type, userId: req.user.id, streamId: req.params.id })
  }

  const likes = await Like.count({ where: { streamId: req.params.id, type: 'like' } })
  const dislikes = await Like.count({ where: { streamId: req.params.id, type: 'dislike' } })
  res.json({ likes, dislikes })
})

app.get('/streams/:id/likes', async (req, res) => {
  const likes = await Like.count({ where: { streamId: req.params.id, type: 'like' } })
  const dislikes = await Like.count({ where: { streamId: req.params.id, type: 'dislike' } })
  res.json({ likes, dislikes })
})

app.get('/streams/:id/myvote', auth, async (req, res) => {
  const vote = await Like.findOne({ where: { userId: req.user.id, streamId: req.params.id } })
  res.json(vote || {})
})

// Comentários
app.post('/streams/:id/comments', auth, async (req, res) => {
  const comment = await Comment.create({
    text: req.body.text,
    userId: req.user.id,
    streamId: req.params.id
  })
  const c = await Comment.findByPk(comment.id, { include: [User] })
  res.json(c)
})

app.get('/streams/:id/comments', async (req, res) => {
  const comments = await Comment.findAll({
    where: { streamId: req.params.id },
    include: [{ model: User, attributes: ['email'] }],
    order: [['createdAt', 'DESC']]
  })
  res.json(comments)
})

// Sincroniza banco e inicia servidor
sequelize.sync({ alter: true }).then(() => {
  app.listen(3000, () => {
    console.log('Backend rodando em http://localhost:3000')
    console.log('StreamerTube 2025 ativo!')
  })
})