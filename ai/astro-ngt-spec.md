# **Application Specification: NGT Martial Arts Club Web Presence**

**Version:** 1.0

## **1. Introduction**

### **1.1. Project Overview**
This document outlines the specifications for the "NGT Martial Arts Club Web Presence" project. The primary objective is to develop a modern, high-performance, and user-friendly web application serving as the club's public interface (`ngt.pl`) and an internal management tool (`panel.ngt.pl`).

### **1.2. Goals**
*   Provide an engaging and informative public website to attract new members.
*   Offer a seamless online experience for existing members to manage their profiles, book classes, and handle payments.
*   Equip club administrators and trainers with efficient tools for managing schedules, members, content, and operations.
*   Ensure the application is secure, scalable, maintainable, and accessible.

### **1.3. Target Audience**
*   **Public:** Prospective members, general public.
*   **Internal:** Registered Club Members, Club Administrators, Club Trainers.

### **1.4. Domain Structure**
*   **Public Landing Page:** `ngt.pl` (Example)
*   **Member/Admin Application Panel:** `panel.ngt.pl` (Example)

## **2. Functional Requirements**

### **Part 1: Landing Page (`ngt.pl`)**

**Purpose:** Public-facing marketing website to inform visitors and drive conversions (inquiries, trial sign-ups, membership interest).

**Technology:** Built with Astro for static site generation (SSG) or server-side rendering (SSR) where needed, optimized for performance and SEO. Styled with Tailwind CSS.

**2.1.1. Overall Design & Technology**
*   **Responsive Design:** Fully responsive layout adapting seamlessly to Desktop, Tablet, and Mobile viewport sizes.
*   **Consistent Theme:** Adherence to a defined visual theme using Tailwind CSS utility classes and a configuration file (`tailwind.config.js`).
*   **Performance Optimized:** Focus on achieving excellent Core Web Vitals scores (LCP, FID, CLS) through optimized images, efficient CSS (PurgeCSS/JIT), minimal JavaScript on initial load, and Astro's performance features.
*   **SEO Optimized:** Implementation of SEO best practices including semantic HTML structure, appropriate meta tags (title, description), Open Graph tags, structured data (Schema.org) where applicable (e.g., LocalBusiness, Event), and an automatically generated `sitemap.xml`.

**2.1.2. Required Sections**

*   **A. Hero Section:**
    *   Content: Compelling primary headline, supportive subheading, high-resolution background image or video loop relevant to NGT martial arts.
    *   CTA: Prominent Call(s)-to-Action button(s) (e.g., "Join a Free Trial Class", "View Class Schedule"). Links to relevant sections or the application panel sign-up/schedule.
*   **B. About Us / Club Philosophy:**
    *   Content: Text detailing the club's history, mission, values, and teaching philosophy. May include images of the training facility (dojo), key instructors, or students in action.
*   **C. Pricing Plans:**
    *   Content: Display cards or sections for each available membership plan or pass type (e.g., Monthly Unlimited, 10-Class Pass, Drop-in Fee).
    *   Details per Plan: Plan Name, Price, Duration/Validity (e.g., "per month", "valid for 3 months"), Key Features/Benefits (e.g., "Access to all regular classes", "10 class credits").
    *   CTA: Button for each plan (e.g., "Sign Up Now", "Purchase Pass") linking to the registration or purchase flow within the `panel.ngt.pl` application.
    *   **Data Source:** Pricing plan details (name, price, description, features) must be dynamically fetched from the backend API and managed via the Admin Panel.
*   **D. Schedule:**
    *   Content: Display the current weekly class schedule.
    *   Format: Clear, readable grid or list view.
    *   Details per Class: Class Name, Start Time, Duration (or End Time), Assigned Trainer Name, Target Audience/Level (optional).
    *   Functionality: Read-only view of the schedule. Optional: Client-side filtering by day of the week or class type.
    *   **Data Source:** Schedule data (class instances, times, trainers) must be dynamically fetched from the backend API, reflecting the schedule managed in the Admin Panel.
*   **E. Trainers:**
    *   Content: Section showcasing the club's trainers. Individual profiles for each trainer.
    *   Details per Trainer: High-quality Photo, Full Name, Biography/Credentials, Areas of Speciality, List of classes they typically teach.
    *   **Data Source:** Trainer profiles (details and photos) must be dynamically fetched from the backend API and managed via the Admin Panel.
