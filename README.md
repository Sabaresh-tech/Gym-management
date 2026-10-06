# IronGrid — Gym Management Dashboard

A responsive, interactive gym management UI built with React, Tailwind CSS,
React Router, Recharts and lucide-react. All data is mocked in
`src/data/mockData.js`, shaped to mirror the tables you'd have in Supabase
(members, membership_plans, trainers, attendance, payments, classes,
equipment, notifications) so swapping in real queries later is a drop-in
change, not a rewrite.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production
bundle in `dist/`.

## Logging in

The app opens on the public landing page (`/`). Click **Login** in the
navbar to open the login drawer, or go straight to `/login`. There's no
real backend behind auth yet, so three demo accounts are baked into
`src/data/users.js` — one per role. Use the "Quick demo access" cards on the
login screen (or the hint in the login drawer), or sign in manually:

| Role        | Email                    | Password       | Lands on                        |
|-------------|---------------------------|----------------|----------------------------------|
| Owner       | owner@irongrid.gym        | owner123       | Full dashboard (`/dashboard`)   |
| Front Desk  | frontdesk@irongrid.gym    | frontdesk123   | Operational dashboard (`/dashboard`, subset) |
| Member      | aarav.mehta@mail.com      | member123      | Member portal (`/portal`)       |

`AuthContext.jsx` holds the session (in `sessionStorage`, cleared on tab
close) and exposes `login`, `loginAsRole`, `logout`. Swap `login()` for a
real `supabase.auth.signInWithPassword()` call when you wire up a backend —
the return shape (`{ ok, user }` / `{ ok, error }`) is already what you'd
get back from Supabase, and `role` / `member_id` would just come from a
`profiles` table instead of the demo array.

## React Hooks used in this project

- **`useState`** — local component state throughout (forms, filters, modal open/close, etc.)
- **`useEffect`** — `src/context/AuthContext.jsx` syncs the logged-in user to `sessionStorage` on every change; `src/hooks/useDebounce.js` uses `useEffect`'s cleanup function to cancel a stale timer on every keystroke.
- **`useContext`** — `AuthContext` and `ToastContext` are each wrapped once at the root and consumed anywhere via `useAuth()` / `useToast()`, with no prop drilling.
- **Custom hooks** — `useAuth()` and `useToast()` (in `src/context/`), plus two new ones in `src/hooks/`:
  - `useLocalStorage(key, initialValue)` — a generic `useState` + `useEffect` combo that persists any piece of state to `localStorage` automatically. Used on the Members page to remember the status/plan filters across reloads.
  - `useDebounce(value, delay)` — delays updating a value until the user stops typing, demonstrating `useEffect`'s cleanup behaviour. Used to debounce the Members search box.

## Role-based UI

- **Owner** — sees every page: Dashboard, Members, Memberships, Trainers,
  Attendance, Payments, Classes, Equipment, Reports, Notifications,
  Settings.
- **Front desk** — the same shell, but the sidebar (`Sidebar.jsx`) and
  routes (`App.jsx`) hide Trainers, Equipment, Reports and Settings —
  day-to-day operational pages only. Front desk staff who try to hit an
  owner-only URL directly get bounced back to `/`.
- **Member** — a completely separate portal at `/portal/*`, its own shell
  (`MemberShell.jsx` + `MemberSidebar.jsx`), and its own pages under
  `src/pages/member/`: a personal dashboard, membership + upgrade browsing,
  class booking, payment history, visit history, and profile/notification
  preferences. It reads the same `mockData.js`, just filtered down to the
  signed-in member (`user.memberId`).

`ProtectedRoute.jsx` guards all of this: no session → redirect to
`/login`; wrong role for a route → redirect to that role's home page
(`/dashboard` or `/portal`).

## Public site, login drawer & logout flow

- `/` is the public marketing site (`src/pages/Landing.jsx`): navbar, hero,
  about, membership plans (pulled live from `MEMBERSHIP_PLANS` in
  `mockData.js`), training, classes, nutrition, why-choose-us, community,
  blog, location and contact sections, plus a footer. All in
  `src/components/public/`.
- **Login** opens `LoginDrawer.jsx` — a right-side panel over the landing
  page. It calls the *same* `useAuth().login()` used by `pages/Login.jsx`;
  there's only one auth implementation. On success it routes to
  `/dashboard` (owner/front desk) or `/portal` (member).
- `/login` still works directly as a fallback/full-page login.
- **Logout** (from the sidebar or navbar profile menu, in either shell)
  clears the session and routes to `/logged-out` — a confirmation screen
  with **Home** (→ `/`, the public landing page) and **Login Again**
  (→ `/login`) buttons.
