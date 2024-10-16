import {AuthenticationStrategy} from '@loopback/authentication';
import {BindingScope, injectable} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';

@injectable({scope: BindingScope.TRANSIENT})
export class TokenStrategy implements AuthenticationStrategy {
  name = 'jwt';

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = this.extractCredentials(request);

    // Token'ın var olup olmadığını kontrol et
    if (!token) {
      throw new HttpErrors.Unauthorized('Token is missing');
    }

    // Basit bir UserProfile döndür
    const userProfile: UserProfile = {
      [securityId]: 'system-user', // Token doğrulaması yapmadığımız için sabit bir id döndürüyoruz
      name: 'authorized-user',
    };

    return userProfile;
  }

  extractCredentials(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new HttpErrors.Unauthorized('Authorization header is missing.');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      throw new HttpErrors.Unauthorized('Authorization header is not of type "Bearer".');
    }

    return parts[1];
  }
}
