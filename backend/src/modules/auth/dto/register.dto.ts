import { IsEmail, IsString, MinLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'João' })
  @IsString()
  @MinLength(2)
  nome: string;

  @ApiProperty({ example: 'Silva' })
  @IsString()
  @MinLength(2)
  sobrenome: string;

  @ApiProperty({ example: 'joao@cliente.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '123.456.789-00' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF formato inválido: xxx.xxx.xxx-xx' })
  cpf?: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  @IsOptional()
  @IsString()
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, { message: 'Telefone formato inválido: (xx) xxxxx-xxxx' })
  telefone?: string;

  @ApiProperty({ example: 'Cliente@123' })
  @IsString()
  @MinLength(6)
  senha: string;
}
