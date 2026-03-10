# Lost & Found — Central System (Frontend)

A **Lost and Found** web application that lets users report lost or found items, browse a feed, submit claims, and lets staff and admins manage claims, match items, generate QR tags, and run imports/exports and audits.

---

## Project goal

- **Users**: Report lost/found items, browse all items, claim found items with proof, and track their reports and claims.
- **Staff**: Process claim requests, match lost with found items, create/scan QR tags, and print item/claim documents.
- **Admins**: View system metrics, bulk-import/export data, and inspect activity logs. Admins can also use all staff and user features.

The app is **role-based**: after login, users are redirected to the right area (user feed, staff dashboard, or admin dashboard) and can only access pages allowed for their role.

---

## Tech stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (ES modules).
- **API**: REST API; base URL configurable via `config.js` / `window.APP_CONFIG.apiBaseUrl`.
- **Auth**: Bearer token (stored in `localStorage` or `sessionStorage`), with role stored in the user object.

---

## How to run / use the project

### 1. Backend

The frontend expects a backend API at the URL set in `config.js` (default: `https://backend.test/api`). Ensure your backend is running and CORS allows the frontend origin.

### 2. Serve the frontend

Serve the project over **HTTP** (not `file://`) so ES modules and absolute paths like `/core/auth.js` work.

**Option A — Local server (e.g. PHP):**
```bash
# From project root (Frontend/)
php -S localhost:8000
```
Then open: `http://localhost:8000`

**Option B — Node (e.g. `serve`):**
```bash
npx serve . -p 8000
```
Then open: `http://localhost:8000`

**Option C — Your existing setup:**  
If you already use something like Laravel Valet (`backend.test`) or a reverse proxy, point the document root to this `Frontend` folder so that `/` serves `index.html` and paths like `/pages/`, `/core/`, `/assets/` resolve correctly.

### 3. Configuration

- **API base URL**: Edit `config.js` or set `window.API_BASE_URL` before the app loads (e.g. in a script tag in `index.html`) so the app talks to your backend.
- Example: `window.APP_CONFIG = { apiBaseUrl: "https://backend.test/api" };`

### 4. First use

1. Open the app (e.g. `http://localhost:8000` or your configured URL).
2. You’ll be sent to **Login** if not authenticated.
3. **Register** a new account (or use existing credentials).
4. After login, you’re redirected by role:
   - **User** → Browse Items feed (`/pages/user/items.html`)
   - **Staff** → Staff dashboard (`/pages/staff/dashboard.html`)
   - **Admin** → Admin dashboard (`/pages/admin/dashboard.html`)

---


## Mobile app (new)

A lightweight mobile-first app is available at:

- `/mobile/index.html`

It supports:
- Login/logout
- Feed browsing with search/type/status filters
- Submit claim from feed
- View **My Claims**
- Review queue tab:
  - `user` role reviews claims for their own posted items (`/my/item-claims`)
  - `staff/admin` role reviews full claims queue (`/claims`)

Use the same backend API configuration as the web app (`window.APP_CONFIG.apiBaseUrl`).

---

## Project structure (overview)

| Path | Purpose |
|------|--------|
| `index.html` | Entry; redirects logged-in users by role, else sends to login |
| `config.js` | Sets `window.APP_CONFIG.apiBaseUrl` for the API |
| `core/` | Auth, API client, router, guards, storage, UI helpers |
| `pages/auth/` | Login, Register |
| `pages/user/` | User-facing: browse items, report, my reports, my claims, profile, item detail |
| `pages/staff/` | Staff: claims queue, match items, QR tools, print center |
| `pages/admin/` | Admin: dashboard, imports, exports, logs |
| `components/` | Navbar, sidebar, toast, modal, tables, etc. |
| `layouts/` | Shell layout (sidebar + topbar) for app pages |
| `assets/css/` | Tokens, components, app, website styles |

---

## Features by role

### User

