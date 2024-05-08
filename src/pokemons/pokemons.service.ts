import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { FilterQuery } from './validators/filter';
import { Evolution } from '@prisma/client';

@Injectable()
export class PokemonsService {
  constructor(private prisma: PrismaService) {}

  async create({
    nextEvolution,
    prevEvolution,
    ...data
  }: CreatePokemonDto): Promise<Pokemon> {
    if (prevEvolution) {
      const previousEvolutions: Evolution[] =
        await this.findPreviousEvolutions(prevEvolution);
      data['prevEvolution'] = previousEvolutions;
    }

    if (nextEvolution) {
      const nextEvolutions: Evolution[] =
        await this.findNextEvolutions(prevEvolution);
      data['nextEvolution'] = nextEvolutions;
    }

    return this.prisma.pokemon.create({
      data,
    });
  }

  async findPreviousEvolutions(num: string): Promise<Evolution[]> {
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { num },
      select: { prevEvolution: true, name: true },
    });

    if (!pokemon) {
      return [];
    }

    return [...pokemon.prevEvolution, { num, name: pokemon.name }];
  }

  async findNextEvolutions(num: string): Promise<Evolution[]> {
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { num },
      select: { nextEvolution: true, name: true },
    });

    if (!pokemon) {
      return [];
    }

    return [{ num, name: pokemon.name }, ...pokemon.nextEvolution];
  }

  async suggest(num: string): Promise<Pokemon[]> {
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { num },
    });

    if (!pokemon) {
      return [];
    }

    return this.prisma.pokemon.findMany({
      where: {
        type: {
          hasSome: pokemon.weaknesses,
        },
      },
    });
  }

  searchByNameFuzzy(name: string): Promise<Pokemon[]> {
    return this.prisma.pokemon.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }

  filter({ type, sortOrder, orderBy }: FilterQuery) {
    return this.prisma.pokemon.findMany({
      where: {
        type: {
          has: type,
        },
      },
      orderBy: {
        [orderBy]: sortOrder,
      },
    });
  }

  findOne(num: string): Promise<Pokemon | null> {
    return this.prisma.pokemon.findUnique({
      where: { num },
    });
  }
}
