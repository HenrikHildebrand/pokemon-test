import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { SearchByNameParams } from './validators/searchByName';
import { FilterQuery } from './validators/filter';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @ApiCreatedResponse({ type: Pokemon })
  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    return this.pokemonsService.create(createPokemonDto);
  }

  @Get('suggest/:num')
  suggest(@Param('num') num: string): Promise<Pokemon[]> {
    return this.pokemonsService.suggest(num);
  }

  @ApiParam({
    name: 'name',
    type: 'string',
    description: 'Name of the Pokemon, at least 3 characters long',
  })
  @ApiOkResponse({ type: Pokemon })
  @Get('search-by-name/:name')
  searchByName(
    @Param('name') name: SearchByNameParams['name'],
  ): Promise<Pokemon[]> {
    return this.pokemonsService.searchByNameFuzzy(name);
  }

  @Get('filter')
  filter(@Query() query: FilterQuery): Promise<Pokemon[]> {
    return this.pokemonsService.filter(query);
  }

  @ApiOkResponse({ type: Pokemon })
  @Get(':num')
  findOne(@Param('num') num: string): Promise<Pokemon | null> {
    return this.pokemonsService.findOne(num);
  }
}
