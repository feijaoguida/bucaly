import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('addresses')
@ApiBearerAuth()
@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar endereço' })
  async create(@Request() req: any, @Body() createAddressDto: CreateAddressDto) {
    const data = await this.addressesService.create(req.user.id, createAddressDto);
    return { success: true, data, message: 'Endereço cadastrado' };
  }

  @Get()
  @ApiOperation({ summary: 'Listar endereços do usuário' })
  async findAll(@Request() req: any) {
    const data = await this.addressesService.findAll(req.user.id);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar endereço por ID' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    const data = await this.addressesService.findOne(id, req.user.id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar endereço' })
  async update(@Request() req: any, @Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    const data = await this.addressesService.update(id, req.user.id, updateAddressDto);
    return { success: true, data, message: 'Endereço atualizado' };
  }

  @Patch(':id/principal')
  @ApiOperation({ summary: 'Definir endereço como principal' })
  async setPrincipal(@Request() req: any, @Param('id') id: string) {
    const data = await this.addressesService.setPrincipal(id, req.user.id);
    return { success: true, data, message: 'Endereço principal atualizado' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover endereço' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.addressesService.remove(id, req.user.id);
    return { success: true, message: 'Endereço removido' };
  }
}
