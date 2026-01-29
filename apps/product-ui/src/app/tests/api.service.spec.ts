import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { EngineApiService } from '../services/engine-api.service';

describe('EngineApiService (api.service)', () => {
  let service: EngineApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EngineApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(EngineApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getStatus() should GET /api/Engine and return status', () => {
    const mock = { status: 'ok', result: { engines: [] } };
    service.getStatus().subscribe((res) => {
      expect(res).toEqual(mock);
      expect(res.status).toBe('ok');
    });
    const req = httpMock.expectOne((r) => r.url.includes('/api/Engine') && r.method === 'GET');
    req.flush(mock);
  });

  it('execute() should POST /api/Engine/execute with body and return result', () => {
    const body = { action: 'push', parameters: { source: 'test' } };
    const mock = { status: 'ok', result: { pushed: true } };
    service.execute(body).subscribe((res) => {
      expect(res).toEqual(mock);
      expect(res.status).toBe('ok');
      expect((res as { result?: { pushed?: boolean } }).result?.pushed).toBe(true);
    });
    const req = httpMock.expectOne((r) =>
      r.url.includes('/api/Engine/execute') && r.method === 'POST'
    );
    expect(req.request.body).toEqual(body);
    req.flush(mock);
  });
});