*   **F. FAQ (Frequently Asked Questions):**
    *   Content: A list of common questions and their corresponding answers relevant to prospective and new members.
    *   UI: Use an accordion or toggle component for displaying questions and revealing answers to save space and improve scannability.
    *   **Data Source:** FAQ questions and answers must be dynamically fetched from the backend API and managed via the Admin Panel.
*   **G. Contact Information / Contact Form:**
    *   Content: Club's physical Address, Phone Number, primary Email Address.
    *   Map: Embedded interactive map (e.g., Google Maps iframe) showing the club's location.
    *   Contact Form:
        *   Fields: Name (required), Email (required, validation), Subject (optional), Message (required).
        *   Functionality: Upon submission, form data is sent to the backend, validated, and forwarded to a designated administrator email address.
        *   Spam Protection: Implement basic anti-spam measures (e.g., honeypot field, simple time-based check, or integration with a service like hCaptcha/reCAPTCHA if necessary).
*   **H. Footer:**
    *   Content: Copyright notice (dynamic year), links to relevant social media profiles (configurable), links to Privacy Policy and Terms of Service static pages.

---

### **Part 2: Application Panel (`panel.ngt.pl`)**

**Purpose:** Secure portal for registered users (Members) and staff (Trainers, Admins) to interact with club services and manage operations.

**Technology:** Built with Astro. Utilize Astro Islands with React (selected for lightness) for interactive components requiring client-side state and logic (e.g., forms, dashboards, interactive schedule). Styled with Tailwind CSS. Communication with the backend via a RESTful API.

**2.2.1. Overall Design & Technology**
*   **Authentication Required:** Access to all sections within `panel.ngt.pl` requires successful user authentication. Unauthenticated users should be redirected to the Login page.
*   **Role-Based Access Control (RBAC):** Different user roles (Admin, Trainer, Member) grant access to specific features and data. Backend API must enforce these permissions rigorously.
*   **Consistent Theme:** Shared Tailwind CSS configuration and potentially shared UI components with the landing page for visual consistency.
*   **Responsive Design:** Fully responsive for use on various devices.
*   **Secure API Communication:** All communication with the backend API must use HTTPS. Authentication tokens (JWT) must be handled securely.

**2.2.2. Core Features**

*   **A. Authentication:**
    *   **Sign Up:**
        *   Form: Email, Password (with confirmation), First Name, Last Name.
        *   Process: Server-side validation. Secure password hashing (bcrypt). Creation of user record with `ROLE_USER` default role and `inactive` status.
        *   Email Verification: Send an email with a unique, time-limited verification link. User account becomes `active` only after clicking the link.
    *   **OAuth Login (Google, Facebook):**
        *   Buttons: "Login with Google", "Login with Facebook".
        *   Process: Standard OAuth 2.0 flow using appropriate libraries (e.g., Passport.js strategies or Fastify equivalents).
        *   Account Linking: If a user logs in via OAuth and an account with the same verified email address already exists, link the OAuth provider to the existing account. If no account exists, create a new one based on OAuth profile information (name, email) with `ROLE_USER` and `active` status.
    *   **Login:**
        *   Form: Email, Password.
        *   Process: Validate credentials against hashed password in DB. Upon success, generate a JWT and store it securely (HttpOnly cookie recommended). Redirect to the user's dashboard. Implement basic brute-force protection (rate limiting).
    *   **Password Reset:**
        *   Flow: "Forgot Password" link -> Enter Email -> If email exists, send a unique, time-limited password reset link -> Link leads to a page to enter and confirm a new password.
        *   Security: Ensure reset tokens are single-use and expire reasonably quickly.
    *   **Logout:**
        *   Functionality: Button/link to terminate the user session.
        *   Process: Clear the authentication token (e.g., remove HttpOnly cookie via backend response). Redirect to the login page or landing page.

