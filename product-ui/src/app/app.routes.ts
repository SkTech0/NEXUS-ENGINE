import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./demo/landing/landing.component').then((m) => m.LandingComponent) },
  {
    path: 'playground',
    loadComponent: () => import('./demo/playground/playground.component').then((m) => m.PlaygroundComponent),
  },
  {
    path: 'evaluate',
    loadComponent: () => import('./demo/evaluate/evaluate.component').then((m) => m.EvaluateComponent),
  },
  {
    path: 'decision',
    loadComponent: () => import('./demo/decision/decision.component').then((m) => m.DecisionComponent),
  },
  {
    path: 'trust',
    loadComponent: () => import('./demo/trust/trust.component').then((m) => m.TrustComponent),
  },
  {
    path: 'history',
    loadComponent: () => import('./demo/history/history.component').then((m) => m.HistoryComponent),
  },
  {
    path: 'loan',
    loadComponent: () => import('./demo/loan/landing/loan-landing.component').then((m) => m.LoanLandingComponent),
  },
  {
    path: 'loan/apply',
    loadComponent: () => import('./demo/loan/application/loan-application.component').then((m) => m.LoanApplicationComponent),
  },
  {
    path: 'loan/evaluate',
    loadComponent: () => import('./demo/loan/evaluate/loan-evaluate.component').then((m) => m.LoanEvaluateComponent),
  },
  {
    path: 'loan/decision',
    loadComponent: () => import('./demo/loan/decision/loan-decision.component').then((m) => m.LoanDecisionComponent),
  },
  {
    path: 'loan/risk',
    loadComponent: () => import('./demo/loan/risk/loan-risk.component').then((m) => m.LoanRiskComponent),
  },
  {
    path: 'loan/history',
    loadComponent: () => import('./demo/loan/history/loan-history.component').then((m) => m.LoanHistoryComponent),
  },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent) },
  {
    path: 'tenants',
    loadComponent: () => import('./pages/tenants/tenants.component').then((m) => m.TenantsComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'engine',
    loadComponent: () => import('./components/engine-monitor/engine-monitor.component').then((m) => m.EngineMonitorComponent),
  },
  {
    path: 'ai-console',
    loadComponent: () => import('./components/ai-console/ai-console.component').then((m) => m.AIConsoleComponent),
  },
  {
    path: 'graph',
    loadComponent: () => import('./components/graph-viewer/graph-viewer.component').then((m) => m.GraphViewerComponent),
  },
  {
    path: 'optimization',
    loadComponent: () => import('./components/optimization-viewer/optimization-viewer.component').then((m) => m.OptimizationViewerComponent),
  },
  { path: '**', redirectTo: '' },
];
