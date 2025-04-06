# NGT Martial Arts Club - Project Architecture

This document outlines the recommended project structure and architecture for the NGT Martial Arts Club web presence, leveraging a monorepo approach for better code sharing and management.

## 1. Recommended Approach: Monorepo

A monorepo structure is recommended for this project. It simplifies managing dependencies, sharing code (like UI components and TypeScript types) between the frontend applications and potentially the backend, and streamlining the development workflow and CI/CD setup.

We will use `pnpm` workspaces to manage the monorepo structure.

## 2. Directory Structure

```
/home/daniel/projects/astro-ngt/
├── apps/
│   ├── api/             # Node.js (Fastify) Backend Application
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── landing/         # Astro Frontend for ngt.pl (Public Landing Page)
│   │   ├── public/
│   │   ├── src/
│   │   ├── astro.config.mjs
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── panel/           # Astro Frontend for panel.ngt.pl (Application Panel)
│       ├── public/
│       ├── src/
│       ├── astro.config.mjs
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── ui/              # Shared React UI Components (using shadcn/ui)
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── types/           # Shared TypeScript types/interfaces
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── utils/           # (Optional) Shared utility functions
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── package.json         # Root package.json for monorepo config (workspaces)
├── pnpm-workspace.yaml  # pnpm workspace configuration
└── tsconfig.base.json   # Base tsconfig for shared settings (optional)
```

## 3. Rationale

*   **`apps/` Directory:** Contains the deployable applications.
    *   **`api`:** The Fastify backend. It handles business logic, database interactions (Prisma), and serves the REST API.
    *   **`landing`:** An Astro application primarily focused on SSG/SSR for the public `ngt.pl` site. Optimized for SEO and performance. It consumes data from the `api` and uses shared `ui` components.
    *   **`panel`:** An Astro application focused on SSR for the `panel.ngt.pl` site. It heavily relies on interactive React islands, consumes data from the `api`, and uses shared `ui` components. Keeping it separate from `landing` allows for distinct build configurations, dependencies (if needed), and deployment strategies.
*   **`packages/` Directory:** Contains code shared across applications.
    *   **`ui`:** Houses reusable React components built with shadcn/ui primitives, styled with Tailwind CSS. Both `landing` and `panel` apps will depend on this package.
    *   **`types`:** Defines shared TypeScript interfaces and types (e.g., API response structures, data models). This ensures type consistency between the backend (`api`) and the frontends (`landing`, `panel`).
    *   **`utils`:** Optional package for any utility functions (e.g., date formatting, validation helpers) needed in multiple applications.

## 4. Why Separate Frontends (`landing` and `panel`)?

While Astro *could* potentially handle both sites within one project using complex routing and conditional logic, separating them offers significant advantages:

*   **Clear Separation of Concerns:** `ngt.pl` is marketing-focused (SEO, performance), while `panel.ngt.pl` is application-focused (interactivity, authentication, state management). Separating them keeps their codebase and configurations cleaner.
*   **Optimized Builds:** Each site can have its own optimized Astro build configuration (SSG vs. SSR, different island strategies if needed).
*   **Independent Deployment:** Aligns perfectly with the deployment strategy of targeting different platforms or configurations for `ngt.pl` and `panel.ngt.pl`.
*   **Scalability:** Easier to manage and scale each frontend independently as features grow.
