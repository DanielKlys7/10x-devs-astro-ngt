# REST API Plan

## 1. Resources

- **Sport Clubs** (Database Table: `sport_clubs`)
  - Holds club details such as name, address, contact email/phone, and metadata (created_at, updated_at, deleted_at).

- **Memberships** (Database Table: `memberships`)
  - Represents a many-to-many relationship between users and clubs with additional attributes (membership_role, active pricing plan details, managed_by).

- **Pricing Plans** (Database Table: `pricing_plans`)
  - Defines various pricing options for clubs including price, number_of_entries, duration, and status (active, inactive, archived).

- **Classes** (Database Table: `classes`)
  - Contains class (session) information such as name, description, scheduled time, duration, and maximum seats.

- **Class Registrations** (Database Table: `class_registrations`)
  - Records user registrations to classes including registration status and timestamps.

- **Analytics Logs** (Database Table: `analytics_logs`)
  - Stores event logs tied to clubs for later analysis (event_type, event_data, optional user reference).

- **Users** (Referenced from `auth.users`)
  - Although managed by Supabase authentication, user details and roles drive access and interactions within the API.

---

## 2. Endpoints

### Authentication & Registration

1. **POST /api/auth/login**
   - **Description:** Authenticate a user using email and password.
   - **Request Payload:**
     ```json
     { "email": "string", "password": "string" }
     ```
   - **Response:**
     ```json
     { "token": "string", "user": { "id": "UUID", "email": "string", "role": "string" } }
     ```
   - **Success Codes:** 200 OK
   - **Error Codes:** 401 Unauthorized

2. **POST /api/auth/register**
   - **Description:** Register a new user via an invitation (using an invite token).
   - **Request Payload:**
     ```json
     { "firstName": "string", "lastName": "string", "email": "string", "password": "string", "inviteToken": "string" }
     ```
   - **Response:** 201 Created with user details
   - **Error Codes:** 400 Bad Request, 409 Conflict

3. **POST /api/auth/logout**
   - **Description:** Logout user and invalidate the session token.
   - **Response:** 200 OK

---

### Sport Clubs

1. **POST /api/clubs**
   - **Description:** Create a new sport club (admin-level access required).
   - **Request Payload:**
     ```json
     {
       "name": "string",
       "address": "string (optional)",
       "contact_email": "string",
       "contact_phone": "string (optional)"
     }
     ```
   - **Response:** Newly created club details (including generated UUID and metadata)
   - **Error Codes:** 400 Bad Request

2. **GET /api/clubs**
   - **Description:** Retrieve a list of clubs with support for pagination, filtering, and search.
   - **Query Parameters:** `page`, `limit`, `search`
   - **Response:**
     ```json
     { "clubs": [ { club details } ], "pagination": { "page": number, "limit": number, "total": number } }
     ```

3. **GET /api/clubs/{id}**
   - **Description:** Retrieve detailed information about a specific club.
   - **Response:** Club details

4. **PUT /api/clubs/{id}**
   - **Description:** Update club details (admin or authorized role).
   - **Request Payload:** Fields to update (e.g., name, address, contact_email, contact_phone)
   - **Response:** Updated club details

5. **DELETE /api/clubs/{id}**
   - **Description:** Soft-delete a club (mark as deleted without removing data).
   - **Response:** 204 No Content

---

### Memberships

1. **POST /api/clubs/{clubId}/members**
   - **Description:** Add or invite a user to a club. This endpoint creates a membership record.
   - **Request Payload:**
     ```json
     { "user_id": "UUID", "membership_role": "string", "managed_by": "UUID" }
     ```
   - **Business Logic:** Enforce unique membership for each `(user_id, clubId)` pair, managed_by HAVE to be clubAdministrator ID.
   - **Response:** Created membership details

2. **GET /api/clubs/{clubId}/members**
   - **Description:** List members of a specific club, with optional filtering by role and pagination.
   - **Response:** List of membership records with pagination metadata

3. **PUT /api/memberships/{membershipId}**
   - **Description:** Update membership details (e.g., change role, assign active pricing plan, set auto_renew).
   - **Request Payload:** Fields to update (membership_role, active_plan_pricing_plan_id, etc.)
   - **Response:** Updated membership record

4. **DELETE /api/memberships/{membershipId}**
   - **Description:** Remove a user's membership from a club.
   - **Response:** 204 No Content

