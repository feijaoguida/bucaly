import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createAddressDto: CreateAddressDto) {
    if (createAddressDto.principal) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { principal: false },
      });
    } else {
      const count = await this.prisma.address.count({ where: { userId } });
      if (count === 0) createAddressDto.principal = true;
    }

    return this.prisma.address.create({
      data: {
        ...createAddressDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { principal: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const address = await this.prisma.address.findFirst({ where: { id, userId } });
    if (!address) throw new NotFoundException('Endereço não encontrado');
    return address;
  }

  async update(id: string, userId: string, updateAddressDto: UpdateAddressDto) {
    await this.findOne(id, userId);

    if (updateAddressDto.principal) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { principal: false },
      });
    }

    return this.prisma.address.update({
      where: { id },
      data: updateAddressDto,
    });
  }

  async setPrincipal(id: string, userId: string) {
    await this.findOne(id, userId);

    // Remove others
    await this.prisma.address.updateMany({
      where: { userId },
      data: { principal: false },
    });

    // Set principal
    return this.prisma.address.update({
      where: { id },
      data: { principal: true },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.address.delete({ where: { id } });
  }
}