| Feature | Page | Description |
|--------|------|-------------|
| **Browse Items** | `/pages/user/items.html` | Search/filter all lost and found items (type, status); open item details. |
| **Report Lost/Found** | `/pages/user/report.html` | Submit a new lost or found item (title, description, category, location, date, etc.). |
| **My Reports** | `/pages/user/my-items.html` | List and manage the current user’s reported items; filter by type/status. |
| **My Claims** | `/pages/user/my-claims.html` | List claim requests and their status (pending, approved, denied, released). |
| **Item detail & claim** | `/pages/user/item-show.html` | View one item; submit a claim with proof text and optional image. |
| **Dashboard** | `/pages/user/dashboard.html` | Landing with quick actions (report, browse) and summary cards. |
| **Profile** | `/pages/user/profile.html` | View and edit profile (e.g. name, email). |

Users cannot open staff or admin pages; they are redirected to the user area if they try.

---

### Staff

| Feature | Page | Description |
|--------|------|-------------|
| **Claims Queue** | `/pages/staff/claims.html` | Supervise claim requests, handle escalations, and complete **release** after verification; filter by status and search. |
| **Match Items** | `/pages/staff/match.html` | Reconcile likely duplicate reports (lost vs found posts) so staff can consolidate and prevent conflicting claim outcomes. |
| **QR Tools** | `/pages/staff/qr.html` | Generate QR codes for items by item number; scan/read QR (e.g. for inventory). |
| **Print Center** | `/pages/staff/prints.html` | Open/print item details by item ID and claim receipt/release by claim ID. |
| **Staff dashboard** | `/pages/staff/dashboard.html` | Staff home with links to the tools above. |

Staff cannot open admin-only pages; they are redirected to the staff area (e.g. claims) if they try.

> **Workflow note:** Claim approval/denial can be done by the item reporter (owner of the post) or staff/admin. Staff still handles physical handoff/release for auditability and fraud prevention.

---

### Admin

| Feature | Page | Description |
|--------|------|-------------|
| **Admin Dashboard** | `/pages/admin/dashboard.html` | Overview: pending items, pending claims, other KPIs; shortcuts to Logs, Exports, Claims. |
| **Imports** | `/pages/admin/imports.html` | Bulk-import items from CSV/XLSX; optional sample CSV template. |
| **Exports** | `/pages/admin/exports.html` | Download items (and optionally claims) as Excel or PDF; optional filters (type, status). |
| **Logs** | `/pages/admin/logs.html` | View activity logs; filter by action type, entity, and search (actor, entity_id, etc.). |

Admins can also use all **Staff** and **User** features (sidebar includes Admin + Staff + User links for admins).

---

## Auth and access control

- **Login**: `POST /auth/login` with `email` and `password`; response includes `token` and `user` (with `role`).
- **Register**: `POST /auth/register` with name, email, password, confirmation; then login.
- **Guards**:
  - `core/auth.js`: `guardPage()` restricts pages by role (admin → all; staff → no admin; user → only user pages).
  - `core/guards.js`: Helpers to show/hide or disable UI by role (`requireElementRole`, `disableIfRoleLacking`, `runIfRole`).
- **Redirect**: Root `index.html` uses `redirectByRole(user)` so logged-in users land on the correct dashboard/feed.

---

## API usage (from frontend)

- **core/api.js** sends `Authorization: Bearer <token>` on requests.
- On **401**, the app clears auth and redirects to login.
- Non-JSON responses (e.g. PDF/Excel downloads) are returned as `Response` for the caller to blob/download.

Typical endpoints (backend must implement):

- Auth: `POST /auth/login`, `POST /auth/register`
- Items: list (paginated/filtered), get one, create (report), update
- Claims: list, get one, create (with proof/optional image), approve/deny/release
- Matches: create (match lost + found)
- QR: generate for item
- Admin: stats, import (file upload), export (Excel/PDF), logs (paginated/filtered)

---

## Summary

| Role  | Main capabilities |
|-------|-------------------|
| **User**  | Browse items, report lost/found, my reports, my claims, claim an item with proof, profile, dashboard. |
| **Staff** | Claims queue (approve/deny/release), match lost/found items, QR create/scan, print item/claim documents. |
| **Admin** | Dashboard KPIs, imports (CSV/XLSX), exports (Excel/PDF), activity logs; plus all staff and user features. |

For deployment, point the document root to this folder, set `apiBaseUrl` in `config.js` (or via `window.API_BASE_URL`) to your backend, and ensure the backend is running and CORS is configured for your frontend origin.