- Each authenticated shell also has a **Home** button (sidebar, and the
  navbar profile menu) that goes to `/` *without* logging out, so a signed-in
  user can browse the public site and come straight back to their dashboard.
- Any unmatched route falls back to the landing page for guests, or the
  correct dashboard for signed-in users (`NotFoundRedirect` in `App.jsx`).

## Experiment No. 4 — REST API Design with MongoDB + Mongoose

A standalone Express + MongoDB/Mongoose REST API lives in `backend/`,
separate from the Vite frontend above. It's for the "REST API Design with
MongoDB + Mongoose Integration" practical and isn't required for the
frontend to run — the dashboard pages still use `mockData.js` untouched.

```
backend/
  server.js              Express app: CORS, JSON body parsing, routes,
                          health check, centralized error handling
  config/db.js            Mongoose connection (reads MONGO_URI, fails
                          loudly — non-zero exit — if it can't connect)
  models/                 Member, Membership, Trainer, Attendance —
                          Mongoose schemas with required fields, enums,
                          email validation, unique indexes
  controllers/             CRUD logic per entity (async/await, no DB code
                          in server.js or routes)
  routes/                  One Express router per entity, mounted at
                          /api/members, /api/memberships, /api/trainers,
                          /api/attendance
  middleware/              asyncHandler (removes repetitive try/catch),
                          errorMiddleware (404 handler + centralized error
                          handler that turns Mongoose validation/duplicate-
                          key/cast errors into readable JSON)
  seed.js                  Populates demo Members/Memberships/Trainers/
                          Attendance for the practical
  postman_collection.json  Import into Postman — Health, Members,
                          Memberships, Trainers, Attendance folders with
                          GET/POST/PUT/DELETE requests pre-filled
  .env.example             Copy to .env and fill in MONGO_URI
```

### Running it

```bash
cd backend
npm install
cp .env.example .env        # set MONGO_URI (local mongod or Atlas)
npm run dev                 # nodemon, or `npm start` for plain node
```

You should see:

```
[MongoDB] Connected: <host>/gym_management
[Server] Gym Management API listening on http://localhost:5000
[Server] Health check: http://localhost:5000/api/health
```

If MongoDB isn't reachable, the process prints a clear connection error and
exits — it will not start "successfully" against a broken database.

Optionally seed demo data: `npm run seed`.

### Endpoints

Every entity (`members`, `memberships`, `trainers`, `attendance`) exposes
the same five routes, e.g. for Members:

| Method | Path                 | Action              |
|--------|----------------------|----------------------|
| GET    | `/api/members`       | List all members     |
| GET    | `/api/members/:id`   | Get one member        |
| POST   | `/api/members`       | Create a member       |
| PUT    | `/api/members/:id`   | Update a member       |
| DELETE | `/api/members/:id`   | Delete a member       |

Plus `GET /api/health`. Responses are always
`{ success, data }` / `{ success, message, data }` / `{ success, message }`,
with 200/201/400/404/500 status codes as appropriate.

### Demonstrating it

1. Start MongoDB (local `mongod`, or point `MONGO_URI` at Atlas).
2. `cd backend && npm run dev`.
3. Open Postman, import `backend/postman_collection.json`
   (`baseUrl` defaults to `http://localhost:5000`).
4. Run **Health Check**, then **Members → Get All Members** (empty array
   at first, or seeded data if you ran `npm run seed`).
5. Run **Create Member**, copy the returned `_id` into the `memberId`
   collection variable, then run **Update Member** and **Delete Member** to
   show the full CRUD cycle. Repeat for Memberships/Trainers/Attendance.
6. Check your MongoDB collections (Compass or `mongosh`) to show the data
   landing in `gym_management.members`, etc. — demonstrating
   Frontend → REST API → Express → Mongoose → MongoDB end to end.

### Optional frontend wiring

`src/services/api.js` is a small fetch client for these endpoints
(`membersApi`, `membershipsApi`, `trainersApi`, `attendanceApi`,
`healthApi`), reading its base URL from `VITE_API_URL` (see
`.env.example` at the project root). It's not wired into the existing
Members/Memberships/Trainers/Attendance pages by default — those keep
working exactly as before on `mockData.js` — but it's ready to import into
any page's `handleSave`/`handleDelete` when you want to point that page at
the real API instead of local state.

## Experiment No. 5 — Create secure, production-ready RESTful APIs

Builds directly on Experiment 4's backend (same `server.js`, same models —
nothing duplicated) by adding a hardening layer:

