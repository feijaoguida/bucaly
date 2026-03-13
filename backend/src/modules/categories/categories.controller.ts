import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Criar categoria (Admin)' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const data = await this.categoriesService.create(createCategoryDto);
    return { success: true, data, message: 'Categoria criada' };
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar categorias ativas (Público)' })
  async findAllActive() {
    const data = await this.categoriesService.findAll(true);
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get('all')
  @ApiOperation({ summary: 'Listar todas categorias (Admin)' })
  async findAll() {
    const data = await this.categoriesService.findAll(false);
    return { success: true, data };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  async findOne(@Param('id') id: string) {
    const data = await this.categoriesService.findOne(id);
    return { success: true, data };
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Buscar categoria por Slug' })
  async findBySlug(@Param('slug') slug: string) {
    const data = await this.categoriesService.findBySlug(slug);
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar categoria (Admin)' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const data = await this.categoriesService.update(id, updateCategoryDto);
    return { success: true, data, message: 'Categoria atualizada' };
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Remover categoria (Admin)' })
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return { success: true, message: 'Categoria removida' };
  }
}
