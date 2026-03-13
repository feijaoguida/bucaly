import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddCartItemDto, MergeCartDto, UpdateCartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) throw new NotFoundException('Requer userId ou sessionId');

    const where = userId ? { userId } : { sessionId };
    let cart = await this.prisma.cart.findUnique({ where, include: { items: { include: { produto: true } } } });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
          sessionId: userId ? null : sessionId,
        },
        include: { items: { include: { produto: true } } },
      });
    }
    return cart;
  }

  async getCart(userId?: string, sessionId?: string) {
    return this.getOrCreateCart(userId, sessionId);
  }

  async addItem(userId: string | undefined, dto: AddCartItemDto) {
    const cart = await this.getOrCreateCart(userId, dto.sessionId);

    // check if item exists
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        produtoId: dto.produtoId,
        variante: dto.variante || null,
      },
    });

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantidade: existingItem.quantidade + dto.quantidade },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          produtoId: dto.produtoId,
          quantidade: dto.quantidade,
          variante: dto.variante,
        },
      });
    }

    return this.getCart(userId, dto.sessionId);
  }

  async updateItemQuantity(userId: string | undefined, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.getOrCreateCart(userId, dto.sessionId);
    
    const item = await this.prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
    if (!item) throw new NotFoundException('Item não encontrado ou já deletado');

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantidade: dto.quantidade },
    });

    return this.getCart(userId, dto.sessionId);
  }

  async removeItem(userId: string | undefined, itemId: string, sessionId?: string) {
    await this.prisma.cartItem.delete({ where: { id: itemId } }).catch(() => null);
    return this.getCart(userId, sessionId);
  }

  async clearCart(userId: string | undefined, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.getCart(userId, sessionId);
  }

  async mergeCart(userId: string, dto: MergeCartDto) {
    const userCart = await this.getOrCreateCart(userId);
    const sessionCart = await this.prisma.cart.findUnique({
      where: { sessionId: dto.sessionId },
      include: { items: true },
    });

    if (sessionCart && sessionCart.items.length > 0) {
      for (const item of sessionCart.items) {
        const existingItem = await this.prisma.cartItem.findFirst({
          where: { cartId: userCart.id, produtoId: item.produtoId, variante: item.variante },
        });

        if (existingItem) {
          await this.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantidade: existingItem.quantidade + item.quantidade },
          });
        } else {
          await this.prisma.cartItem.create({
            data: {
              cartId: userCart.id,
              produtoId: item.produtoId,
              quantidade: item.quantidade,
              variante: item.variante,
            },
          });
        }
      }
      
      // Clear session cart
      await this.prisma.cartItem.deleteMany({ where: { cartId: sessionCart.id } });
      await this.prisma.cart.delete({ where: { id: sessionCart.id } });
    }

    return this.getCart(userId);
  }
}
