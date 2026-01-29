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

## Microfrontend readiness

- Routes are lazy-loaded via `loadComponent()`.
- Shell is a single router-outlet; features can be split into remote entry modules later (e.g. Module Federation).
- API base URL is configurable via `environments/environment.ts` (`apiUrl`).
