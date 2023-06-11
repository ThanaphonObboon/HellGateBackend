import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadModel } from 'models/authen-model/token-payload.model';

@Injectable()
export class JwtAuthenService {
  private readonly _secret: string = 'asdmasdasdoajpdioajdioshjio1256d456412';
  constructor(private jwtService: JwtService) {}
  async generateJwtToken(
    id: string,
    role: string,
    expiresIn = '30m',
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
