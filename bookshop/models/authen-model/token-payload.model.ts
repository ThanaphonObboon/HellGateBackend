import { ApiProperty } from '@nestjs/swagger';

export class TokenPayloadModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  role: string;
}
