import { Module } from '@nestjs/common';
import { PokemonsModule } from './pokemons/pokemons.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [PokemonsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
