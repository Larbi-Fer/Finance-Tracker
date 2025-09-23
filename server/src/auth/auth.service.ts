import { ForbiddenException, Injectable } from '@nestjs/common';
import { ActDto, LoginDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CODES } from 'src/lib/codes';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async login(dto: LoginDto) {
    // Get data
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    // Verify data
    if (!user) throw new ForbiddenException(CODES.AUTH.EMAIL_NOT_FOUND)
    const pwMatches = await argon.verify(user.password, dto.password)

    if (!pwMatches) throw new ForbiddenException(CODES.AUTH.WRONG_PASSWORD)
    if (!user.isActive) throw new ForbiddenException(CODES.AUTH.INACTIVE_ACCOUNT)

    const u: any = user
    delete u.isActive
    delete u.password

    return u;
  }

  async register(dto: SignupDto) {
    // Check email
    const u = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { email: true }
    })

    if (u) throw new ForbiddenException(CODES.AUTH.EXIST_EMAIL)

    // generate the password hash
    const hash = await argon.hash(dto.password);
    // save the user to the database
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: hash,
      },
      omit: {
        isActive: true,
        password: true
      }
    })

    // return the user
    return user;
  }
}