FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore engine-api/src/EngineApi/EngineApi.csproj && \
    dotnet publish engine-api/src/EngineApi/EngineApi.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
# Railway injects PORT at runtime (default 8080); listen on 0.0.0.0 for external traffic
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080
ENTRYPOINT ["/bin/sh", "-c", "export ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080} && exec dotnet EngineApi.dll"]
