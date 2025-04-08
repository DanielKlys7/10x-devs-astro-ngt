# NGT Club Management Panel (MVP)

## Project Description

The NGT Club Management Panel (MVP) is a dedicated tool designed to streamline the management of the NGT martial arts club. It addresses the inflexibility and cost associated with existing club management systems.

Key features include:
- Secure login for administrators and members (using bcrypt for password hashing).
- Management of users, classes, pricing plans, and memberships.
- Member registration and viewing of the class schedule.
- Collection of analytical data (class history, training time, cancelled registrations) for future reporting modules.
- Communication layer between the frontend (Astro + React Islands + Tailwind CSS) and backend services (Supabase).

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
- Secure user authentication (Admin/Member) via email/password.
- User management (view list, assign roles).
- Class management (create, view, edit details like name, duration, capacity, trainer, schedule).
- Pricing plan / Membership management (create, view).
- Manual assignment of memberships to users by admins.
- Member registration for classes (validates active membership and class availability).
- Member dashboard to view upcoming registered classes.
- Backend API logic for business rules and database interaction.
- Data collection for future analytics (attendance, duration, cancellations).
- GDPR compliance for user data storage.

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
