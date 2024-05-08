import { ApiProperty } from '@nestjs/swagger';
import { Evolution as IEvolution } from '@prisma/client';

export class Evolution implements IEvolution {
  @ApiProperty()
  num: string;

  @ApiProperty()
  name: string;
}
