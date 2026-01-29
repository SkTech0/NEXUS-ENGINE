import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { routes } from '../app.routes';

describe('DashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the dashboard', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('should render Dashboard header', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('.dashboard__header h2');
    expect(header?.textContent?.trim()).toBe('Dashboard');
  });

  it('should render Nexus Engine overview subtitle', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const sub = compiled.querySelector('.dashboard__subtitle');
    expect(sub?.textContent?.trim()).toContain('Nexus Engine overview');
  });

  it('should have dashboard cards for Engine, Intelligence, AI, Trust', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.dashboard__cards .card h3');
    const titles = Array.from(cards).map((el) => el.textContent?.trim());
    expect(titles).toContain('Engine');
    expect(titles).toContain('Intelligence');
    expect(titles).toContain('AI');
    expect(titles).toContain('Trust');
  });

  it('should have nav links to engine, ai-console, graph, optimization', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.dashboard__nav a[routerLink]');
    const hrefs = Array.from(links).map((a) => (a as HTMLAnchorElement).getAttribute('routerLink'));
    expect(hrefs).toContain('/engine');
    expect(hrefs).toContain('/ai-console');
    expect(hrefs).toContain('/graph');
    expect(hrefs).toContain('/optimization');
  });
});
