# Engine-api — independent deployment (existing app; no code change).
# Build from repo root: docker build -f deploy/docker/engine-api.Dockerfile .
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY apps/engine-api/src/EngineApi/EngineApi.csproj EngineApi/
RUN dotnet restore EngineApi/EngineApi.csproj
COPY apps/engine-api/src/EngineApi EngineApi/
WORKDIR /src/EngineApi
RUN dotnet build EngineApi.csproj -c Release -o /app/build

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/build .
ENV ASPNETCORE_URLS=http://0.0.0.0:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "EngineApi.dll"]
