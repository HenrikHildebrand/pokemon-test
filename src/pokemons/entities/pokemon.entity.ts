import { ApiProperty } from '@nestjs/swagger';
import { Pokemon as IPokemon } from '@prisma/client';
import { Evolution } from './evolution.entity';

export class Pokemon implements IPokemon {
  @ApiProperty()
  id: string;

  @ApiProperty()
  num: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  img: string;

  @ApiProperty()
  type: string[];

  @ApiProperty()
  height: string;

  @ApiProperty()
  weight: string;

  @ApiProperty()
  candy: string;

  @ApiProperty()
  candyCount: number;

  @ApiProperty()
  egg: string;

  @ApiProperty()
  spawnChance: number;

  @ApiProperty()
  avgSpawns: number;

  @ApiProperty()
  spawnTime: string;

  @ApiProperty()
  multipliers: number[];

  @ApiProperty()
  weaknesses: string[];

  @ApiProperty({ type: Evolution })
  nextEvolution: { num: string; name: string }[];

  @ApiProperty({ type: Evolution })
  prevEvolution: { num: string; name: string }[];
}
