@echo off
echo =========================================
echo === Inicializando Backend (Windows) ===
echo =========================================

REM 0. Criar .env se nao existir
IF NOT EXIST ".env" (
    echo DATABASE_URL="file:./dev.db" > .env
    echo .env criado com DATABASE_URL padrão.
)

REM 1. Instalar dependências
echo -----------------------------------------
echo Instalando dependencias...
call npm install

REM 2. Gerar Prisma Client
echo -----------------------------------------
echo Gerando Prisma Client...
call npx prisma generate --schema=./prisma/schema.prisma

REM 3. Rodar migrations
echo -----------------------------------------
echo Aplicando migrations...
call npx prisma migrate deploy --schema=./prisma/schema.prisma

REM 4. Build do backend (compila TS para JS)
echo -----------------------------------------
echo Compilando backend...
call npm run build

REM 5. Criar usuário admin padrão
echo -----------------------------------------
echo Criando usuario admin padrão...
call node scripts\create-admin.js

echo =========================================
echo === Backend configurado com sucesso! ===
echo =========================================
pause