*   **B. User Role: Member (`ROLE_USER`)**
    *   **Dashboard:**
        *   Content: Personalized welcome message ("Hello, [First Name]"). Overview of current membership/pass status (e.g., "Monthly Unlimited - Expires Oct 31", "5 classes remaining on 10-Pass"). List of upcoming classes the user is registered for. Quick links to common actions (e.g., "Book a Class", "View Schedule", "Buy Pass").
    *   **Profile Management:**
        *   View/Edit: First Name, Last Name, Email (may require re-verification if changed), Phone Number.
        *   Password Change: Form for current password, new password, confirm new password.
        *   OAuth Management: View linked OAuth accounts (Google/Facebook icons). Ability to unlink (if password login is also set up).
    *   **Schedule Viewing (Interactive):**
        *   Display: Similar grid/list view as the landing page, but with added interactivity.
        *   Features: Filter by Date range, Class Type, Trainer. Display real-time class availability (e.g., "5 spots left", "Full"). Show classes the user is already booked into.
        *   Data Source: Fetched dynamically from the backend API.
    *   **Class/Event Sign-up:**
        *   Action: Button on available classes/events in the interactive schedule (e.g., "Book Spot").
        *   Logic:
            *   Backend checks if the user has an active membership/pass valid for the selected class/event type and if there are available spots.
            *   If valid pass has class credits, decrement credit count upon booking.
            *   If booking a paid one-time event without a suitable pass, redirect to a payment flow for that event.
        *   Feedback: Display success confirmation message upon booking. Show error message if booking fails (e.g., "No valid pass", "Class is full").
    *   **Booking Cancellation:**
        *   Action: Ability to cancel a previously made booking via the "My Bookings" section or interactive schedule.
        *   Rules: Cancellation only allowed up to a configurable time limit before the class starts (e.g., 2 hours). This rule is enforced by the backend. If the booking used a class credit, the credit is restored upon valid cancellation.
        *   Feedback: Confirmation message upon successful cancellation.
    *   **Membership/Pass Purchase:**
        *   Display: Browse available pricing plans (fetched from backend, identical to landing page data but with purchase actions).
        *   Process: Select plan -> Proceed to payment gateway integration (Stripe selected as default).
        *   Payment Gateway: Secure integration with Stripe Checkout or Payment Elements for handling payment details. Backend handles webhook events from Stripe to confirm payment success and activate the corresponding membership/pass for the user.
    *   **Payment History:**
        *   Display: A list of past transactions (pass purchases, membership renewals) including date, item purchased, amount paid, status (e.g., "Paid", "Failed").
    *   **My Bookings:**
        *   Display: Lists of upcoming registered classes/events and a history of past attended classes/events. Includes class name, date, time, trainer.

*   **C. User Role: Trainer (`ROLE_TRAINER`)** (Managed by Admin initially; separate panel access is optional)
    *   *Assumption:* Initially, trainers might not have direct panel login. Admins manage their schedules and profiles. If trainer access is implemented:
    *   **My Schedule:** View upcoming classes/events they are assigned to teach.
    *   **Class Roster:** View the list of members registered for each upcoming class they teach.
    *   **(Optional) Attendance Marking:** Ability to mark attendance for participants in their classes (e.g., checkboxes next to names). Requires backend endpoint to record attendance.

