// TABELA DE LIKES/DISLIKES
const Like = sequelize.define('Like', {
  type: { type: DataTypes.ENUM('like', 'dislike'), allowNull: false }
});
Like.belongsTo(User);
Like.belongsTo(Stream);
Stream.hasMany(Like);

// TABELA DE COMENTÁRIOS
const Comment = sequelize.define('Comment', {
  text: { type: DataTypes.TEXT, allowNull: false }
});
Comment.belongsTo(User);
Comment.belongsTo(Stream);
Stream.hasMany(Comment);
User.hasMany(Comment);

// Sincroniza as tabelas novas
sequelize.sync();

// ROTAS DE LIKE
app.post('/streams/:id/like', auth, async (req, res) => {
  const stream = await Stream.findByPk(req.params.id);
  if (!stream) return res.status(404).json({ error: 'Vídeo não encontrado' });

  await Like.destroy({ where: { userId: req.user.id, streamId: req.params.id } });
  await Like.create({ type: req.body.type, userId: req.user.id, streamId: req.params.id });

  const likes = await Like.count({ where: { streamId: req.params.id, type: 'like' } });
  const dislikes = await Like.count({ where: { streamId: req.params.id, type: 'dislike' } });
  res.json({ likes, dislikes });
});

// ROTA DE COMENTÁRIOS
app.post('/streams/:id/comments', auth, async (req, res) => {
  const comment = await Comment.create({
    text: req.body.text,
    userId: req.user.id,
    streamId: req.params.id
  });
  const c = await Comment.findByPk(comment.id, { include: [User] });
  res.json(c);
});

app.get('/streams/:id/comments', async (req, res) => {
  const comments = await Comment.findAll({
    where: { streamId: req.params.id },
    include: [{ model: User, attributes: ['email'] }],
    order: [['createdAt', 'DESC']]
  });
  res.json(comments);

  // Rota pra pegar voto do usuário logado
app.get('/streams/:id/myvote', auth, async (req, res) => {
  const vote = await Like.findOne({ where: { userId: req.user.id, streamId: req.params.id } })
  res.json(vote || {})
})

// Rota pra contar likes/dislikes (corrigida)
app.get('/streams/:id/likes', async (req, res) => {
  const likes = await Like.count({ where: { streamId: req.params.id, type: 'like' } })
  const dislikes = await Like.count({ where: { streamId: req.params.id, type: 'dislike' } })
  res.json({ likes, dislikes })
})
});