using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json;
using EngineApi.DTOs;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace EngineApi.Services;

/// <summary>In-process Trust service with JWT verification. Used when ENGINES_TRUST_BASE_URL is not set.</summary>
public class TrustService : ITrustService
{
    private readonly IConfiguration _configuration;

    public TrustService(IConfiguration configuration)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    public TrustVerifyResponseDto Verify(TrustVerifyRequestDto request)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));

        var token = ExtractToken(request);
        if (string.IsNullOrWhiteSpace(token))
            return new TrustVerifyResponseDto(Valid: false, Message: "No token provided (expect payload.token or payload as string)");

        try
        {
            var (valid, message) = VerifyJwt(token);
            return new TrustVerifyResponseDto(valid, message);
        }
        catch (Exception ex)
        {
            return new TrustVerifyResponseDto(Valid: false, Message: ex.Message);
        }
    }

    public TrustScoreResponseDto GetScore(string entityId)
    {
        if (string.IsNullOrWhiteSpace(entityId))
            throw new ArgumentException("entityId is required", nameof(entityId));
        return new TrustScoreResponseDto(EntityId: entityId, Score: 0.0, Source: null);
    }

    private static string? ExtractToken(TrustVerifyRequestDto request)
    {
        var payload = request.Payload;
        if (payload == null) return null;
        if (payload is string s && !string.IsNullOrWhiteSpace(s)) return s.Trim();
        if (payload is JsonElement je)
        {
            if (je.ValueKind == JsonValueKind.String) return je.GetString()?.Trim();
            if (je.TryGetProperty("token", out var t)) return t.GetString()?.Trim();
            if (je.TryGetProperty("jwt", out var j)) return j.GetString()?.Trim();
            if (je.TryGetProperty("accessToken", out var a)) return a.GetString()?.Trim();
        }
        return null;
    }

    private (bool Valid, string? Message) VerifyJwt(string token)
    {
        var secret = _configuration["Trust:JwtSecret"] ?? _configuration["TRUST_JWT_SECRET"] ?? "";
        var strict = string.Equals(_configuration["Trust:JwtStrict"] ?? "false", "true", StringComparison.OrdinalIgnoreCase);
        var handler = new JwtSecurityTokenHandler();

        if (!handler.CanReadToken(token))
            return (false, "Invalid token format");

        if (string.IsNullOrWhiteSpace(secret))
        {
            if (strict)
                return (false, "JWT secret not configured (Trust:JwtSecret or TRUST_JWT_SECRET)");
            try
            {
                var jwt = handler.ReadJwtToken(token);
                var exp = jwt.ValidTo;
                if (exp != DateTime.MinValue && exp < DateTime.UtcNow)
                    return (false, "Token expired");
                return (true, "valid");
            }
            catch
            {
                return (false, "Invalid token");
            }
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var validationParams = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),
        };

        try
        {
            _ = handler.ValidateToken(token, validationParams, out _);
            return (true, "valid");
        }
        catch (SecurityTokenExpiredException)
        {
            return (false, "Token expired");
        }
        catch (SecurityTokenInvalidSignatureException)
        {
            return (false, "Invalid signature");
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }
}
