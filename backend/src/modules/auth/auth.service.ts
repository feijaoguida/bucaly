import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.ativo) {
      const isMatch = await bcrypt.compare(pass, user.senha);
      if (isMatch) {
        const { senha, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      success: true,
      data: {
        access_token: this.jwtService.sign(payload),
        user,
      },
      message: 'Login realizado com sucesso',
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const { senha, ...result } = user;
    return {
      success: true,
      data: result,
      message: 'Usuário cadastrado com sucesso',
    };
  }
}
