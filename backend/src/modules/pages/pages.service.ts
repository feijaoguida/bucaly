import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePageDto } from './dto/update-page.dto';
import { CreatePageDto } from './dto/create-page.dto';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  // Esse método rodará no seed ou internamente para criar uma página se ela não existir
  private async ensurePageExists(slug: string, title: string) {
    let page = await this.prisma.page.findUnique({
      where: { slug }
    });

    if (!page) {
      page = await this.prisma.page.create({
        data: {
          slug,
          title,
          sections: [
            {
              id: crypto.randomUUID(),
              type: 'banner',
              name: 'Banner Principal',
              enabled: true,
              data: {
                title: `Bem-vindo à ${title}`,
                subtitle: 'Gerencie de forma dinâmica',
                image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800'
              }
            }
          ]
        }
      });
    }

    return page;
  }

  async create(createPageDto: CreatePageDto) {
    let rawSlug = createPageDto.slug || createPageDto.title;
    // Normalizar slug: minúsculo, sem acentos, espaços viram hífen
    const slug = rawSlug.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const exists = await this.prisma.page.findUnique({ where: { slug } });
    if (exists) {
      throw new BadRequestException('Já existe uma página com este URL (slug).');
    }

    return this.prisma.page.create({
      data: {
        slug,
        title: createPageDto.title,
        sections: [] // Começa como um construtor vazio "Container / Linhas" - Sem dados mockados
      }
    });
  }

  async findBySlug(slug: string) {
    // Busca a página na base. Se não existir, em tempo de execução nós criamos um formato vazio para o Admin personalizar
    const names: Record<string, string> = {
      'home': 'Home Page',
      'sobre-nos': 'Sobre Nós',
      'produtos': 'Catálogo de Produtos',
      'contato': 'Contato',
      'carrinho': 'Carrinho de Compras'
    };

    const title = names[slug] || slug.toUpperCase();
    return this.ensurePageExists(slug, title);
  }

  async findAll() {
    return this.prisma.page.findMany();
  }

  async update(slug: string, updatePageDto: UpdatePageDto) {
    // Certifica-se de que a página já existe (e caso sim, a edita)
    await this.findBySlug(slug);

    return this.prisma.page.update({
      where: { slug },
      data: updatePageDto,
    });
  }
}
