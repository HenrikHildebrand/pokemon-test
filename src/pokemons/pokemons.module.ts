import { Module } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { PokemonsController } from './pokemons.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PokemonsController],
  providers: [PokemonsService, PrismaService],
})
export class PokemonsModule {}