*   **D. User Role: Administrator (`ROLE_ADMIN`)**
    *   **Admin Dashboard:**
        *   Content: High-level overview metrics. Examples: Total Active Members, # of Memberships expiring soon, Upcoming Class Occupancy rates, Recent Sign-ups, Recent Bookings, Basic Revenue summary (e.g., last 7/30 days - requires payment integration data).
    *   **User Management:**
        *   View: Paginated list of all registered users.
        *   Search/Filter: By Name, Email, Role, Membership Status.
        *   Actions: View detailed user profile (including membership/pass status, booking history, payment history). Manually activate/deactivate user accounts. Assign/change user roles (`ROLE_USER`, `ROLE_TRAINER`, `ROLE_ADMIN`).
    *   **Class Management (CRUD):**
        *   Interface: Manage *definitions* of recurring classes.
        *   Fields: Name (e.g., "Advanced Kickboxing"), Description, Default Assigned Trainer(s), Duration (minutes), Max Capacity, Required Pass Type(s) (link to Pricing Plans), Difficulty Level (optional).
        *   Actions: Create New Class Definition, Edit Existing, View Details, Delete Definition (only if no active schedules depend on it).
    *   **One-Time Event Management (CRUD):**
        *   Interface: Manage special, non-recurring events or workshops.
        *   Fields: Name, Description, Specific Date(s) & Time(s), Duration, Trainer(s), Max Capacity, Price (can be 0 or a specific amount), Required Pass Type(s) (optional, can override standard passes).
        *   Actions: Create New Event, Edit Existing, View Details, Delete Event.
    *   **Schedule Management:**
        *   Interface: Visual calendar interface (e.g., implement using FullCalendar.js or similar library within an Astro Preact island) displaying scheduled class instances and events.
        *   Actions:
            *   Schedule Recurring Class: Select a Class Definition, select day(s)/time(s) for it to recur on the calendar, assign a specific trainer (can default from definition).
            *   Schedule One-Time Event: Place a created One-Time Event onto the calendar.
            *   Modify Instance: Change the trainer for a specific class instance (substitution).
            *   Cancel Instance: Cancel a single occurrence of a class (e.g., holiday). Option to notify registered participants via email (requires background job/email service).
            *   View Instance Details: Click on a calendar entry to see details and list of registered participants.
    *   **Trainer Management (CRUD):**
        *   Interface: Manage trainer profiles displayed on the landing page.
        *   Fields: Name, Email (for potential panel login), Phone (optional), Bio/Credentials, Specialities, Profile Photo Upload.
        *   Actions: Add New Trainer, Edit Existing, View Details, Delete Trainer.
        *   Link to User Account: Ability to link a Trainer profile to a registered User account, granting them `ROLE_TRAINER` permissions if that role is implemented with panel access.
    *   **Pricing Plan Management (CRUD):**
        *   Interface: Define and manage membership tiers and class passes available for purchase.
        *   Fields: Plan Name (e.g., "Monthly Unlimited", "10 Class Pass"), Price, Currency, Duration/Validity Period (e.g., 30 days, 90 days, null for non-expiring credits), Number of Class Credits (e.g., -1 for unlimited, 10 for 10-pass, 1 for drop-in), Allowed Class Types (link to specific class definitions if needed), Description.
        *   Payment Gateway Link: Field to store the corresponding Product/Price ID from the payment gateway (e.g., Stripe Price ID).
        *   Status: Mark plans as Active (available for purchase) or Inactive.
        *   Actions: Create New Plan, Edit Existing, View Details, Activate/Deactivate.
    *   **Membership/Pass Management:**
        *   View: List of all active memberships and passes held by users. Filter by user, plan type, expiry date.
        *   Actions: Manually grant a specific pass/membership to a user (e.g., for complimentary access). Manually revoke/cancel a pass. Extend the duration or add credits to an existing pass (log these manual changes).
    *   **Content Management (Landing Page - Basic):**
        *   Interface: Simple forms for updating specific content areas on the landing page without code deployment.
        *   Editable Content:
            *   Pricing Plan descriptions/features (prices linked to Pricing Plan Management).
            *   Trainer Bios.
            *   FAQ entries (Question/Answer pairs - Add/Edit/Delete/Reorder).
            *   'About Us' text content.
    *   **Booking Management:**
        *   View: List of all bookings for upcoming classes/events. Filter by class, date, user.
        *   Actions: Manually add a user to a class roster (backend must check capacity and ideally log manual additions). Manually remove a user from a class roster (backend should handle credit restoration if applicable and log the removal).
    *   **(Optional) Reporting:**
        *   Interface: Section for generating basic reports.
        *   Reports:
            *   Attendance Logs (Filter by date range, class, trainer, member).
            *   Popular Classes/Times (Based on booking/attendance data).
            *   Membership/Revenue Overview (Based on payment history, filterable by date range).
            *   Export: Option to export report data to CSV format.

## **3. Technical Requirements & Stack**

*   **Frontend Framework:** **Astro**
    *   Interactive Islands: **React** (chosen for performance and smaller bundle size compared to React).
    *   State Management: **Nanostores**. A tiny, framework-agnostic state manager suitable for sharing state between different UI frameworks and Astro components.
*   **Styling:** **Tailwind CSS**
    *   Configuration: `tailwind.config.js` defining theme (colors, fonts, spacing). JIT mode enabled.
*   **UI Components:** **shadcn integrated with astro** integrated with Tailwind CSS for accessible components (Modals, Dropdowns, Toggles, etc.), supplemented by custom-built components as needed.
*   **Backend Language/Framework:** **Node.js** with **Fastify** (selected for performance and async handling).
*   **Database:** **PostgreSQL**
    *   ORM: **Prisma** (selected for type safety, migrations, and developer experience).
*   **API:** **RESTful API**
    *   Design: Clear endpoints, proper HTTP verbs (GET, POST, PUT, DELETE, PATCH), standard status codes (2xx, 4xx, 5xx). Versioning (e.g., `/api/v1/...`). Request/response bodies in JSON format. OpenAPI/Swagger documentation is recommended.
