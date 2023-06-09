import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadModel } from 'models/authen-model/token-payload.model';

@Injectable()
export class JwtAuthenService {
  private readonly _secret: string = '';
  constructor(
    private readonly jwtService: JwtService,
    private _configService: ConfigService,
  ) {
    this._secret = this._configService.get<string>('JWT_SECRET');
  }
  async generateJwtToken(
    id: string,
    role: string,
    expiresIn = '24h',
  ): Promise<string> {
    const payload: TokenPayloadModel = {
      id,
      role,
    };
    const jwt = await this.jwtService.signAsync(payload, {
      expiresIn: expiresIn,
      secret: this._secret,
    });
    return jwt;
  }
  async decodeJwtToken(token: string): Promise<TokenPayloadModel> {
    const deocdePayload = await this.jwtService.verifyAsync<TokenPayloadModel>(
      token,
      {
        secret: this._secret,
      },
    );
    return deocdePayload;
  }
}
