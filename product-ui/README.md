# Product UI

Angular 18 app — standalone components, Nx, microfrontend-ready.

## Structure

```
src/app/
├── app.component.ts          # Shell: header nav + router-outlet
├── app.component.html
├── app.component.scss
├── app.config.ts             # provideHttpClient, provideRouter
├── app.routes.ts             # Lazy-loaded routes
├── components/
│   ├── dashboard/            # DashboardComponent
│   ├── engine-monitor/       # EngineMonitorComponent
│   ├── ai-console/           # AIConsoleComponent
│   ├── graph-viewer/         # GraphViewerComponent
│   └── optimization-viewer/  # OptimizationViewerComponent
├── services/
│   ├── engine-api.service.ts
│   ├── intelligence.service.ts
│   ├── ai.service.ts
│   ├── trust.service.ts
│   ├── optimization.service.ts
│   └── index.ts
├── pages/
│   └── home/                 # HomeComponent
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

## Run

From repo root (node_modules at root):

```bash
cd product-ui
npx ng serve
```

Or from workspace root with proxy to API:

```bash
npx nx run product-ui:serve
```

(Ensure Nx project.json defines a `serve` target if using Nx.)

## Deployment readiness (independent deploy)

The UI is **ready to deploy independently** as a static SPA with one requirement: the API base URL must be correct for your environment.

### What’s ready

- **Production build**: `npx ng build product-ui --configuration=production` outputs static files to `dist/product-ui/browser` (no server-side rendering).
- **Docker**: Use `product-ui/Dockerfile` or `deployment-shells/docker/product-ui.Dockerfile` from repo root. Image serves the built UI with nginx on port 80.
- **API URL**: All API calls use `environment.apiUrl` (default `/api`). Set in `src/environments/environment.prod.ts` for production builds.

### Deploy options

**Option A — UI and API on the same host (e.g. one domain)**  
- Keep `apiUrl: '/api'` in `environment.prod.ts`.  
- In front of the UI (nginx, gateway, or load balancer), proxy `/api` to your backend.  
- Example nginx addition (set `BACKEND_URL` to your API origin):

```nginx
location /api {
  proxy_pass $BACKEND_URL;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

**Option B — UI and API on different hosts (e.g. separate Railway apps)**  
- Set `apiUrl` in `environment.prod.ts` to the full API origin, e.g. `apiUrl: 'https://your-api.up.railway.app'`.  
- Ensure the API allows CORS from the UI origin.  
- Rebuild the UI so the new `apiUrl` is baked in.

### Build from repo root

The Dockerfile and Nx build expect the **monorepo root** (they need `angular.json`, `nx.json`, and workspace packages). To build the UI only:

```bash
# From repo root
npx ng build product-ui --configuration=production
```

The deployable artifact is `product-ui/dist/product-ui/browser/` (static files). You can serve it with any static host (nginx, S3 + CloudFront, Netlify, Vercel, etc.) as long as `/api` is either proxied (Option A) or `apiUrl` points to the API host (Option B).

### Deploy on Railway

To deploy the UI as a **separate Railway service** (same repo, different service from engine-api):

1. In your Railway project, add a **new service** from the same GitHub repo.
2. Set **Config File Path** to `deploy/railway/product-ui/railway.toml` (Settings → Config-as-code). Leave **Root directory** empty.
3. Set `apiUrl` in `product-ui/src/environments/environment.prod.ts` to your Engine API URL (e.g. `https://engine-api-xxxx.up.railway.app`), commit, and push.
4. Enable CORS on the Engine API for the Product UI domain. Generate a public domain for the UI service and open it in the browser.

Full steps and troubleshooting: **[deploy/railway/RAILWAY_PRODUCT_UI.md](../deploy/railway/RAILWAY_PRODUCT_UI.md)**.

---

## Microfrontend readiness

- Routes are lazy-loaded via `loadComponent()`.
- Shell is a single router-outlet; features can be split into remote entry modules later (e.g. Module Federation).
- API base URL is configurable via `environments/environment.ts` and `environment.prod.ts` (`apiUrl`).
