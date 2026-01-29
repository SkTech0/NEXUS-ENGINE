namespace EngineApi.DTOs;

public record TrustVerifyRequestDto(string? ClaimType, object? Payload);

public record TrustVerifyResponseDto(bool Valid, string? Message);

public record TrustScoreResponseDto(string EntityId, double Score, string? Source);
