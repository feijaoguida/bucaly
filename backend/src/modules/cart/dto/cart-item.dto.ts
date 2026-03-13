import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddCartItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  produtoId: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @Min(1)
  quantidade: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  variante?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sessionId?: string;
}

export class UpdateCartItemDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantidade: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sessionId?: string;
}

export class MergeCartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
