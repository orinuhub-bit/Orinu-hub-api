# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Orinu-Hub** is a digital African comic book platform connecting creators (Origuns) with readers (Orifans). The platform enables creators to publish their comics and readers to discover, read, and support these works.

**Theme:** Mystical nocturnal aesthetic (purple, fire orange, African constellations)

## Architecture

This is a **monorepo** with separate frontend and backend directories:

### Frontend
- **Tech:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Icons:** Phosphor Icons, Iconsax React
- **State:** Toast context (custom implementation)
- **Location:** `/frontend`

### Backend
- **Tech:** Node.js + TypeScript + Express
- **API:** GraphQL (Apollo Server v4)
- **Database:** MongoDB Atlas with Mongoose ODM
- **Auth:** JWT + bcryptjs
- **File Upload:** Cloudinary (configured)
- **Location:** `/backend`

## Common Commands

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production (TypeScript check + Vite build)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev          # Start dev server with hot reload (http://localhost:5000/graphql)
npm run build        # Compile TypeScript to dist/
npm start            # Run production build from dist/
```

### Running Both Services
You need to run frontend and backend in separate terminals for full development.

## Backend Architecture

### GraphQL Structure
The backend uses Apollo Server with a **modular GraphQL schema**:

- **Type Definitions:** Split into domain-specific files
  - `src/graphql/typedefs/user.typedefs.ts` - User/auth types
  - `src/graphql/typedefs/comic.typedefs.ts` - Comic/chapter types
  - `src/graphql/typedefs/interaction.typedefs.ts` - Like/comment types
  - Combined in `src/graphql/typedefs/index.ts`

- **Resolvers:** Mirror the typedefs structure
  - `src/graphql/resolvers/user.resolvers.ts`
  - `src/graphql/resolvers/comic.resolvers.ts`
  - `src/graphql/resolvers/interaction.resolvers.ts`
  - Combined in `src/graphql/resolvers/index.ts`

- **Context:** Auth context created from JWT in request headers (`src/graphql/context.ts`)

### Database Models
Located in `src/models/`:
- **User:** username, email, password (hashed), role (origun/orifan), bio, avatar, country
- **Comic:** title, description, coverImage, genre[], language, tags[], author (ref User), views, likesCount, status (draft/published)
- **Chapter:** comic (ref Comic), chapterNumber, title, pages[] (image URLs)
- **Like:** user (ref User), comic (ref Comic)
- **Comment:** user (ref User), comic (ref Comic), content

### Authentication
- JWT tokens stored in Authorization header: `Bearer <token>`
- Context extracts and verifies token for protected resolvers
- Utils in `src/utils/jwt.ts`

### Configuration
- Database connection: `src/config/database.ts`
- Environment variables in `.env` (see `.env.example`)
- Required vars: MONGODB_URI, JWT_SECRET, JWT_EXPIRE, PORT, FRONTEND_URL

## Frontend Architecture

### Component Organization
```
src/
├── components/          # Reusable UI components
│   ├── actions/        # Interactive components (button, switch)
│   ├── modals/         # Modal dialogs
│   ├── Toast.tsx       # Toast notification component
│   ├── Input.tsx       # Form input component
│   ├── badge.tsx       # Badge component
│   └── Button.tsx      # Button component
├── pages/              # Route pages
│   ├── landing/        # Landing page components
│   ├── index.tsx       # Router configuration
│   └── NotFound.tsx    # 404 page
├── context/            # React context providers
│   └── toast-context.tsx
├── lib/                # Utilities and helpers
│   └── utils.ts        # Class name utilities (cn function)
├── types/              # TypeScript type definitions
│   └── modal-ref.ts
└── assets/             # Static assets
```

### Styling
- Tailwind CSS v4 with custom configuration
- Uses `@tailwindcss/vite` plugin
- Utility function `cn()` in `src/lib/utils.ts` for class merging (clsx + tailwind-merge)
- Custom theme colors aligned with mystical nocturnal aesthetic

### State Management
- Currently using React Context for toasts
- No global state library (consider Zustand if complex state needed, as per plan.md)

## Development Workflow

### Adding GraphQL Operations

1. **Define types** in appropriate typedefs file (`src/graphql/typedefs/`)
2. **Implement resolver** in corresponding resolvers file (`src/graphql/resolvers/`)
3. **Test in Apollo Studio** at http://localhost:5000/graphql
4. **Reference** `backend/GRAPHQL_GUIDE.md` for examples of all current queries/mutations

### Adding Frontend Features

1. **Create components** in `src/components/` (reusable) or `src/pages/` (routes)
2. **Use Tailwind classes** for styling
3. **Import icons** from `@phosphor-icons/react` or `iconsax-react`
4. **Use toast context** for notifications: `useToast()` hook
5. **Follow component patterns** established in existing components (TypeScript interfaces, exported types)

### Database Operations

- **Models** use Mongoose schemas with TypeScript interfaces
- **Always** export both the interface and model
- **Validation** should be in the schema definition
- **Relations** use Mongoose refs and populate() for joining

## Testing GraphQL API

Use Apollo Studio (preferred) or tools like Postman:
1. Start backend: `cd backend && npm run dev`
2. Open http://localhost:5000/graphql
3. See `backend/GRAPHQL_GUIDE.md` for complete mutation/query examples
4. For authenticated requests, add Authorization header with JWT token

## Project Planning Documents

- `project.md` - Original project specifications (French)
- `plan.md` - Detailed 7-week implementation roadmap (French)
- `backend/MONGODB_SETUP.md` - MongoDB Atlas setup guide
- `backend/GRAPHQL_GUIDE.md` - Complete GraphQL API reference
- `backend/README.md` - Backend-specific documentation

## Important Notes

- **Monorepo structure:** Frontend and backend are separate npm projects
- **No shared dependencies** between frontend/backend (separate node_modules)
- **Environment variables:** Required for both frontend (API URL) and backend (DB, JWT secrets)
- **CORS:** Backend configured to accept requests from frontend URL (localhost:5173 in dev)
- **TypeScript strict mode:** Both projects use strict TypeScript checking
- **File uploads:** Cloudinary setup ready but implementation pending (see plan.md TODO)
- **Multilingual support:** Planned (FR/EN initially, African languages later) but not yet implemented
- **The platform uses French language** in docs and some code comments - English is fine for code

## Naming Conventions

- **Origun:** Creator/author of comics
- **Orifan:** Reader/fan of comics
- **Components:** PascalCase with .tsx extension
- **Utils/helpers:** camelCase with .ts extension
- **GraphQL types:** PascalCase (e.g., User, Comic, ComicInput)
- **GraphQL fields:** camelCase (e.g., coverImage, likesCount)
- **Database models:** PascalCase filenames matching model name

## Future Roadmap Highlights

From `plan.md`, upcoming features include:
- Cloudinary image upload integration
- User profile pages and settings
- Comic reader interface with navigation
- Like and comment interactions
- Search and filtering
- Internationalization (i18next)
- SEO optimization
- Deployment (Vercel for frontend, Railway/Render for backend)
