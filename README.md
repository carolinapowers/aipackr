# AIPackr

AI-Powered Travel Packing Assistant

## Architecture

This is a monorepo using Yarn Workspaces with the following packages:

- `@aipackr/types` - Shared TypeScript type definitions
- `@aipackr/api` - NestJS backend API
- `@aipackr/web` - Next.js frontend with domain-driven structure
- `@aipackr/core-engine` - Packing algorithms and business logic

## Domain-Driven Frontend Structure

The Next.js frontend follows a domain-driven architecture:

```
packages/web/src/
├── app/                    # Next.js App Router
├── domains/               # Business domains
│   ├── auth/              # Authentication domain
│   ├── trips/             # Trip management domain
│   ├── clothing/          # Clothing management domain
│   ├── weather/           # Weather data domain
│   └── packing/           # Packing recommendations domain
├── shared/                # Shared components and utilities
│   ├── components/ui/     # Reusable UI components
│   ├── hooks/             # Shared React hooks
│   ├── utils/             # Utility functions
│   └── services/          # Shared services
└── lib/                   # External integrations
```

## Development

### Prerequisites

- Node.js 22+
- Yarn 4.3.1+
- Docker & Docker Compose

### Quick Start

1. Clone the repository
2. Install dependencies: `yarn install`
3. Copy environment files:
   ```bash
   cp packages/api/.env.example packages/api/.env
   cp packages/web/.env.example packages/web/.env.local
   ```

### Development Workflows

#### Option 1: Full Docker (Recommended for Production)
```bash
# Start all services in containers
docker compose up --build
```

**Services available:**
- Frontend: http://localhost:3000
- API: http://localhost:3001
- PostgreSQL: localhost:5432
- Redis: localhost:6379

#### Option 2: Hybrid Development (Recommended for Local Development)
```bash
# Terminal 1: Start only databases
docker compose up postgres redis

# Terminal 2: Start API locally (faster hot reloading)
yarn workspace @aipackr/api dev

# Terminal 3: Start web locally (faster hot reloading)
yarn workspace @aipackr/web dev
```

**Benefits of hybrid approach:**
- ⚡ Faster hot reloading and iteration
- 🐛 Better debugging and IDE integration
- 📝 Immediate console output and logging
- 🔧 Easier to modify and test changes

#### Option 3: Local Development (Databases installed locally)
```bash
# Install and start PostgreSQL and Redis locally
# Then run services directly
yarn workspace @aipackr/api dev
yarn workspace @aipackr/web dev
```

### Local Development Best Practices

#### Getting Started with Hybrid Development
1. **Start databases first:**
   ```bash
   yarn dev:db
   ```

2. **In a new terminal, start the API:**
   ```bash
   yarn dev:api
   ```

3. **In another terminal, start the web app:**
   ```bash
   yarn dev:web
   ```

#### One-Command Setup (requires concurrently)
```bash
# Install concurrently if not already installed
yarn add -D concurrently

# Start everything with one command
yarn dev:hybrid
```

#### Troubleshooting

**Port conflicts:**
- API default: 3001
- Web default: 3000
- PostgreSQL: 5432
- Redis: 6379

**Database connection issues:**
- Ensure PostgreSQL and Redis are running: `yarn dev:db`
- Check environment variables in `packages/api/.env`
- Verify database URL: `postgresql://aipackr:password@localhost:5432/aipackr`

**Hot reloading not working:**
- Use local development instead of Docker for faster iteration
- Check file watchers: `yarn workspace @aipackr/api dev` and `yarn workspace @aipackr/web dev`

**Dependency issues:**
- Clean and reinstall: `yarn clean && yarn install`
- Rebuild packages: `yarn build`

### Available Scripts

#### Core Scripts
- `yarn build` - Build all packages
- `yarn dev` - Start development servers
- `yarn test` - Run tests across all packages
- `yarn lint` - Lint all packages
- `yarn typecheck` - Type check all packages
- `yarn clean` - Clean build outputs

#### Development Workflow Scripts
- `yarn dev:db` - Start only PostgreSQL and Redis databases
- `yarn dev:api` - Start API service locally (requires databases running)
- `yarn dev:web` - Start web service locally (requires API running)
- `yarn dev:hybrid` - Start hybrid development (databases + local services)
- `yarn prod` - Start full production environment with Docker

#### Individual Package Scripts
- `yarn workspace @aipackr/api dev` - Start API with hot reloading
- `yarn workspace @aipackr/web dev` - Start web with hot reloading
- `yarn workspace @aipackr/types build` - Build shared types
- `yarn workspace @aipackr/core-engine build` - Build core algorithms

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, PostgreSQL, Redis, Prisma
- **AI**: AWS Rekognition, Claude API
- **Infrastructure**: Docker, AWS (ECS, RDS, S3)

## Phase 1 Complete ✅

- ✅ Yarn Workspaces monorepo structure
- ✅ TypeScript configurations for all packages
- ✅ NestJS backend API foundation
- ✅ Next.js frontend with domain-driven structure
- ✅ Core packing algorithms package
- ✅ Docker configuration
- ✅ Shared type definitions

## Next Steps (Phase 2)

- Set up PostgreSQL database with Prisma migrations
- Implement authentication system
- Create basic API endpoints for trips and users
- Integrate weather APIs
- Set up AWS S3 for image uploads

## License

MIT License - see [LICENSE](LICENSE) file for details.