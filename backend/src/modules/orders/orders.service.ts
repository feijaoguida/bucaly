import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { produto: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Seu carrinho está vazio');
    }

    let subtotal = 0;
    cart.items.forEach((item: any) => {
      subtotal += Number(item.produto.preco) * item.quantidade;
    });

    const frete = createOrderDto.metodoEnvio === 'EXPRESSO' ? 50 : 20;
    const impostos = subtotal * 0.1; // 10% simulado
    const total = subtotal + frete + impostos;

    const order = await this.prisma.order.create({
      data: {
        userId,
        enderecoId: createOrderDto.enderecoId,
        metodoPagamento: createOrderDto.metodoPagamento,
        metodoEnvio: createOrderDto.metodoEnvio,
        subtotal,
        frete,
        impostos,
        total,
        status: createOrderDto.metodoPagamento === PaymentMethod.PIX || createOrderDto.metodoPagamento === PaymentMethod.CARTAO ? OrderStatus.PROCESSANDO : OrderStatus.PENDENTE,
        items: {
          create: cart.items.map((item: any) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: item.produto.preco,
            variante: item.variante,
          })),
        },
      },
      include: { items: true },
    });

    // Limpar carrinho
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    // Deduzir estoque
    for (const item of cart.items) {
      await this.prisma.product.update({
        where: { id: item.produtoId },
        data: { estoque: { decrement: item.quantidade } },
      });
    }

    return order;
  }

  async findAllByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { produto: true } } },
    });
  }

  async findAllAdmin() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }

  async findOne(id: string, userId?: string) {
    const where = userId ? { id, userId } : { id };
    const order = await this.prisma.order.findFirst({
      where,
      include: { items: { include: { produto: true } }, endereco: true },
    });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async cancel(id: string, userId: string) {
    const order = await this.findOne(id, userId);
    if (order.status !== 'PENDENTE' && order.status !== 'PROCESSANDO') {
      throw new BadRequestException('Não é possível cancelar um pedido em andamento');
    }

    // Restore stock
    for (const item of order.items) {
      await this.prisma.product.update({
        where: { id: item.produtoId },
        data: { estoque: { increment: item.quantidade } },
      });
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELADO' },
    });
  }
}
