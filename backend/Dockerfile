# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# Copy solution and restore dependencies
COPY *.sln .
COPY Crm.Api/*.csproj Crm.Api/
COPY Crm.Application/*.csproj Crm.Application/
COPY Crm.Domain/*.csproj Crm.Domain/
COPY Crm.Infrastructure/*.csproj Crm.Infrastructure/
COPY Crm.UnitTests/*.csproj Crm.UnitTests/
COPY Crm.IntegrationTests/*.csproj Crm.IntegrationTests/
RUN dotnet restore

# Copy everything else and build
COPY . .
WORKDIR /source/Crm.Api
RUN dotnet publish -c Release -o /app

# Final Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .

# Security: Run as non-root user
USER $APP_UID

# Set environment variables for Railway portability
ENV ASPNETCORE_URLS=http://+:8000
EXPOSE 8000

ENTRYPOINT ["dotnet", "Crm.Api.dll"]
