# Plan: Connect Profile Page to Database

## Top-Level Overview

The goal is to connect the `TeacherProfile` page to the real database so that a logged-in teacher sees their actual data (name, email, phone, department, biography) and can update it.

The user data lives in two tables:
- **`usuarios`** → `id`, `email`, `nombre`, `apellido` (read-only fields in profile)
- **`info_usuarios` table** → `id`, `id_usuario`, `telefono`, `departamento`, `biografia` (optional, editable — already exists in DB)

The backend uses **Sequelize + PostgreSQL**. The frontend uses **Axios** via `frontend/src/services/api.ts` and stores the current user in `localStorage` via `authService`. The JWT token is automatically attached to every request by the axios interceptor.

**Scope:**
1. Create the `UserProfile` Sequelize model for `info_usuarios`
2. Create a `profileController` with GET and PUT endpoints
3. Register a `/profile` route secured with `authenticateToken`
4. Add a `profileService` in the frontend
5. Rewrite `Profile.tsx` to load real data and save via API

---

## Sub-Tasks

---

### Sub-Task 1 — Backend: Create the UserProfile Sequelize Model

**Intent**  
Define a Sequelize model that maps to the existing `info_usuarios` table so the ORM can query and update it.

**Expected Outcomes**  
- File `backend/src/models/UserProfile.js` exists
- Model has fields: `id`, `id_usuario`, `telefono`, `departamento`, `biografia`
- `telefono`, `departamento`, `biografia` are nullable (optional)
- `User` association is declared (`belongsTo` User through `id_usuario`)
- No timestamps (table was created manually, already exists)

**Todo List**
1. Create `backend/src/models/UserProfile.js` using the same Sequelize pattern as `backend/src/models/User.js`
2. Define fields: `id` (PK, autoIncrement), `id_usuario` (INTEGER, FK to `usuarios`), `telefono` (TEXT, nullable), `departamento` (TEXT, nullable), `biografia` (TEXT, nullable)
3. Set `tableName: 'info_usuarios'`, `timestamps: false`
4. Declare `UserProfile.belongsTo(User, { foreignKey: 'id_usuario' })`

**Relevant Context**
- `backend/src/models/User.js` — pattern to follow
- `backend/src/models/index.js` — currently empty, not required to change

**Status:** [ ] pending

---

### Sub-Task 2 — Backend: Create the Profile Controller

**Intent**  
Expose two endpoints for the profile: one to GET the current user's profile data (merged from `usuarios` + `info_usuarios`) and one to PUT/update the editable profile fields (`telefono`, `departamento`, `biografia`).

**Expected Outcomes**  
- `GET /api/profile` returns `{ id, email, nombre, apellido, telefono, departamento, biografia }` for the authenticated user
- If no row exists in `info_usuarios` yet, the GET returns the user row with null optional fields (does NOT 404)
- `PUT /api/profile` upserts the `info_usuarios` row (creates if not exists, updates if exists) for the authenticated user
- Neither endpoint modifies `nombre`, `apellido`, or `email` — those come from `usuarios` and are permanently display-only

**Todo List**
1. Create `backend/src/controllers/profileController.js`
2. Implement `getProfile(req, res)`:
   - Uses `req.user.id` (set by `authenticateToken` middleware)
   - Fetches user from `usuarios` (only `id`, `email`, `nombre`, `apellido`)
   - Fetches from `info_usuarios` where `id_usuario = req.user.id`
   - Returns merged object; if no profile row, optional fields are `null`
3. Implement `updateProfile(req, res)`:
   - Accepts `{ telefono, departamento, biografia }` from request body
   - Uses `findOrCreate` or `upsert` on `UserProfile` for the authenticated user's `id_usuario`
   - Returns updated profile data

**Relevant Context**
- `backend/src/controllers/classController.js` — pattern for controller structure
- `backend/src/middleware/auth.middleware.js` — `req.user` contains `{ id, email, rol }`
- `backend/src/models/User.js` and new `UserProfile.js`

**Status:** [ ] pending

---

### Sub-Task 3 — Backend: Register the Profile Route

**Intent**  
Wire the profile controller into the Express router so that `GET /api/profile` and `PUT /api/profile` are accessible, protected by JWT authentication.

**Expected Outcomes**  
- Both endpoints are reachable
- Both require a valid Bearer token (use `authenticateToken`)

**Todo List**
1. Create `backend/src/routes/profile.routes.js` with GET and PUT for `/`
2. Apply `authenticateToken` middleware on both routes
3. In `backend/src/routes/index.js`, import `profile.routes.js` and mount at `/profile`

**Relevant Context**
- `backend/src/routes/class.routes.js` — pattern to follow
- `backend/src/routes/index.js` — where to register the route

**Status:** [ ] pending

---

### Sub-Task 4 — Frontend: Add profileService to api.ts

**Intent**  
Add a `profileService` object to the existing `frontend/src/services/api.ts` following the same pattern as `classService`. This keeps all API calls in one place.

**Expected Outcomes**  
- `profileService.getProfile()` calls `GET /profile`
- `profileService.updateProfile(data)` calls `PUT /profile` with `{ telefono, departamento, biografia }`

**Todo List**
1. Open `frontend/src/services/api.ts`
2. Add `profileService` export after `classService` with `getProfile()` and `updateProfile(data)` methods
3. Add TypeScript interface for the profile response shape

**Relevant Context**
- `frontend/src/services/api.ts` lines 39–80 — `classService` pattern

**Status:** [ ] pending

---

### Sub-Task 5 — Frontend: Rewrite Profile.tsx to use real data

**Intent**  
Replace the hardcoded mock data and localStorage-only save in `Profile.tsx` with real API calls. On mount, load the user's data from the backend. On save, send changes to the backend.

**Expected Outcomes**  
- On page load, `nombre + apellido` and `email` are read from `authService.getCurrentUser()` (already in localStorage from login)
- `telefono`, `departamento`, `biografia` are fetched from `GET /api/profile`
- Email and name are displayed but NOT editable (read-only)
- `telefono`, `departamento`, `biografia` are editable and saved via `PUT /api/profile`
- A loading state is shown while the profile is being fetched
- Error state is handled gracefully (show a message, don't crash)
- The `localStorage.setItem('teacherProfile', ...)` call is removed

**Todo List**
1. Add `useEffect` to fetch profile on mount using `profileService.getProfile()`
2. Populate `nombre`, `apellido`, `email` from `authService.getCurrentUser()` synchronously (no extra request needed)
3. Populate `telefono`, `departamento`, `biografia` from API response
4. Add `isLoading` state; show a loading indicator while fetching
5. Update `handleSave` to call `profileService.updateProfile(...)` instead of localStorage
6. Make `nombre`, `apellido`, `email` fields read-only even in edit mode (remove their inputs, show only text)
7. Update the `UserProfile` interface to split fields: read-only (`nombre`, `apellido`, `email`) vs editable (`telefono`, `departamento`, `biografia`)
8. Remove the `alert()` call and replace with an inline success/error message

**Relevant Context**
- `frontend/src/pages/teacher/Profile.tsx` — current file to modify
- `frontend/src/services/authService.ts` — `getCurrentUser()` returns `{ id, email, nombre, apellido, rol }`
- `frontend/src/pages/teacher/Clases.tsx` — example of useEffect + API call pattern with error handling

**Status:** [ ] pending