```
backend/
  middleware/security.js    helmet (secure headers), express-rate-limit
                             (429 after too many requests/IP), express-
                             mongo-sanitize (strips $/. injection keys from
                             body/params/query), hpp (blocks HTTP parameter
                             pollution)
  middleware/validate.js    Runs express-validator's collected errors and
                             returns a clean 400 with a field-by-field list
                             — requests are rejected before they ever reach
                             Mongoose or MongoDB.
  validators/                One file per entity (member, membership,
                             trainer, attendance) with a createXValidator,
                             updateXValidator and idParamValidator — mirrors
                             the Mongoose schema rules from Experiment 4 as
                             an app-level validation layer (defense in
                             depth), plus rejects malformed :id params
                             before they can throw a raw Mongoose CastError.
```

`server.js` also adds `compression` (gzip), `morgan` request logging
(verbose in development, combined/quiet in production via `NODE_ENV`), a
10kb JSON body-size cap, and `app.set("trust proxy", 1)` so rate limiting
sees the real client IP behind a reverse proxy. The centralized error
handler (`middleware/errorMiddleware.js`) now also catches malformed JSON
request bodies and returns 400 instead of a raw parser error.

New env vars (see `backend/.env.example`): `NODE_ENV`,
`RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`.

### Demonstrating it

The Postman collection has a new **"Experiment 5 — Security & Validation
Demo"** folder:

1. **Rejected — Missing Required Fields** → 400 with a field-by-field error
   list, before any database call.
2. **Rejected — Invalid Email Format** → 400.
3. **Rejected — Invalid Mongo ObjectId in URL** → 400 with a readable
   message instead of a raw Mongoose stack trace.
4. **Sanitized — NoSQL Injection Attempt** → the `$gt` operator key is
   stripped before reaching Mongoose; watch the backend terminal for the
   `[security] Sanitized a potentially malicious key` log line.
5. **Rate Limit Headers** → inspect `RateLimit-Limit` /
   `RateLimit-Remaining` on any response; send enough requests (or lower
   `RATE_LIMIT_MAX` in `.env`) to see a 429.

Also open the response headers on any request in Postman and show that
`X-Powered-By` is gone and security headers like
`Strict-Transport-Security` / `X-Content-Type-Options` are present —
that's helmet.

## Experiment 7 — Validating RESTful APIs using Postman

### Aim
To test and validate the behavior, functionality, and security of the RESTful APIs using Postman and Newman.

### Objective
Demonstrate API requests for all required CRUD operations across multiple entities (Users, Members, Memberships, Trainers, Attendance) while validating appropriate HTTP status codes, correct JSON data formats, database integrity, robust validation error handling, and robust JWT-based authentication and authorization.

### Tools Used
- Postman (for manual and automated API validation and test assertions)
- Newman (optional, for CLI execution)
- Express & Node.js backend
- MongoDB (via Mongoose)

### API Base URL
`http://localhost:5000`

### Authentication Method
JSON Web Tokens (JWT). A `POST /api/users/login` request generates a token. Test scripts extract this token into an environment variable (`adminToken` or `staffToken`), which is then automatically provided as a `Bearer` token in the `Authorization` header for protected routes.

### Postman Setup
The API testing suite consists of a Postman Collection and Environment:
- **Collection:** `backend/postman_collection_exp7.json`
- **Environment:** `backend/postman_environment_exp7.json`

### Environment Variables
The environment JSON stores contextual information automatically updated via Postman scripts:
- `baseUrl`: Base API URL
- `token`, `adminToken`, `staffToken`: JWT authentication tokens
- `userId`, `memberId`, `membershipId`, `trainerId`, `attendanceId`: Auto-extracted MongoDB ObjectIds for sequentially executing the test suite without manual copying.

### How to Start the Backend
```bash
cd backend
npm install
npm run dev
```
Make sure your MongoDB instance is running and the `.env` file contains the correct `MONGO_URI`.

### How to Import Postman files
1. Open Postman.
2. Click "Import" in the top left.
3. Select `backend/postman_collection_exp7.json` and `backend/postman_environment_exp7.json`.
4. Select the imported environment ("Gym Management API - Exp 7") from the environment dropdown in the top right.

### How to Run Tests
**Manually:**
Run the requests sequentially inside the imported collection, starting from "Health Check", then "Authentication", etc.

**Automatically:**
Using the Postman Collection Runner, or via Newman if installed (`npm install -g newman`):
```bash
newman run backend/postman_collection_exp7.json -e backend/postman_environment_exp7.json
```

### Expected Status Codes
- `200 OK`: Successful GET, PUT, DELETE, and Login.
- `201 Created`: Successful POST (creation).
- `400 Bad Request`: Validation errors, invalid MongoDB ObjectIds, invalid email formats.
- `401 Unauthorized`: Missing or invalid JWT token.
- `403 Forbidden`: Authenticated user lacking role permissions (e.g., Staff accessing Admin endpoints).
- `404 Not Found`: Resource not found.

