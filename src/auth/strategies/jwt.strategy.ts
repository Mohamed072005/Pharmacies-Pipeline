import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "6421587451278t6ufgvcjsvutgvgefwvewrfw7ft6w7",
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
