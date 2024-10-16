import {BindingScope, injectable} from '@loopback/core';
import * as jwt from 'jsonwebtoken';

@injectable({scope: BindingScope.TRANSIENT})
export class JwtService {
  private readonly secretKey = process.env.JWT_SECRET || 'your-secret-key';
  private readonly expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  constructor() { }

  // Token üretimi yapan fonksiyon
  generateToken(payload: object): string {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: this.expiresIn,
    });
  }
}