*   **Authentication Implementation:**
    *   Session Management: **JWT (JSON Web Tokens)** stored in secure **HttpOnly Cookies**.
    *   Password Hashing: **bcrypt** (or Argon2).
    *   OAuth: **fastify-oauth2** or similar Fastify-compatible library for Google/Facebook integration.
*   **Testing:**
    *   Unit/Integration (Backend & Utils): **Vitest**. Test critical business logic (booking rules, payment webhooks, auth, permissions), database interactions, utility functions. Aim for >70% coverage on critical paths.
    *   Unit/Integration (Frontend Islands): **Vitest** with `@testing-library/react`. Test component rendering and interactions.
    *   E2E Tests: **Playwright**. Cover key user flows (Sign up, Login, View Schedule, Book Class, Cancel Booking, Admin creates class, Admin manages user).
*   **Deployment:**
    *   Frontend (Astro - `ngt.pl` & `panel.ngt.pl`): Deploy as SSR or Static builds to **Vercel** (preferred for DX and Astro integration) or alternatives like Netlify, Cloudflare Pages.
    *   Backend (Fastify/Node.js): Containerize using **Docker**. Deploy to a platform like **Fly.io** (preferred for simple global deployment and Postgres integration) or alternatives like Render, Google Cloud Run, AWS ECS/Fargate.
    *   Database (PostgreSQL): Use a managed service like **Supabase Postgres**, **Neon**, **Fly Postgres**, AWS RDS, or Google Cloud SQL.

## **4. Non-Functional Requirements**

*   **Performance:**
    *   Landing Page: Target LCP < 2.5s, FID < 100ms, CLS < 0.1. Minimize blocking JS. Optimize images (formats like WebP/AVIF, responsive sizes).
    *   Application Panel: API response times < 500ms for typical requests. Efficient database queries (use indexing appropriately). Optimize frontend island loading.
*   **Scalability:**
    *   Backend: Design as stateless application instances. Use database connection pooling.
    *   Database: Schema designed with potential future growth in mind. Choose a managed database service that allows easy scaling.
*   **Security:**
    *   Data Validation: Implement validation on both client-side (user feedback) and server-side (security).
    *   Threat Prevention: Protect against common web vulnerabilities (XSS, CSRF - using techniques like anti-CSRF tokens if not relying solely on cookie auth + same-site, SQL Injection - mitigated by ORM usage).
    *   Authentication & Authorization: Secure JWT handling, strong password policies, robust RBAC checks on *every* relevant API endpoint.
    *   Dependencies: Regularly scan and update dependencies to patch vulnerabilities.
    *   Secrets Management: Use environment variables and secure secrets management for API keys, database credentials, JWT secrets.
    *   Rate Limiting: Apply rate limiting to sensitive endpoints (login, password reset, sign-up, contact form submission).
*   **Usability:**
    *   Intuitive Navigation: Clear site structure and navigation menus.
    *   User Flows: Logical and efficient task completion (booking, purchasing, managing).
    *   Feedback: Provide clear visual feedback for user actions (loading states, success messages, informative error messages).
    *   Consistency: Maintain consistent layout, terminology, and interaction patterns across the application.
*   **Accessibility (a11y):**
    *   Target WCAG 2.1 Level AA compliance.
    *   Use semantic HTML markup. Ensure keyboard navigability for all interactive elements. Provide sufficient color contrast. Include `alt` text for meaningful images. Use ARIA attributes where necessary to enhance accessibility for assistive technologies.
*   **Maintainability:**
    *   Code Quality: Clean, well-documented code following established style guides (ESLint, Prettier configured).
    *   Modularity: Break down frontend and backend into reusable components/modules/services.
    *   Configuration: Use environment variables for all environment-specific configurations (database URLs, API keys, JWT secrets, etc.).
    *   Version Control: Use Git with a clear branching strategy (e.g., Gitflow).

## **5. Data Model Considerations (High-Level)**

A detailed Entity-Relationship Diagram (ERD) should be created based on these core entities:

