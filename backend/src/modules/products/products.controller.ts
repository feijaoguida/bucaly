import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Criar produto (Admin)' })
  async create(@Body() createProductDto: CreateProductDto) {
    const data = await this.productsService.create(createProductDto);
    return { success: true, data, message: 'Produto criado' };
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar produtos com filtros e paginação (Público)' })
  async findAll(@Query() filters: ProductFiltersDto) {
    const result = await this.productsService.findAllPublic(filters);
    return { success: true, ...result };
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get('all')
  @ApiOperation({ summary: 'Listar todos os produtos indiscriminadamente (Admin)' })
  async findAllAdmin() {
    const data = await this.productsService.findAllAdmin();
    return { success: true, data };
  }
  
  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Produtos em destaque' })
  async findFeatured() {
    const data = await this.productsService.getFeatured();
    return { success: true, data };
  }

  @Public()
  @Get('new')
  @ApiOperation({ summary: 'Produtos novos (Lançamentos)' })
  async findNew() {
    const data = await this.productsService.getNew();
    return { success: true, data };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID (Público)' })
  async findOne(@Param('id') id: string) {
    const data = await this.productsService.findOne(id);
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produto (Admin)' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const data = await this.productsService.update(id, updateProductDto);
    return { success: true, data, message: 'Produto atualizado' };
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Remover produto (Admin)' })
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { success: true, message: 'Produto removido' };
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Post(':id/images')
  @ApiOperation({ summary: 'Upload de imagens do produto (Admin)' })
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImages(@Param('id') id: string, @UploadedFiles() files: Array<Express.Multer.File>) {
    const urls = files.map(file => `/uploads/${file.originalname}`);
    const product = await this.productsService.findOne(id);
    const novasImagens = [...product.imagens, ...urls];
    const data = await this.productsService.update(id, { imagens: novasImagens } as any);
    return { success: true, data, message: 'Imagens enviadas com sucesso' };
  }
}
