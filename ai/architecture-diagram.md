# NGT Martial Arts Club - Architecture Diagram

```mermaid
flowchart TD
    %% Define all nodes first
    Users(["Users"])
    Database[(PostgreSQL)]
    
    %% Applications
    Landing["Landing Site<br/>(Astro)"]
    Panel["Admin Panel<br/>(Astro)"]
    API["Backend API<br/>(Fastify)"]
    
    %% Shared packages
    Types["Types"]
    Utils["Utils"]
    UI["UI Components<br/>(React)"]
    
    %% Style definitions
    classDef external fill:#f4f4f4,stroke:#666,stroke-width:1px,stroke-dasharray: 5 5
    classDef apps fill:#e6f0ff,stroke:#3366cc,stroke-width:2px
    classDef packages fill:#e6ffe6,stroke:#33cc33,stroke-width:1px
    
    %% Apply styles
    class Users,Database external
    class Landing,Panel,API apps
    class UI,Types,Utils packages
    
    %% User flow
    Users --> Landing
    Users --> Panel
    
    %% Application flows - separated for clarity
    Landing --> API
    Panel --> API
    API --> Database
    
    %% Package dependencies - kept simple with clear direction
    Utils --> Types
    UI --> Types
    UI --> Utils
    
    %% Application dependencies on packages - arranged to minimize crossings
    Landing --> Types
    Landing --> Utils
    Landing --> UI
    
    Panel --> Types
    Panel --> Utils
    Panel --> UI
    
    API --> Types
    
    %% Subgraphs for visual grouping
    subgraph Apps ["Applications"]
        Landing
        Panel
        API
    end
    
    subgraph Packages ["Shared Packages"]
        direction TB
        Types
        Utils
        UI
    end
```

## User Flow and Dependencies

This diagram shows the system architecture:

1. **User Flow:**
   - Users interact with the Landing Site (public) or Admin Panel
   - Both applications communicate with the Backend API
   - The API connects exclusively to PostgreSQL database

2. **Package Dependencies (Bottom-Up):**
   - **Types**: Foundation package (no dependencies)
   - **Utils**: Builds on Types
   - **UI Components**: Uses both Types and Utils

3. **Application Dependencies:**
   - Frontend applications (Landing, Panel) use all shared packages
   - Backend API only uses Types package
