import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Password hashing
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash('Admin@123', salt);
  const clientHash = await bcrypt.hash('Cliente@123', salt);

  // Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bucaly.com' },
    update: {},
    create: {
      email: 'admin@bucaly.com',
      senha: passwordHash,
      nome: 'Admin',
      sobrenome: 'Bucaly',
      role: Role.ADMIN,
      telefone: '(11) 99999-9999',
    },
  });

  const cliente1 = await prisma.user.upsert({
    where: { email: 'joao@cliente.com' },
    update: {},
    create: {
      email: 'joao@cliente.com',
      senha: clientHash,
      nome: 'Joao',
      sobrenome: 'Silva',
      role: Role.CLIENTE,
      telefone: '(11) 98888-8888',
    },
  });

  console.log(`Created admin: ${adminUser.email}`);
  console.log(`Created cliente: ${cliente1.email}`);

  // Categories
  const categoriasData = [
    { nome: 'Clínica e Odonto', slug: 'clinica-e-odonto', descricao: 'Materiais para clínica geral' },
    { nome: 'Ortodontia', slug: 'ortodontia', descricao: 'Materiais e bráquetes ortodônticos' },
    { nome: 'Endodontia', slug: 'endodontia', descricao: 'Limas e acessórios para tratamento de canal' },
    { nome: 'Descartáveis', slug: 'descartaveis', descricao: 'Luvas, máscaras e sugadores' },
    { nome: 'Higiene Profissional', slug: 'higiene', descricao: 'Escovas, passa fio, revelador' },
    { nome: 'Instrumentais', slug: 'instrumentais', descricao: 'Fórceps, curetas, espelhos' }
  ];

  const categorias = [];
  for (const cat of categoriasData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categorias.push(createdCat);
  }
  console.log('Criadas 6 categorias.');

  // Products
  const catClinica = categorias.find(c => c.slug === 'clinica-e-odonto');
  const catDescartaveis = categorias.find(c => c.slug === 'descartaveis');

  if (catClinica && catDescartaveis) {
    const produtosData = [
      {
        nome: 'Resina Composta',
        descricao: 'Resina para restaurações estéticas e posteriores.',
        preco: 95.50,
        precoOriginal: 110.00,
        marca: '3M',
        imagens: ['https://placehold.co/400x400/png?text=Resina'],
        estoque: 100,
        sku: 'R-COMP-01',
        categoriaId: catClinica.id,
        tags: ['resina', 'estética'],
        destaque: true,
      },
      {
        nome: 'Caixa de Luvas Latex G',
        descricao: 'Luvas de procedimento não cirúrgico.',
        preco: 32.90,
        precoOriginal: 40.00,
        marca: 'SuperMax',
        imagens: ['https://placehold.co/400x400/png?text=Luva'],
        estoque: 200,
        sku: 'LUV-LAT-G',
        categoriaId: catDescartaveis.id,
        tags: ['luva', 'descartável', 'proteção'],
        destaque: false,
      },
      {
        nome: 'Adesivo Ambar Universal',
        descricao: 'Sistema adesivo com alta resistência.',
        preco: 78.00,
        marca: 'FGM',
        imagens: ['https://placehold.co/400x400/png?text=Adesivo'],
        estoque: 50,
        sku: 'AMBAR-UNI',
        categoriaId: catClinica.id,
        novo: true,
      }
    ];

    for (const prod of produtosData) {
      await prisma.product.upsert({
        where: { sku: prod.sku },
        update: {},
        create: prod,
      });
    }
    console.log(`Criados produtos base.`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
