# Servidor Express com Prisma e PostgreSQL no Docker

Este projeto é um servidor Express que utiliza Prisma para acessar um banco de dados PostgreSQL rodando em um contêiner Docker.

## 📦 Requisitos
Antes de iniciar, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (mesma versão usada no desenvolvimento)
- [Docker e Docker Compose](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/)

## 🚀 Instalação e Configuração

### 1️⃣ Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2️⃣ Instalar Dependências
```bash
npm install
```

### 3️⃣ Configurar Variáveis de Ambiente
Crie um arquivo `.env` e configure as variáveis necessárias, como a conexão com o banco de dados:
```ini
DATABASE_URL=postgresql://usuario:senha@localhost:5432/seu_banco
PORT=3000
```
Se houver um `.env.example`, copie e edite conforme necessário:
```bash
cp .env.example .env
```

### 4️⃣ Subir o Banco de Dados no Docker
```bash
docker-compose up -d
```
Verifique se o container está rodando:
```bash
docker ps
```

### 5️⃣ Aplicar Migrações do Prisma
```bash
npx prisma migrate deploy
npx prisma generate  # Opcional
```

### 6️⃣ Iniciar o Servidor
```bash
npm run dev  # Ou npm start, dependendo da configuração
```
Se quiser rodar o servidor em segundo plano, utilize **PM2**:
```bash
npm install -g pm2
pm2 start npm --name "meu-servidor" -- run dev
```

## 🛠 Comandos Úteis
| Comando                      | Descrição                                    |
|------------------------------|----------------------------------------------|
| `docker-compose up -d`       | Inicia os containers do Docker              |
| `docker-compose down`        | Para e remove os containers                 |
| `npx prisma migrate deploy`  | Aplica as migrações do banco de dados       |
| `npm run dev`                | Inicia o servidor Express                   |
| `pm2 restart meu-servidor`   | Reinicia o servidor rodando com PM2         |
| `pm2 stop meu-servidor`      | Para o servidor rodando com PM2             |

## 📡 Testando a API
Após iniciar o servidor, você pode testar se está rodando acessando:
```
http://localhost:3000
```
Ou utilizando `curl`:
```bash
curl http://localhost:3000
```

## 🏗 Estrutura do Projeto
```
📁 meu-projeto
├── 📂 src
│   ├── 📂 controllers
│   ├── 📂 models
│   ├── 📂 routes
│   ├── 📂 database
│   ├── server.ts
├── 📂 prisma
│   ├── schema.prisma
├── 📄 docker-compose.yml
├── 📄 .env.example
├── 📄 package.json
└── 📄 README.md
```

## 📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