### Positive Testing
- Tests basic reachability via `GET /api/health`.
- Validates successful creation, retrieval, updating, and deletion (CRUD) across models.
- Uses Postman Test Scripts (`pm.test()`) to assert valid HTTP Status codes, accurate JSON shapes, and the presence of `success: true`.

### Negative Testing
- Submits malformed POST request bodies (missing required fields).
- Submits syntactically invalid parameters (e.g., bad email).
- Accesses endpoints using non-existent but valid ObjectIds (`404`).
- Accesses endpoints using invalid ObjectIds (`400`).
- Validates the robust error JSON structure, ensuring the API does not crash.

### Authentication Testing
- Register and Login endpoints validate credential processing.
- `GET /api/users/me` validates token extraction and parsing.
- Accessing protected endpoints without a token yields a `401 Unauthorized`.
- Accessing protected endpoints with an invalid token yields a `401 Unauthorized`.

### Authorization Testing
- Endpoints strictly enforce Role-Based Access Control (RBAC).
- An admin account receives `200` or `201` status on admin-only routes.
- A staff account receives a `403 Forbidden` status when attempting to execute operations restricted to admins.

### Expected Results
The backend must run without syntax errors and establish a successful database connection. When executing the full Postman collection, all test assertions should pass, demonstrating correct API implementation matching the theoretical RESTful constraints and robust security mechanisms.

### Conclusion
Experiment 7 successfully validates the functional, structural, and security integrity of the backend RESTful API.

## Structure

```
src/
  components/     Sidebar, Navbar, AppShell        — owner/front desk shell
                  MemberSidebar, MemberShell        — member portal shell
                  ProtectedRoute                     — auth/role route guard
                  DataTable, Cards, Badge, Button, FormControls,
                  Overlay (Modal/Confirm/Empty/Skeleton)
                  public/         PublicNavbar, HeroSection, AboutSection,
                                  MembershipSection, TrainingSection,
                                  ClassesSection, NutritionSection,
                                  WhyChooseUs, CommunitySection, BlogSection,
                                  LocationSection, ContactSection,
                                  PublicFooter, LoginDrawer, FallbackImage
  context/        AuthContext — session, login/logout, role
                  ToastContext — global toast notifications
  data/           mockData.js — all seed data, Supabase-shaped
                  users.js — demo accounts per role
                  publicContent.js — static/editable public-site copy
  pages/          Dashboard, Members, Memberships, Trainers, Attendance,
                  Payments, Classes, Equipment, Reports, Notifications,
                  Settings, Login, Landing, LoggedOut
  pages/member/   MemberDashboard, MyMembership, BookClasses, MyPayments,
                  MyAttendance, MyProfile
  services/       api.js — optional fetch client for the Experiment 4
                  backend (see below), unused by the mock-data pages
  App.jsx         Route table (public site, login, staff routes, member
                  routes, logged-out screen)

backend/          Experiment No. 4 — see below
```

Every page is self-contained and pulls from `mockData.js`. Components never
reach into that file directly for anything except initial state, so you can
replace the `useState(INITIAL_X)` calls with a `useEffect` + Supabase client
call (or React Query / SWR) without touching component internals.

## Wiring up Supabase

1. `npm install @supabase/supabase-js`
2. Create `src/lib/supabaseClient.js` exporting a configured client.
3. In each page, replace the mock-data `useState` initializer with a fetch
   in `useEffect`, matching the same shape already used in `mockData.js`
   (e.g. `members` table → `id, name, email, phone, plan, status, joined,
   expiry, payment_status`).
4. The Add/Edit/Delete handlers in each page (`handleSave`, `handleDelete`,
   etc.) are already isolated — point them at `supabase.from(...).insert()`,
   `.update()`, `.delete()` instead of `setState`.

## Design notes

Dark, high-contrast "performance dashboard" identity — charcoal base
(`#0D0D0D`), volt-lime accent (`#D7FF3B`) for primary actions and positive
states, warm orange-red (`#FF5A36`) for alerts/overdue states. Display type
is Bebas Neue, data/numerals use Space Mono with tabular figures, body text
is Inter. Fully responsive: sidebar collapses to a mobile drawer, tables
scroll horizontally on narrow screens, stat/card grids stack down to a
single column.

## Experiment No. 8 — Enable real-time communication via WebSockets

A new **Live Community Chat** feature has been added using **Socket.IO** to demonstrate real-time bidirectional communication.
- **Backend:** `socket.io` is integrated into `backend/server.js`. It listens on the same port as the Express server, handling connections and broadcasting messages to all clients.
- **Frontend:** A new `LiveChat.jsx` component connects via `socket.io-client`. It floats on the bottom-right of the screen for logged-in users (both Admin and Members) and updates the UI instantly when a message is received, without requiring a page reload.

See `backend/EXP8_DOCUMENTATION.md` for full details.
