# Sports Club Management System (MVP)

## Project Description

The Sports Club Management System (MVP) is a multi-tenant platform designed to centrally manage multiple independent sports clubs. It addresses the inflexibility and cost associated with existing club management systems by providing a scalable, secure, and user-friendly solution.

Key features include:
- Multi-tenant architecture supporting multiple independent clubs
- Role-based access control with four user types:
  - System Administrator 
  - Club Administrator
  - Trainer
  - Member
- Comprehensive club management features:
  - User management with role assignment
  - Class scheduling and capacity management
  - Pricing plans and membership management
  - Member registration and class booking system
- Collection of analytical data per club (class history, training time, cancelled registrations)
- Communication layer between the frontend (Astro + React Islands + Tailwind CSS) and backend services (Supabase)

## Tech Stack

**Frontend:**
- [Astro](https://astro.build/) v5.5.5
- [React](https://react.dev/) v19.0.0 (for interactive components/islands)
- [TypeScript](https://www.typescriptlang.org/) v5
- [Tailwind CSS](https://tailwindcss.com/) v4.0.17
- [Shadcn/ui](https://ui.shadcn.com/) (React component library)

**Backend:**
- [Supabase](https://supabase.com/) (PostgreSQL Database, Authentication, BaaS)

**Development Tools:**
- ESLint, Prettier, Husky, lint-staged

**CI/CD & Hosting:**
- GitHub Actions
- DigitalOcean (Docker)

## Database Schema

The system uses PostgreSQL with the following key tables:

**Core Tables:**
- `sport_clubs`: Stores club information and metadata
- `memberships`: Manages user-club relationships with role and plan information
- `pricing_plans`: Defines club-specific membership plans
- `classes`: Stores class schedules and details per club
- `class_registrations`: Tracks member registrations for classes
- `analytics_logs`: Collects analytical data per club


## Getting Started Locally

**Prerequisites:**
- Node.js v22.14.0 (as specified in `.nvmrc`)
- npm (comes with Node.js)

**Installation:**
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

**Running the Development Server:**
```bash
npm run dev
```
The application will be available at `http://localhost:4321` (or the port specified by Astro).

## Available Scripts

- `npm run dev`: Starts the development server with hot reloading.
- `npm run build`: Builds the application for production.
- `npm run preview`: Serves the production build locally for preview.
- `npm run astro`: Access Astro CLI commands.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run lint:fix`: Lints the codebase and attempts to fix issues automatically.
- `npm run format`: Formats the codebase using Prettier.

## Project Scope (MVP)

**In Scope:**
- Multi-tenant system architecture with data isolation between clubs
- Secure user authentication with role-based access:
  - System Administrator
  - Club Administrator
  - Trainer
  - Member
- Club management features:
  - Creation and management of clubs by system administrators
  - Email-based club administrator registration
  - Club-specific user management and role assignment
- Class management per club:
  - Create and edit classes (name, duration, capacity, trainer, schedule)
  - Real-time availability tracking
  - Class registration with membership validation
- Membership and pricing:
  - Club-specific pricing plans and membership types
  - Manual membership assignment by club administrators
  - Membership status tracking and validation
- Member features:
  - Interactive class schedule viewing
  - Class registration with capacity checking
  - Personal dashboard with upcoming classes

**Out of Scope (for MVP):**
- Public marketing website.
- Payment gateway integration and self-service membership purchase.
- OAuth login (e.g., Google, Facebook).
- Automated email notifications (verification, password reset, class reminders).
- User-initiated class cancellation.
- Advanced user profile management (editing details, password change).
- Advanced reporting and statistics module.
- Load testing.

## Project Status

**MVP - In Development**

## License

MIT