*   `User`: Stores user account information (id, name, email, hashed password, roles, status, timestamps, linked OAuth providers).
*   `Role`: Defines user roles (e.g., `ROLE_USER`, `ROLE_ADMIN`, `ROLE_TRAINER`). (Many-to-Many with User or simple role field on User).
*   `Trainer`: Stores trainer profile information (linked to User ID if applicable, name, bio, photo URL, specialities).
*   `ClassDefinition`: Defines the template for recurring classes (id, name, description, duration, capacity, default trainer ID - FK to Trainer, required pass types).
*   `Event`: Defines one-time events (id, name, description, start time, end time, capacity, price, trainer ID - FK to Trainer).
*   `ScheduledInstance`: Represents a specific occurrence of a ClassDefinition or Event on the calendar (id, class definition ID or event ID, start time, end time, assigned trainer ID - FK to Trainer, status - e.g., scheduled, cancelled).
*   `PricingPlan`: Defines purchasable memberships/passes (id, name, description, price, currency, duration type, duration value, class credits, stripe price ID, status - active/inactive).
*   `Membership`: Represents an instance of a purchased PricingPlan associated with a User (id, user ID - FK to User, plan ID - FK to PricingPlan, start date, end date, remaining credits, status - active/expired/cancelled, stripe subscription ID - optional).
*   `Booking`: Records a User's registration for a ScheduledInstance (id, user ID - FK to User, instance ID - FK to ScheduledInstance, booking time, status - booked/cancelled/attended, membership ID used - FK to Membership).
*   `Payment`: Records payment transactions (id, user ID - FK to User, amount, currency, status, timestamp, payment gateway transaction ID, related membership/plan ID).
*   `FAQ`: Stores FAQ entries (id, question, answer, order).
*   `LandingPageContent`: Potentially a simple key-value store or structured table for editable landing page text sections.

## **6. API Design Principles**

*   **Style:** RESTful.
*   **Format:** JSON for request/response bodies.
*   **Authentication:** JWT via HttpOnly Cookies. Bearer token in `Authorization` header may be supported for specific use cases if needed.
*   **Authorization:** RBAC enforced at the API gateway or middleware level for relevant endpoints.
*   **Error Handling:** Consistent error response format (e.g., `{ "statusCode": 400, "error": "Bad Request", "message": "Invalid input field 'email'." }`).
*   **Documentation:** Use OpenAPI (Swagger) specification for documentation.

## **7. Deployment Strategy**

*   **Infrastructure:** Cloud-based hosting (Vercel, Fly.io, Managed Postgres).
*   **CI/CD:** Implement Continuous Integration/Continuous Deployment pipelines (e.g., using GitHub Actions, GitLab CI, Vercel deployments).
    *   Frontend: Build and deploy on push to main branch. Preview deployments for PRs.
    *   Backend: Build Docker image, push to registry, deploy container on push to main branch. Run database migrations as part of the deployment process.
*   **Environments:** Separate environments for Development, Staging (optional), and Production. Use environment variables for configuration.

## **8. Security Considerations Summary**

*   Strict input validation (client & server).
*   Parameterized queries (via ORM) to prevent SQL injection.
*   Output encoding to prevent XSS.
*   Secure JWT handling (HttpOnly cookies, short expiry, refresh tokens if necessary).
*   CSRF protection (if not relying solely on HttpOnly SameSite cookies).
*   Strong password hashing and storage (bcrypt/Argon2).
*   HTTPS enforced everywhere.
*   Rigorous Role-Based Access Control checks on all API endpoints.
*   Rate limiting on sensitive endpoints.
*   Regular dependency scanning and updates.
*   Secure management of secrets and API keys.

## **9. Assumptions & Future Considerations**

### **9.1. Assumptions**
*   Domain registration (`ngt.pl`) and DNS management are handled externally.
*   Web hosting costs are approved.
*   Stripe is the selected payment gateway. If another is preferred (e.g., PayU), integration details will need adjustment.
*   The initial launch does not require real-time features (e.g., live updates of remaining spots without refresh).
*   The `ROLE_TRAINER` initially does not grant separate panel login access; Admins manage trainer schedules and profiles. This can be added as a V2 feature.
*   Content (initial text, images) will be provided by the NGT club stakeholders.

### **9.2. Future Considerations**
*   Dedicated Trainer Panel (`ROLE_TRAINER` login).
*   Real-time schedule updates (WebSockets).
*   Advanced reporting and analytics dashboard.
*   Mobile application (potentially using the same backend API).
*   Waitlist functionality for full classes.
*   Integration with calendar applications (iCal export for users).
*   Community features (member forum, announcements).

---
**End of Specification**