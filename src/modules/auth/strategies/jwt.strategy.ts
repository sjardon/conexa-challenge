import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '../constants/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.secret'),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
      roles: this.getUserRoles(payload),
    };
  }

  getUserRoles(payload: any) {
    return [Role.ADMIN, Role.REGULAR];
  }
}