import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonsModule } from './pokemons/pokemons.module';
import { PrismaService } from './prisma.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [PokemonsModule, EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
