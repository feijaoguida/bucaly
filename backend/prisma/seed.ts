import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash('Admin@123', salt);
  const clientHash = await bcrypt.hash('Cliente@123', salt);

  // Limpando páginas legadas para evitar colisão do json para struct array
  await prisma.page.deleteMany({});

  // Pages (CMS) - Formato Elementor (Sections > Columns > Widgets)
  const homeSections = [
    {
      id: crypto.randomUUID(),
      type: 'container',
      enabled: true,
      settings: { padding: { top: '0', bottom: '0' }, fullWidth: true },
      columns: [
        {
          id: crypto.randomUUID(),
          size: '1/1',
          widgets: [
            {
              id: crypto.randomUUID(),
              type: 'banner',
              data: {
                title: 'Sorriso <span class="text-primary">Mais Saudável</span> e Brilhante',
                subtitle: 'Odontologia Afetiva',
                content: 'Experimente produtos ortodônticos e odontológicos profissionais selecionados, projetados para seu máximo conforto e sucesso clínico.',
                image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800',
                buttonText: 'Comprar Agora',
                buttonLink: '/produtos',
                secondaryButtonText: 'Ver Guia',
                secondaryButtonLink: '/sobre'
              }
            }
          ]
        }
      ]
    },
    {
      id: crypto.randomUUID(),
      type: 'container',
      enabled: true,
      settings: { background: { type: 'color', value: '#f8f9fa' }, padding: { top: '5rem', bottom: '5rem' } },
      columns: [
        {
          id: crypto.randomUUID(),
          size: '1/1',
          widgets: [
            {
              id: crypto.randomUUID(),
              type: 'categories',
              data: {
                title: 'Compre por Categoria',
                subtitle: 'Encontre exatamente o que sua rotina dental precisa',
                limit: 4
              }
            }
          ]
        }
      ]
    },
    {
      id: crypto.randomUUID(),
      type: 'container',
      enabled: true,
      settings: { padding: { top: '6rem', bottom: '6rem' } },
      columns: [
        {
          id: crypto.randomUUID(),
          size: '1/1',
          widgets: [
            {
              id: crypto.randomUUID(),
              type: 'featuredProducts',
              data: {
                title: 'Mais Vendidos',
                subtitle: 'Os produtos mais amados pela nossa comunidade',
                limit: 3
              }
            }
          ]
        }
      ]
    },
    {
      id: crypto.randomUUID(),
      type: 'container',
      enabled: true,
      settings: { padding: { top: '4rem', bottom: '4rem' } },
      columns: [
        {
          id: crypto.randomUUID(),
          size: '1/1',
          widgets: [
            {
              id: crypto.randomUUID(),
              type: 'benefits',
              data: {
                items: [
                  { title: 'Frete Grátis', subtitle: 'Em pedidos acima de R$ 200. Entrega rápida e segura para todo Brasil.', icon: 'Truck' },
                  { title: 'Pagamento Seguro', subtitle: 'Processamento de pagamento seguro com criptografia SSL de 256 bits.', icon: 'Shield' },
                  { title: '30 Dias de Devolução', subtitle: 'Garantia de satisfação. Devolução fácil em até 30 dias.', icon: 'Clock' },
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: crypto.randomUUID(),
      type: 'container',
      enabled: true,
      settings: { fullWidth: true, padding: { top: '0', bottom: '0' } },
      columns: [
        {
          id: crypto.randomUUID(),
          size: '1/1',
          widgets: [
            {
              id: crypto.randomUUID(),
              type: 'cta',
              data: {
                title: 'Pronto para vivenciar uma nova experiência em odontologia?',
                content: 'Nossa equipe está preparada para cuidar de você com todo o carinho e profissionalismo que seu sorriso merece.',
                primaryButtonText: 'Agendar Consulta',
                primaryButtonLink: '/contato',
                secondaryButtonText: 'Falar no WhatsApp',
                secondaryButtonLink: 'https://wa.me/5511999999999'
              }
            }
          ]
        }
      ]
    }
  ];

  await prisma.page.create({
    data: {
      slug: 'home',
      title: 'Home Page',
      description: 'Página inicial estruturada em módulos drag & drop.',
      sections: homeSections,
    }
  });

  const aboutSections = [
    {
      id: crypto.randomUUID(),
      type: 'container',
      enabled: true,
      settings: { padding: { top: '0', bottom: '0' }, fullWidth: true },
      columns: [
        {
          id: crypto.randomUUID(),
          size: '1/1',
          widgets: [
             {
               id: crypto.randomUUID(),
               type: 'banner',
               data: {
                 title: 'Nossa História',
                 subtitle: 'Conheça a Bucaly',
                 content: 'A Bucaly nasceu com a missão de fornecer equipamentos e materiais odontológicos de máxima qualidade com preços justos.',
                 image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800'
               }
             }
          ]
        }
      ]
    },
    {
      id: crypto.randomUUID(),
      type: 'container',
      enabled: true,
      settings: { padding: { top: '5rem', bottom: '5rem' } },
      columns: [
        {
          id: crypto.randomUUID(),
          size: '1/1',
          widgets: [
             {
               id: crypto.randomUUID(),
               type: 'text_block',
               data: {
                 title: 'Acreditamos em Odontologia Acessível',
                 content: 'Buscamos todos os dias entregar os melhores produtos das melhores marcas aos profissionais brasileiros.'
               }
             }
          ]
        }
      ]
    }
  ];

  await prisma.page.create({
    data: {
      slug: 'sobre-nos',
      title: 'Sobre Nós',
      sections: aboutSections,
    }
  });

  const headerSections = [
    {
      id: crypto.randomUUID(),
      type: 'container',
      enabled: true,
      settings: { padding: { top: '0', bottom: '0' }, fullWidth: true },
      columns: [
        {
          id: crypto.randomUUID(),
          size: '1/1',
          widgets: [
             {
               id: crypto.randomUUID(),
               type: 'header',
               data: {
                 logoUrl: '/logo.svg',
                 menuItems: [
                   { label: 'Início', link: '/' },
                   { label: 'Produtos', link: '/produtos' },
                   { label: 'Sobre', link: '/sobre' },
                   { label: 'Contato', link: '/contato' }
                 ]
               }
             }
          ]
        }
      ]
    }
  ];

  await prisma.page.create({
    data: {
      slug: 'global-header',
      title: 'Cabeçalho do Site',
      sections: headerSections,
    }
  });

  const footerSections = [
    {
      id: crypto.randomUUID(),
      type: 'container',
      enabled: true,
      settings: { padding: { top: '0', bottom: '0' }, fullWidth: true },
      columns: [
        {
          id: crypto.randomUUID(),
          size: '1/1',
          widgets: [
             {
               id: crypto.randomUUID(),
               type: 'footer',
               data: {
                 copyright: '© 2026 Bucaly. Todos os direitos reservados.',
                 links: [
                   { label: 'Política de Privacidade', link: '/privacidade' },
                   { label: 'Termos de Serviço', link: '/termos' }
                 ]
               }
             }
          ]
        }
      ]
    }
  ];

  await prisma.page.create({
    data: {
      slug: 'global-footer',
      title: 'Rodapé do Site',
      sections: footerSections,
    }
  });

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
