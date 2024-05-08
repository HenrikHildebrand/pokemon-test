import { ApiProperty } from '@nestjs/swagger';

export class CreatePokemonDto {
  @ApiProperty()
  num: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  img: string;

  @ApiProperty({ type: String, isArray: true })
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

  @ApiProperty({ type: Number, isArray: true })
  multipliers?: number[];

  @ApiProperty()
  weaknesses: string[];

  @ApiProperty({ type: String, description: 'Num of next evolution' })
  nextEvolution?: string;

  @ApiProperty({ type: String, description: 'Num of previous evolution' })
  prevEvolution?: string;
}
