## Description

This test is made with a node backend build with NestJS, along with a MongoDB database.

The api is documented with swagger and can be tested with the swagger client. All described functionality is tested with unit tests for the service.

class-validator is used to validate endpoint inputs.

Everything related to the test relies in the pokemon namespace of the app.

## Installation

### Local

```bash
$ yarn install
```

### Docker Compose

```bash
$ docker compose build
```

## Seed database

```bash
$ bash loadPokemonData.sh
```

## Running the app

### Local

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Docker Compose

```bash
$ docker compose up -d
```

## Test

### Local

```bash
# unit tests
$ yarn run test
```

### Docker Compose

```bash
# unit tests
$ docker compose run --rm backend yarn test
```

## Swagger

1. Build with docker compose
2. Start app
3. Go to http://localhost:3000/api
