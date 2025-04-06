# NGT Martial Arts Club - Technical Stack

This document outlines the core technologies used in the NGT Martial Arts Club web presence project.

## Frontend

*   **Framework:** Astro
*   **Interactive Islands:** React
*   **State Management:** Nanostores

## Styling

*   **Framework:** Tailwind CSS
*   **Configuration:** `tailwind.config.js` (JIT mode enabled)

## UI Components

*   **Library:** shadcn integrated with Astro & Tailwind CSS
*   **Custom:** Supplemented by custom-built components as needed.

## Backend

*   **Language/Framework:** Node.js with Fastify

## Database

*   **Type:** PostgreSQL
*   **ORM:** Prisma

## API

*   **Style:** RESTful API
*   **Format:** JSON
*   **Documentation:** OpenAPI/Swagger (Recommended)

## Authentication

*   **Session Management:** JWT (JSON Web Tokens) stored in secure HttpOnly Cookies.
*   **Password Hashing:** bcrypt (or Argon2)
*   **OAuth:** `fastify-oauth2` or similar Fastify-compatible library (Google, Facebook)

## Testing

*   **Backend Unit/Integration:** Vitest
*   **Frontend Unit/Integration:** Vitest with `@testing-library/react`
*   **E2E Tests:** Playwright

## Deployment

*   **Frontend (Astro):**
    *   **Strategy:** Deploy as two separate Astro projects or a single monorepo with distinct build outputs/routing rules.
    *   **Landing Page (`ngt.pl`):** Primarily static or SSR build, optimized for SEO and performance. Deployed to **Vercel** (Preferred), Netlify, Cloudflare Pages. Configure the custom domain `ngt.pl` to point to this deployment.
    *   **Application Panel (`panel.ngt.pl`):** SSR build with interactive islands. Deployed to **Vercel** (Preferred) or similar platforms. Configure the custom subdomain `panel.ngt.pl` to point to this deployment.
    *   **Platform Choice:** Vercel allows easy management of multiple projects or monorepos and assigning custom domains/subdomains.
*   **Backend (Fastify/Node.js):** Docker container on Fly.io (Preferred), Render, Google Cloud Run, AWS ECS/Fargate
*   **Database (PostgreSQL):** Managed Service (Supabase Postgres, Neon, Fly Postgres, AWS RDS, Google Cloud SQL)
