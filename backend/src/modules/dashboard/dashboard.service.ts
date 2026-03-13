import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalProducts, totalOrders, totalSales] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELADO' } },
      }),
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalSales._sum.total || 0,
    };
  }

  async getSales() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: date }, status: { not: 'CANCELADO' } },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: 'asc' }
    });
    return orders;
  }

  async getTopProducts() {
    return this.prisma.product.findMany({
      orderBy: { avaliacoes: 'desc' },
      take: 5,
    });
  }

  async getRecentOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { nome: true, sobrenome: true, email: true } } },
    });
  }
}
