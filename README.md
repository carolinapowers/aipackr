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
4. Start development environment: `docker-compose up`

### Available Scripts

- `yarn build` - Build all packages
- `yarn dev` - Start development servers
- `yarn test` - Run tests across all packages
- `yarn lint` - Lint all packages
- `yarn typecheck` - Type check all packages

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