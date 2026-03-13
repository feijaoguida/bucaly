import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles(Role.ADMIN)
  @Get('stats')
  @ApiOperation({ summary: 'Estatísticas gerais (Admin)' })
  async getStats() {
    const data = await this.dashboardService.getStats();
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @Get('sales')
  @ApiOperation({ summary: 'Vendas por período (Admin)' })
  async getSales() {
    const data = await this.dashboardService.getSales();
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @Get('top-products')
  @ApiOperation({ summary: 'Produtos mais vendidos (Admin)' })
  async getTopProducts() {
    const data = await this.dashboardService.getTopProducts();
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @Get('recent-orders')
  @ApiOperation({ summary: 'Pedidos recentes (Admin)' })
  async getRecentOrders() {
    const data = await this.dashboardService.getRecentOrders();
    return { success: true, data };
  }
}
