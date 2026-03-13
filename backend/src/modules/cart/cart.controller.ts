import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto, MergeCartDto, UpdateCartItemDto } from './dto/cart-item.dto';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obter carrinho atual' })
  @ApiQuery({ name: 'sessionId', required: false })
  async getCart(@Request() req: any, @Query('sessionId') sessionId?: string) {
    const data = await this.cartService.getCart(req.user?.id, sessionId);
    return { success: true, data };
  }

  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Post('items')
  @ApiOperation({ summary: 'Adicionar item ao carrinho' })
  async addItem(@Request() req: any, @Body() addCartItemDto: AddCartItemDto) {
    const data = await this.cartService.addItem(req.user?.id, addCartItemDto);
    return { success: true, data, message: 'Item adicionado' };
  }

  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Patch('items/:id')
  @ApiOperation({ summary: 'Atualizar quantidade de item no carrinho' })
  async updateItemQuantity(@Request() req: any, @Param('id') id: string, @Body() updateCartItemDto: UpdateCartItemDto) {
    const data = await this.cartService.updateItemQuantity(req.user?.id, id, updateCartItemDto);
    return { success: true, data };
  }

  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Delete('items/:id')
  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiQuery({ name: 'sessionId', required: false })
  async removeItem(@Request() req: any, @Param('id') id: string, @Query('sessionId') sessionId?: string) {
    const data = await this.cartService.removeItem(req.user?.id, id, sessionId);
    return { success: true, data, message: 'Item removido' };
  }

  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Delete('clear')
  @ApiOperation({ summary: 'Limpar carrinho' })
  @ApiQuery({ name: 'sessionId', required: false })
  async clearCart(@Request() req: any, @Query('sessionId') sessionId?: string) {
    const data = await this.cartService.clearCart(req.user?.id, sessionId);
    return { success: true, data, message: 'Carrinho limpo' };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('merge')
  @ApiOperation({ summary: 'Mesclar carrinho anônimo com usuário logado' })
  async mergeCart(@Request() req: any, @Body() mergeCartDto: MergeCartDto) {
    const data = await this.cartService.mergeCart(req.user.id, mergeCartDto);
    return { success: true, data, message: 'Carrinhos mesclados' };
  }
}
