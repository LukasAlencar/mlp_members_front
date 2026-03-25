const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const email = "mlpadmin@example.com"; // ALTERAR
  const password = "MlpAdmin!2025"; // ALTERAR
  const name = "Administrador";

  // Verifica se já existe
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("⚠️ Usuário admin já existe, não será recriado.");
    return;
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criação
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  console.log("✅ Usuário admin criado:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
