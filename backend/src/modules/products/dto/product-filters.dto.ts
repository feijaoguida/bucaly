import { Transform, Type } from 'class-transformer';
import { IsOptional, IsUUID, IsNumber, Min, IsBoolean, IsEnum, IsString, IsInt, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductFiltersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoria?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precoMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  precoMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  disponivel?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  emPromocao?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  novidades?: boolean;

  @ApiPropertyOptional({ enum: ['relevancia', 'preco-asc', 'preco-desc', 'nome', 'mais-vendidos'] })
  @IsOptional()
  @IsEnum(['relevancia', 'preco-asc', 'preco-desc', 'nome', 'mais-vendidos'])
  ordenar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  busca?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 12;
}
