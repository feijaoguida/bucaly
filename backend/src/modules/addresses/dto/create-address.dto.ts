import { IsString, IsNotEmpty, IsOptional, Length, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ example: 'Casa' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'Principal' })
  @IsString()
  @IsNotEmpty()
  sobrenome: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endereco: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  complemento?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bairro: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cidade: string;

  @ApiProperty({ description: 'UF do estado (2 letras)', example: 'SP' })
  @IsString()
  @Length(2, 2)
  estado: string;

  @ApiProperty({ example: '01001-000' })
  @IsString()
  @Length(8, 9)
  cep: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  principal?: boolean;
}
