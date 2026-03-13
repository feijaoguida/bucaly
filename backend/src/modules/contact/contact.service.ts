import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    return this.prisma.contactMessage.create({ data: createContactDto });
  }

  async findAll() {
    return this.prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const msg = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException('Mensagem não encontrada');
    return msg;
  }

  async markAsRead(id: string) {
    await this.findOne(id);
    return this.prisma.contactMessage.update({
      where: { id },
      data: { lido: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contactMessage.delete({ where: { id } });
  }
}
