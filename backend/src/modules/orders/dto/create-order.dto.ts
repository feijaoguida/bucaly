import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, ShippingMethod } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  enderecoId: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  metodoPagamento: PaymentMethod;

  @ApiProperty({ enum: ShippingMethod })
  @IsEnum(ShippingMethod)
  metodoEnvio: ShippingMethod;
}
