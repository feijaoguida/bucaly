import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('contact')
@Controller('contact')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Enviar mensagem de contato (Público)' })
  async create(@Body() createContactDto: CreateContactDto) {
    const data = await this.contactService.create(createContactDto);
    return { success: true, data, message: 'Mensagem enviada com sucesso' };
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Listar todas mensagens (Admin)' })
  async findAll() {
    const data = await this.contactService.findAll();
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Ver detalhes de uma mensagem (Admin)' })
  async findOne(@Param('id') id: string) {
    const data = await this.contactService.findOne(id);
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar mensagem como lida (Admin)' })
  async markAsRead(@Param('id') id: string) {
    const data = await this.contactService.markAsRead(id);
    return { success: true, data, message: 'Mensagem marcada como lida' };
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar mensagem (Admin)' })
  async remove(@Param('id') id: string) {
    await this.contactService.remove(id);
    return { success: true, message: 'Mensagem deletada' };
  }
}
