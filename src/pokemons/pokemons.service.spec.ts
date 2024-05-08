import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PrismaService } from '../prisma.service';
import { FilterQuery } from './validators/filter';

const mockCreateDto: CreatePokemonDto = {
  num: '001',
  name: 'Bulbasaur',
  img: 'http://www.serebii.net/pokemongo/pokemon/001.png',
  type: ['Grass', 'Poison'],
  height: '0.71 m',
  weight: '6.9 kg',
  candy: 'Bulbasaur Candy',
  candyCount: 25,
  egg: '2 km',
  spawnChance: 0.69,
  avgSpawns: 69,
  spawnTime: '20:00',
  multipliers: [1.58],
  weaknesses: ['Fire', 'Ice', 'Flying', 'Psychic'],
};

describe('PokemonsService', () => {
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonsService, PrismaService],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new Pokemon', async () => {
      const createPokemonDto: CreatePokemonDto = { ...mockCreateDto };

      jest.spyOn(service, 'findPreviousEvolutions').mockResolvedValue([]);
      jest.spyOn(service, 'findNextEvolutions').mockResolvedValue([]);
      jest
        .spyOn(service['prisma'].pokemon, 'create')
        .mockResolvedValue({} as Pokemon);

      const createdPokemon = await service.create(createPokemonDto);

      expect(service.findPreviousEvolutions).not.toHaveBeenCalled();
      expect(service.findNextEvolutions).not.toHaveBeenCalled();

      expect(service['prisma'].pokemon.create).toHaveBeenCalledWith({
        data: {
          ...createPokemonDto,
        },
      });
      expect(createdPokemon).toBeDefined();
    });

    it('should create a new Pokemon with evolutions', async () => {
      const createPokemonDto: CreatePokemonDto = {
        ...mockCreateDto,
        nextEvolution: '003',
        prevEvolution: '002',
      };

      const prevEvolution = [{ num: '002', name: 'pikachu' }];
      jest
        .spyOn(service, 'findPreviousEvolutions')
        .mockResolvedValue(prevEvolution);

      const nextEvolution = [{ num: '003', name: 'Mewtoo' }];
      jest
        .spyOn(service, 'findNextEvolutions')
        .mockResolvedValue(nextEvolution);
      jest
        .spyOn(service['prisma'].pokemon, 'create')
        .mockResolvedValue({} as Pokemon);

      const createdPokemon = await service.create(createPokemonDto);

      expect(service.findPreviousEvolutions).toHaveBeenCalled();
      expect(service.findNextEvolutions).toHaveBeenCalled();

      expect(service['prisma'].pokemon.create).toHaveBeenCalledWith({
        data: {
          ...createPokemonDto,
          prevEvolution,
          nextEvolution,
        },
      });
      expect(createdPokemon).toBeDefined();
    });
  });
  describe('suggest', () => {
    it('should return suggested Pokemon based on weaknesses', async () => {
      const num = '001';
      const weakPokemon = {
        num: '001',
        name: 'Bulbasaur',
        weaknesses: ['Fire', 'Ice', 'Flying', 'Psychic'],
      } as Pokemon;

      const strongPokemon = {
        num: '002',
        name: 'Pikachu',
        type: ['Fire', 'Ice', 'Flying', 'Psychic'],
      } as Pokemon;

      jest
        .spyOn(service['prisma'].pokemon, 'findUnique')
        .mockResolvedValue(weakPokemon);
      jest
        .spyOn(service['prisma'].pokemon, 'findMany')
        .mockResolvedValue([strongPokemon]);

      const suggestedPokemons = await service.suggest(num);

      expect(service['prisma'].pokemon.findUnique).toHaveBeenCalledWith({
        where: { num },
      });
      expect(service['prisma'].pokemon.findMany).toHaveBeenCalledWith({
        where: {
          type: {
            hasSome: weakPokemon.weaknesses,
          },
        },
      });
      expect(suggestedPokemons).toEqual([strongPokemon]);
    });

    it('should return an empty array if the Pokemon does not exist', async () => {
      const num = '001';

      jest
        .spyOn(service['prisma'].pokemon, 'findUnique')
        .mockResolvedValue(null);

      const suggestedPokemons = await service.suggest(num);

      expect(service['prisma'].pokemon.findUnique).toHaveBeenCalledWith({
        where: { num },
      });
      expect(suggestedPokemons).toEqual([]);
    });
  });

  describe('findPreviousEvolutions', () => {
    it('should return an empty array if the Pokemon does not exist', async () => {
      const num = '001';

      jest
        .spyOn(service['prisma'].pokemon, 'findUnique')
        .mockResolvedValue(null);

      const result = await service.findPreviousEvolutions(num);

      expect(service['prisma'].pokemon.findUnique).toHaveBeenCalledWith({
        where: { num },
        select: { prevEvolution: true, name: true },
      });
      expect(result).toEqual([]);
    });

    it('should return an array of previous evolutions', async () => {
      const num = '002';
      const pokemon = {
        prevEvolution: [
          { num: '001', name: 'Bulbasaur' },
          { num: '003', name: 'Ivysaur' },
        ],
        name: 'Venusaur',
        num: '002',
      } as Pokemon;

      jest
        .spyOn(service['prisma'].pokemon, 'findUnique')
        .mockResolvedValue(pokemon);

      const result = await service.findPreviousEvolutions(num);

      expect(service['prisma'].pokemon.findUnique).toHaveBeenCalledWith({
        where: { num },
        select: { prevEvolution: true, name: true },
      });
      expect(result).toEqual([
        { num: '001', name: 'Bulbasaur' },
        { num: '003', name: 'Ivysaur' },
        { num: '002', name: 'Venusaur' },
      ]);
    });
  });

  describe('findNextEvolutions', () => {
    it('should return an empty array if the Pokemon does not exist', async () => {
      const num = '001';

      jest
        .spyOn(service['prisma'].pokemon, 'findUnique')
        .mockResolvedValue(null);

      const result = await service.findPreviousEvolutions(num);

      expect(service['prisma'].pokemon.findUnique).toHaveBeenCalledWith({
        where: { num },
        select: { prevEvolution: true, name: true },
      });
      expect(result).toEqual([]);
    });

    it('should return an array of next evolutions', async () => {
      const num = '002';
      const pokemon = {
        nextEvolution: [
          { num: '001', name: 'Bulbasaur' },
          { num: '003', name: 'Ivysaur' },
        ],
        name: 'Venusaur',
        num: '002',
      } as Pokemon;

      jest
        .spyOn(service['prisma'].pokemon, 'findUnique')
        .mockResolvedValue(pokemon);

      const result = await service.findNextEvolutions(num);

      expect(service['prisma'].pokemon.findUnique).toHaveBeenCalledWith({
        where: { num },
        select: { nextEvolution: true, name: true },
      });
      expect(result).toEqual([
        { num: '002', name: 'Venusaur' },
        { num: '001', name: 'Bulbasaur' },
        { num: '003', name: 'Ivysaur' },
      ]);
    });
  });

  describe('searchByNameFuzzy', () => {
    it('should return an array of Pokemon matching the fuzzy name search', async () => {
      const name = 'saur';
      const pokemon1 = { num: '001', name: 'Bulbasaur' } as Pokemon;
      const pokemon2 = { num: '002', name: 'Ivysaur' } as Pokemon;
      const pokemon3 = { num: '003', name: 'Venusaur' } as Pokemon;

      jest
        .spyOn(service['prisma'].pokemon, 'findMany')
        .mockResolvedValue([pokemon1, pokemon2, pokemon3]);

      const result = await service.searchByNameFuzzy(name);

      expect(service['prisma'].pokemon.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
      expect(result).toEqual([pokemon1, pokemon2, pokemon3]);
    });

    it('should return an empty array if no Pokemon matches the fuzzy name search', async () => {
      const name = 'xyz';

      jest.spyOn(service['prisma'].pokemon, 'findMany').mockResolvedValue([]);

      const result = await service.searchByNameFuzzy(name);

      expect(service['prisma'].pokemon.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
      expect(result).toEqual([]);
    });
  });

  describe('filter', () => {
    it('should return filtered Pokemon based on type, sortOrder, and orderBy', async () => {
      const filterQuery: FilterQuery = {
        type: 'Grass',
        sortOrder: 'asc',
        orderBy: 'name',
      };

      const pokemon1 = { num: '001', name: 'Bulbasaur' } as Pokemon;
      const pokemon2 = { num: '002', name: 'Ivysaur' } as Pokemon;
      const pokemon3 = { num: '003', name: 'Venusaur' } as Pokemon;

      jest
        .spyOn(service['prisma'].pokemon, 'findMany')
        .mockResolvedValue([pokemon1, pokemon2, pokemon3]);

      const result = await service.filter(filterQuery);

      expect(service['prisma'].pokemon.findMany).toHaveBeenCalledWith({
        where: {
          type: {
            has: filterQuery.type,
          },
        },
        orderBy: {
          [filterQuery.orderBy]: filterQuery.sortOrder,
        },
      });
      expect(result).toEqual([pokemon1, pokemon2, pokemon3]);
    });
  });
});
