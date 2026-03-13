import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const skuExists = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });
    if (skuExists) throw new ConflictException('SKU já esta em uso');
    
    return this.prisma.product.create({ data: createProductDto });
  }

  async findAllPublic(filters: ProductFiltersDto) {
    const { page, limit, busca, categoria, precoMin, precoMax, disponivel, emPromocao, novidades, ordenar } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      ativo: true,
      ...(busca ? { OR: [{ nome: { contains: busca, mode: 'insensitive' as any } }, { marca: { contains: busca, mode: 'insensitive' as any } }] } : {}),
      ...(categoria ? { categoriaId: categoria } : {}),
      ...(precoMin !== undefined || precoMax !== undefined ? {
        preco: {
          ...(precoMin !== undefined ? { gte: precoMin } : {}),
          ...(precoMax !== undefined ? { lte: precoMax } : {}),
        }
      } : {}),
      ...(disponivel ? { estoque: { gt: 0 } } : {}),
      ...(emPromocao ? { precoOriginal: { not: null } } : {}),
      ...(novidades ? { novo: true } : {}),
    };

    let orderBy: any = { createdAt: 'desc' };
    if (ordenar === 'preco-asc') orderBy = { preco: 'asc' };
    if (ordenar === 'preco-desc') orderBy = { preco: 'desc' };
    if (ordenar === 'nome') orderBy = { nome: 'asc' };
    if (ordenar === 'mais-vendidos') orderBy = { avaliacoes: 'desc' }; // simplificando venda para avaliacoes

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { categoria: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAllAdmin() {
    return this.prisma.product.findMany({ include: { categoria: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id }, include: { categoria: true } });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }
  
  async getFeatured() {
    return this.prisma.product.findMany({ where: { destaque: true, ativo: true }, take: 8, include: { categoria: true } });
  }

  async getNew() {
    return this.prisma.product.findMany({ where: { novo: true, ativo: true }, take: 8, orderBy: { createdAt: 'desc' }, include: { categoria: true } });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
