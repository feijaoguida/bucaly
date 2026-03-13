import { IsString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID, IsArray, IsUrl, IsInt, Min, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  preco: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  precoOriginal?: number;

  @ApiProperty()
  @IsUUID()
  categoriaId: string;

  @ApiProperty()
  @IsString()
  marca: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUrl({}, { each: true })
  imagens: string[];

  @ApiProperty()
  @IsInt()
  @Min(0)
  estoque: number;

  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  destaque?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  novo?: boolean;
}
