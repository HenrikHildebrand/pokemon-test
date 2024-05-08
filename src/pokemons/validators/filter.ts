import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class FilterQuery {
  @IsString()
  @ApiProperty()
  type: string;

  @IsEnum(Prisma.PokemonScalarFieldEnum)
  @ApiProperty()
  orderBy: string;

  @IsEnum(Prisma.SortOrder)
  @ApiProperty()
  sortOrder: Prisma.SortOrder;
}
