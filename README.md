![Envie](/apps/envie-front/public/logo.webp)
---
## Description

The Web Application of a stock managemnt system.

## Prerequisite:
- [NodeJs > 16](https://nodejs.org/en)
- [PNPM](https://pnpm.io/fr/)
- [Docker](https://docs.docker.com/desktop/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation

```bash
$ pnpm i
```

## Running the app

```bash
# development mode
$ docker compose -f docker-compose.dev.yml --env-file .env.development up --build --always-recreate-deps 
```

---

## First init of the Database

- Connect to http://localhost:8080
- Login with the credentials (in .env.development)
- Execute the init.sql (in ./apps/envie-bdd)

---
## Deployment Documentation

### [Development](https://confluence.uha4point0.fr/pages/viewpage.action?pageId=119484658)

### [Production](https://confluence.uha4point0.fr/pages/viewpage.action?pageId=132387618)

## Technologies Documentation

### [Nest Documentation](https://docs.nestjs.com/)
### [Next.js Documentation](https://nextjs.org/docs)
### [TurboRepo Documentation](https://turbo.build/repo/docs)