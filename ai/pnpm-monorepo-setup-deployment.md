# pnpm Monorepo Setup and Deployment Guide

This guide details how to set up the pnpm workspace for the NGT project and outlines deployment strategies for the individual applications.

## 1. Initializing the pnpm Workspace

1.  **Navigate to the root directory:**
    ```bash
    cd /home/daniel/projects/astro-ngt/
    ```
2.  **Initialize pnpm (if not already done):**
    This creates a root `package.json` file.
    ```bash
    pnpm init
    ```
3.  **Create the `pnpm-workspace.yaml` file:**
    In the root directory (`/home/daniel/projects/astro-ngt/`), create a file named `pnpm-workspace.yaml` with the following content:

    ```yaml
    packages:
      - 'apps/*'
      - 'packages/*'
    ```
    This tells pnpm where to find the workspace packages.

## 2. Setting Up Packages and Applications

1.  **Create Directories:** Create the directory structure outlined in the architecture document (`apps/api`, `apps/landing`, `apps/panel`, `packages/ui`, `packages/types`, etc.).
2.  **Initialize Each Package/App:** Navigate into each application and package directory (`apps/api`, `packages/ui`, etc.) and run `pnpm init` to create their individual `package.json` files.
3.  **Install Dependencies:**
    *   **Workspace Dependencies:** To install a dependency needed by a specific app or package, navigate to its directory and use `pnpm add <dependency>`. For example, in `apps/landing`:
        ```bash
        cd apps/landing
        pnpm add astro react @astrojs/react @astrojs/tailwind # Example dependencies
        ```
    *   **Shared Dependencies:** If multiple packages need the *exact same version* of a dependency, you can install it in the root workspace using the `-w` flag:
        ```bash
        # In the root directory
        pnpm add -D typescript -w # Example dev dependency for the whole workspace
        ```
    *   **Internal Dependencies:** To use a shared package (e.g., `ui`) within an application (e.g., `landing`), add it as a dependency using the `workspace:` protocol. In `apps/landing/package.json`:
        ```json
        {
          "name": "landing",
          // ... other properties
          "dependencies": {
            // ... other dependencies
            "@ngt/ui": "workspace:*",
            "@ngt/types": "workspace:*"
          }
        }
        ```
        Make sure the `name` property in the shared package's `package.json` (e.g., `packages/ui/package.json`) matches the name used here (e.g., `@ngt/ui`). You might want to use scoped names like `@ngt/` for clarity. Run `pnpm install` in the root directory after adding workspace dependencies to link them.

## 3. TypeScript Configuration (Optional but Recommended)

*   Create a `tsconfig.base.json` in the root for common settings.
*   In each package/app's `tsconfig.json`, extend the base configuration and set up path aliases using `references` to link workspace packages for better type checking and IntelliSense.

    **Example `tsconfig.base.json`:**
    ```json
    // filepath: /home/daniel/projects/astro-ngt/tsconfig.base.json
    {
      "compilerOptions": {
        "target": "ESNext",
        "module": "ESNext",
        "moduleResolution": "node",
        "esModuleInterop": true,
        "strict": true,
        "skipLibCheck": true,
        // Add other common options
      }
    }
    ```

    **Example `apps/landing/tsconfig.json`:**
    ```json
    // filepath: /home/daniel/projects/astro-ngt/apps/landing/tsconfig.json
    {
      "extends": "../../tsconfig.base.json",
      "compilerOptions": {
        "baseUrl": ".",
        "paths": {
          "@ngt/ui/*": ["../../packages/ui/src/*"],
          "@ngt/types/*": ["../../packages/types/src/*"]
        }
        // Add app-specific options
      },
      "references": [
        { "path": "../../packages/ui" },
        { "path": "../../packages/types" }
      ]
    }
    ```
    *Note: Adjust paths based on your actual structure and output directories.*

## 4. Running Scripts

You can run scripts defined in individual `package.json` files from the root using the `--filter` flag:

```bash
# Run the 'dev' script in the 'landing' app
pnpm --filter landing dev

# Run the 'build' script in all applications
pnpm --filter "./apps/*" build

# Run the 'build' script in all packages
pnpm --filter "./packages/*" build
```

## 5. Deployment Strategies

Each application in the `apps/` directory is deployed independently.

1.  **`api` (Node.js/Fastify Backend):**
    *   **Build:** Run the build script for the API (e.g., `pnpm --filter api build`). This typically compiles TypeScript to JavaScript (e.g., into a `dist` folder).
    *   **Deployment:**
        *   **Containerization (Recommended):** Use the `Dockerfile` to build a container image. Deploy this image to a container registry (like Docker Hub, GitHub Container Registry, AWS ECR) and then deploy it to a hosting platform (like Fly.io, Render, AWS ECS/EKS, Google Cloud Run). The container should include the built code (`dist`), `node_modules`, `prisma/schema.prisma`, and potentially the Prisma client generation step.
        *   **Server/PaaS:** Copy the built code (`dist`), `node_modules`, `prisma/schema.prisma`, and `package.json` to the server/platform. Run Prisma migrations (`prisma migrate deploy`) and start the application (`node dist/server.js`).
    *   **Environment Variables:** Configure environment variables for database connections, secrets, CORS origins (pointing to your deployed frontend URLs), etc., on the hosting platform.

2.  **`landing` (Astro SSG/SSR):**
    *   **Build:** Run `pnpm --filter landing build`. Astro will generate static files (for SSG) or server-specific output (for SSR) in its `dist/` directory.
    *   **Deployment:**
        *   **Static Hosting (for SSG):** Deploy the contents of `apps/landing/dist/client/` to a static hosting provider (like Netlify, Vercel, Cloudflare Pages, GitHub Pages).
        *   **Node.js Hosting (for SSR):** Deploy the contents of `apps/landing/dist/` (which includes both `client/` and `server/`) to a Node.js hosting environment (like Vercel, Netlify, Render, Fly.io). Configure the platform to run the server entry point (e.g., `node ./dist/server/entry.mjs`).
    *   **API Connection:** Configure an environment variable (e.g., `PUBLIC_API_URL`) during the build or runtime to point to the deployed URL of your `api` application. Astro uses `import.meta.env` for environment variables.

3.  **`panel` (Astro SSR):**
    *   **Build:** Run `pnpm --filter panel build`. Astro will generate the server and client assets in its `dist/` directory.
    *   **Deployment:** Deploy the contents of `apps/panel/dist/` to a Node.js hosting environment (similar to SSR deployment for `landing`). Platforms like Vercel or Netlify handle this well.
    *   **API Connection:** Configure the `PUBLIC_API_URL` environment variable similarly to the `landing` app, pointing to the deployed `api` URL.
    *   **Authentication:** Ensure authentication mechanisms (cookies, tokens) are correctly configured for the domain (`panel.ngt.pl`) and that CORS settings on the `api` allow requests from this domain.

## 6. How They Work Together After Deployment

*   The deployed `landing` and `panel` frontends make HTTP requests (e.g., `fetch`) to the publicly accessible URL of the deployed `api` backend.
*   The `api` backend handles these requests, interacts with the database, and sends back responses.
*   CORS must be configured correctly on the `api` backend to allow requests from the domains where `landing` and `panel` are hosted.
*   Shared `types` ensure consistency in data structures between frontend requests and backend responses. Shared `ui` components are bundled into each frontend application during their respective build processes.
