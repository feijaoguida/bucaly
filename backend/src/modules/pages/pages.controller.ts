import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { PagesService } from './pages.service';
import { UpdatePageDto } from './dto/update-page.dto';
import { CreatePageDto } from './dto/create-page.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('pages (CMS)')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Obter dados de uma página dinâmica pelo Slug (Público)' })
  async findOne(@Param('slug') slug: string) {
    const data = await this.pagesService.findBySlug(slug);
    return { success: true, data };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Criar uma nova página (Admin)' })
  async create(@Body() createPageDto: CreatePageDto) {
    const data = await this.pagesService.create(createPageDto);
    return { success: true, data };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Listar todas as páginas dinâmicas indexadas (Admin)' })
  async findAll() {
    const data = await this.pagesService.findAll();
    return { success: true, data };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':slug')
  @ApiOperation({ summary: 'Atualizar conteúdo da página (Admin)' })
  async update(@Param('slug') slug: string, @Body() updatePageDto: UpdatePageDto) {
    const data = await this.pagesService.update(slug, updatePageDto);
    return { success: true, data };
  }
}