---

### Pricing Plans

1. **POST /api/clubs/{clubId}/pricing-plans**
   - **Description:** Create a new pricing plan for a club (accessible by sportsClubAdmin).
   - **Request Payload:**
     ```json
     {
       "name": "string",
       "description": "string",
       "price": number,
       "number_of_entries": number,
       "duration_in_days": number,
       "status": "active" 
     }
     ```
   - **Response:** Details of the created pricing plan

2. **GET /api/clubs/{clubId}/pricing-plans**
   - **Description:** List all pricing plans for a club with pagination.
   - **Response:** Array of pricing plan records with pagination info

3. **GET /api/pricing-plans/{id}**
   - **Description:** Retrieve details of a specific pricing plan.
   - **Response:** Pricing plan details

4. **PUT /api/pricing-plans/{id}**
   - **Description:** Update an existing pricing plan.
   - **Request Payload:** Fields to update (name, description, price, etc.)
   - **Response:** Updated pricing plan details

5. **DELETE /api/pricing-plans/{id}**
   - **Description:** Soft-delete a pricing plan (e.g., update status to 'archived' and set deletion metadata).
   - **Response:** 204 No Content

---

### Classes

1. **POST /api/clubs/{clubId}/classes**
   - **Description:** Create a new class (session) for a club (accessible by sportsClubAdmin).
   - **Request Payload:**
     ```json
     {
       "name": "string",
       "description": "string",
       "scheduled_at": "ISO 8601 timestamp",
       "duration_minutes": number,
       "max_seats": number,
       "trainer_id": "UUID"
     }
     ```
   - **Business Logic:** 
     - Validate that the trainer belongs to the club with 'trainer' role 
   - **Response:** Newly created class details

2. **GET /api/clubs/{clubId}/classes**
   - **Description:** List classes for a club with support for date filtering, pagination, and sorting.
   - **Query Parameters:** `page`, `limit`, `date` (or date range), `trainer_id` (optional)
   - **Response:** Array of class records with pagination metadata 

3. **GET /api/classes/{id}**
   - **Description:** Retrieve details of a specific class.
   - **Response:** Class details

4. **PUT /api/classes/{id}**
   - **Description:** Update class details.
   - **Request Payload:** Fields to update (name, description, scheduled_at, duration, max_seats)
   - **Response:** Updated class details

5. **DELETE /api/classes/{id}**
   - **Description:** Delete a class. Ensure proper authorization and handle cascading effects on registrations if needed.
   - **Response:** 204 No Content

---

### Class Registrations

1. **POST /api/classes/{classId}/registrations**
   - **Description:** Allow a user to register for a class.
   - **Request Payload:** (User ID can be inferred from the authenticated token)
     ```json
     { "user_id": "UUID" } 
     ```
   - **Business Logic:** Validate that the user has an active membership with an appropriate pricing plan and check that available seats exist.
   - **Response:** Registration details with status (default "pending")

2. **GET /api/users/{userId}/registrations**
   - **Description:** Retrieve the list of class registrations for the authenticated user (for profile view).
   - **Response:** Array of registration records with pagination

3. **PUT /api/registrations/{id}**
   - **Description:** Update registration status (e.g., confirm, cancel) if allowed by business rules.
   - **Request Payload:** Fields such as `status`
   - **Response:** Updated registration details

4. **DELETE /api/registrations/{id}**
   - **Description:** Cancel a registration. This should update availability accordingly.
   - **Response:** 204 No Content

---

### Analytics Logs

1. **POST /api/analytics**
   - **Description:** Record an analytical event. This endpoint might be for internal or admin use.
   - **Request Payload:**
     ```json
     {
       "club_id": "UUID",
       "event_type": "string",
       "event_data": {},
       "user_id": "UUID (optional)"
     }
     ```
   - **Response:** 201 Created with log details

2. **GET /api/analytics**
   - **Description:** Retrieve analytics logs filtered by club, date range, or event type (restricted to admin users).
   - **Query Parameters:** `clubId`, `startDate`, `endDate`, `event_type`
   - **Response:** Array of analytics log records

---

### Club Invitations

