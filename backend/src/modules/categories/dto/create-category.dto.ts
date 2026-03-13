import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Instrumentais' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'Fórceps e curetas' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ example: 'instrumentais' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imagem?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
