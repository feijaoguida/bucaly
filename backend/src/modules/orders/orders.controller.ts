import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, OrderStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar pedido (Checkout)' })
  async create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    const data = await this.ordersService.create(req.user.id, createOrderDto);
    return { success: true, data, message: 'Pedido criado com sucesso' };
  }

  @Get()
  @ApiOperation({ summary: 'Listar pedidos do usuário' })
  async findAll(@Request() req: any) {
    const data = await this.ordersService.findAllByUser(req.user.id);
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @Get('all')
  @ApiOperation({ summary: 'Listar todos os pedidos (Admin)' })
  async findAllAdmin() {
    const data = await this.ordersService.findAllAdmin();
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes do pedido' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    // Admin request will pass undefined as userId and get it, User will pass req.user.id
    const userId = req.user.role === Role.ADMIN ? undefined : req.user.id;
    const data = await this.ordersService.findOne(id, userId);
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do pedido (Admin)' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', enum: Object.values(OrderStatus) } } } })
  async updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    if (!Object.values(OrderStatus).includes(status)) throw new BadRequestException('Status inválido');
    const data = await this.ordersService.updateStatus(id, status);
    return { success: true, data, message: 'Status atualizado' };
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancelar pedido' })
  async cancel(@Request() req: any, @Param('id') id: string) {
    const data = await this.ordersService.cancel(id, req.user.id);
    return { success: true, data, message: 'Pedido cancelado com sucesso' };
  }
}