1. **POST /api/clubs/{clubId}/invitations**
   - **Description:** Create a new invitation to a club (accessible by club administrators).
   - **Request Payload:**
     ```json
     {
       "email": "string",
       "targetRole": "string (admin, trainer, member)"
     }
     ```
   - **Business Logic:** Generate a unique invitation token, validate the target email and role. Send invitation email with the token included in the link.
   - **Response:** Details of the created invitation

2. **GET /api/clubs/{clubId}/invitations**
   - **Description:** List all pending invitations for a specific club with pagination.
   - **Query Parameters:** `page`, `limit`, `status` (optional, default "pending")
   - **Response:** Array of invitation records with pagination info

3. **GET /api/invitations/{token}**
   - **Description:** Validate and retrieve details of a specific invitation by token.
   - **Response:** Invitation details including club name and target role

4. **POST /api/invitations/{token}/accept**
   - **Description:** Accept an invitation linking the current authenticated user to the club with the specified role.
   - **Business Logic:**
     - Verify the token is valid and not expired
     - Check that the authenticated user's email matches the invitation email
     - Create membership record with the specified role
     - Mark invitation as accepted
   - **Response:** Success message with membership details

5. **DELETE /api/invitations/{id}**
   - **Description:** Cancel or revoke an invitation (accessible by club administrators).
   - **Response:** 204 No Content

---

## 3. Authentication and Authorization

- **Authentication Mechanism:**
  - The API will use JWT-based authentication. Clients will send the token in the `Authorization` header as a Bearer token.
  
- **Authorization:**
  - Role-based access control (RBAC) will enforce access policies using both global and club-specific roles:
    - **Global Roles** (stored in `auth.users.global_role`):
      - **administrator:** Full access to all clubs and system-level operations.
      - **user:** Base access level for regular users.
    - **Club-Specific Roles** (stored in `memberships.membership_role`):
      - **admin:** Manage club-specific resources (memberships, classes, pricing plans).
      - **trainer:** Special access to training-related functions and assigned classes.
      - **member:** Regular club member with basic access to club features.
  
  - Access Control Implementation:
    - Row Level Security (RLS) policies in the database
    - Helper functions for role checking: `auth.user_role()`, `auth.is_admin()`, `auth.user_club_role(club_id)`, `auth.is_club_admin(club_id)`, `auth.is_club_member(club_id)`
    - Endpoint-specific middleware to check permissions for complex operations

- **Invitation System:**
  - Secure, token-based system for inviting users to clubs
  - Time-limited tokens with role specification
  - Email integration for sending invitations
  - Support for both new user registration and existing user acceptance

---

## 4. Validation and Business Logic

- **Request Validation:**
  - Every endpoint will validate the incoming JSON payload for required fields, proper data types, and valid UUIDs.
  - Use schema validation (with Zod) before processing.

- **Database Constraints Enforcement:**
  - Unique constraints (such as the `(user_id, club_id)` pair in memberships) are enforced at both the database level and during request validation.
  - Foreign key relationships are validated to ensure referential integrity (e.g., a pricing plan must belong to the same club as the user's membership).

- **Business Rules Implementation:**
  - Class registration requires the following checks:
    - The user has an active membership with the club.
    - The user has a valid, active pricing plan if required.
    - There are available seats (not exceeding `max_seats`).
    - Updates to class capacity and registration statuses are done within transactions to maintain consistency.

- **Soft Deletion:**
  - Resources such as clubs and pricing plans will use soft deletion (using the `deleted_at` field or status updates) rather than hard deletion.

- **Pagination, Filtering, and Sorting:**
  - List endpoints (e.g., for clubs, classes, memberships) will support pagination and filtering to manage large datasets and improve performance.

- **Security and Rate Limiting:**
  - Endpoints will include rate limiting to prevent abuse.
  - Sensitive operations (e.g., authentication, registration, club management) will have robust error handling and logging.

- **Invitation Processing:**
  - Club invitation tokens are UUID-based and have a limited validity period (default 7 days)
  - Invitations are tied to specific email addresses and can only be accepted by users with matching emails
  - Role assignment is predetermined at invitation time and enforced when accepting
  - Proper error handling for expired invitations, email mismatches, or users already in the club

*Assumptions & Notes:*

- Some decisions, such as the exact structure of JWT claims and invitation tokens, are assumed to be implemented based on the tech stack and may be refined during actual development.
- Endpoints for operations like email verification, password reset, or additional analytics may be added later based on additional requirements. 