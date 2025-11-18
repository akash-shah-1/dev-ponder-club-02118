import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'jwt-secret-here',
    });
  }

  async validate(payload: any) {
    if (!this.prisma) {
      throw new UnauthorizedException('Database service not available');
    }
    
    const user = await this.prisma.user.findUnique({ 
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
      }
    });
    
    if (!user || !user.isAdmin) {
      throw new UnauthorizedException('Not an authorized admin user');
    }
    
    return user;
  }
}
