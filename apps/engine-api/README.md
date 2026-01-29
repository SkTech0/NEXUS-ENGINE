# Engine API

.NET 10 Web API — gateway and engine endpoints.

## Structure

```
src/EngineApi/
├── Controllers/
│   ├── HealthController.cs
│   ├── EngineController.cs       GET /api/Engine, POST /api/Engine/execute
│   ├── IntelligenceController.cs POST /api/Intelligence/evaluate, GET /api/Intelligence/health
│   ├── OptimizationController.cs POST /api/Optimization/optimize, GET /api/Optimization/health
│   ├── AIController.cs           POST /api/AI/infer, GET /api/AI/models, GET /api/AI/health
│   └── TrustController.cs        POST /api/Trust/verify, GET /api/Trust/score/{id}, GET /api/Trust/health
├── Services/
│   ├── IEngineService, EngineService
│   ├── IIntelligenceService, IntelligenceService
│   ├── IOptimizationService, OptimizationService
│   ├── IAIService, AIService
│   └── ITrustService, TrustService
├── Models/
│   ├── EngineRequest.cs
│   └── EngineResponse.cs
├── DTOs/
│   ├── EngineRequestDto.cs, EngineResponseDto
│   ├── IntelligenceRequestDto.cs, IntelligenceResponseDto
│   ├── OptimizationRequestDto.cs, OptimizationResponseDto
│   ├── AIInferenceRequestDto.cs, AIInferenceResponseDto, AIModelsResponseDto
│   └── TrustVerifyRequestDto.cs, TrustVerifyResponseDto, TrustScoreResponseDto
├── Middleware/
│   └── ApiGateway.cs             ApiGatewayMiddleware, UseApiGateway()
├── Repositories/
│   ├── IEngineRepository.cs
│   └── EngineRepository.cs
├── Program.cs
└── EngineApi.csproj
```

## Run locally (with Swagger)

From repo root or from `engine-api`:

```bash
cd engine-api
dotnet restore
dotnet run --project src/EngineApi/EngineApi.csproj
```

- **Swagger UI:** https://localhost:5001/swagger or http://localhost:5000/swagger  
- **Health:** GET http://localhost:5000/api/Health (HTTP redirects to HTTPS)

## Test API

With the API running, in another terminal:

```bash
# Health (use -L to follow HTTPS redirect)
curl -s -L http://localhost:5000/api/Health

# Over HTTPS (-k to allow self-signed dev cert)
curl -s -k https://localhost:5001/api/Health

# Engine status
curl -s -L http://localhost:5000/api/Engine

# Swagger UI in browser
open https://localhost:5001/swagger
```

## Run via Docker

From repo root:

```bash
docker-compose up -d
```

- **Swagger UI:** http://localhost:10021/swagger  
- **Health:** GET http://localhost:10021/api/Health  

Rebuild the image if you changed code: `docker-compose up -d --build engine-api`
