# StreamTwo — O YouTube brasileiro que você sempre quis

 
* Tema escuro perfeito, likes/dislikes, comentários próprios, compartilhamento, thumbnail real do YouTube — tudo funcionando 100%. *

![StreamerTube Preview](https://github.com/user-attachments/assets/INSIRA_UM_PRINT_BONITO_AQUI_DEPOIS.jpg)

### Funcionalidades já prontas
- Login / Registro (JWT + SQLite)
- Publicar vídeos do YouTube (título, descrição, tags)
- Página de vídeo com iframe + thumbnail real
- Likes e Dislikes (com contador e voto por usuário)
- Comentários 100% do StreamTwo (nunca vão pro YouTube original)
- Compartilhar no WhatsApp, Facebook e X
- Interface igual o YouTube 2025 (preto, vermelho, responsivo)
- Carrossel horizontal de vídeos
- Busca com ícone (em breve funcional)

### Tecnologias usadas
| Parte      | Tecnologia                          |
|------------|-------------------------------------|
| Frontend   | Vite + React + Tailwind CSS v4 + React Router |
| Backend    | Node.js + Express + Sequelize + SQLite |
| Auth       | JWT (localStorage)                  |
| Banco      | SQLite (`database.db`) — zero configuração |

### Como rodar localmente (2 terminais)

```bash
# 1. Backend
cd backend
npm install
npm start
# → http://localhost:3000

# 2. Frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173
