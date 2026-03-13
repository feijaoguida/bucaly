import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User, Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: RegisterDto): Promise<User> {
    const userExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new ConflictException('E-mail já cadastrado');
    }

    if (data.cpf) {
      const cpfExists = await this.prisma.user.findUnique({
        where: { cpf: data.cpf },
      });
      if (cpfExists) {
        throw new ConflictException('CPF já cadastrado');
      }
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(data.senha, salt);

    return this.prisma.user.create({
      data: {
        nome: data.nome,
        sobrenome: data.sobrenome,
        email: data.email,
        senha: hashedPassword,
        cpf: data.cpf,
        telefone: data.telefone,
        role: Role.CLIENTE,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
