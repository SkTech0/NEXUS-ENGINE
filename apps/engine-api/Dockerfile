FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["src/EngineApi/EngineApi.csproj", "EngineApi/"]
RUN dotnet restore "EngineApi/EngineApi.csproj"
COPY src/EngineApi EngineApi/
WORKDIR /src/EngineApi
RUN dotnet build "EngineApi.csproj" -c Release -o /app/build

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/build .
EXPOSE 80
ENTRYPOINT ["dotnet", "EngineApi.dll"]
