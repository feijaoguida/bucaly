import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePageDto {
  @ApiPropertyOptional({ description: 'Título da página' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Descrição SEO da página' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Estrutura JSON das seções configuráveis' })
  @IsOptional()
  sections?: any;
}
