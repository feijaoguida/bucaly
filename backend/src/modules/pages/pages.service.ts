import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePageDto } from './dto/update-page.dto';

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
          sections: {
            hero: { enabled: true, title: `Bem-vindo à ${title}`, subtitle: 'Gerencie de forma dinâmica' }
          }
        }
      });
    }

    return page;
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
