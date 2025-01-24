## FIAP Hackathon Server
Este é o back-end do projeto desenvolvido para o hackathon da FIAP, como parte da pós-graduação em Desenvolvimento Full Stack. O objetivo do projeto é fornecer uma API robusta e escalável, com foco em segurança, performance e boas práticas de desenvolvimento.

### 🚀 Tecnologias Utilizadas
- Node.js.
- Express.js.
- MongoDB.
- Mongoose.
- JWT.
- Rate Limiter.
- Bcrypt.
- Dotenv.

### 📂 Estrutura do Projeto

├── src

│   ├── Controllers       # Controladores das rotas

│   ├── Middlewares       # Middlewares para autenticação e validação

│   ├── Models            # Lógica de interação com o banco de dados

│   ├── Routers           # Rotas da API

│   ├── Schemas           # Schemas do MongoDB com Mongoose

│   └── Utils             # Funções utilitárias reutilizáveis

├── .env                  # Variáveis de ambiente

├── package.json          # Dependências e scripts do projeto

└── README.md             # Documentação do projeto

## ⚙️ Instalação e Uso

**Pré-requisitos**
- Node.js instalado.
- MongoDB configurado.
- Repositório clonado para sua máquina.

**Passos para Instalar**
- Clone o repositório:
git clone https://github.com/oPedroFlores/fiap-hackathon-server.git

- Acesse o diretório do projeto:
cd fiap-hackathon-server

- Instale as dependências:
npm install

- Configure as variáveis de ambiente:
PORT=8090
MONGO_URL=<sua_url_do_mongodb>
JWT_SECRET=<sua_chave_secreta_jwt>

- Inicie o servidor:
npm start

Acesse a aplicação em http://localhost:8090.
