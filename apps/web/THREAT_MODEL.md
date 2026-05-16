# Security Threat Model - Mini News Portal

## Architecture Overview
- **Frontend**: Nuxt 3 with Vue 3 (SSR on public routes, SPA on `/admin/**`)
- **Backend**: Nitro API server with JWT authentication
- **Database**: PostgreSQL (production) / SQLite (dev)
- **Auth**: HS256 JWT tokens with 1-hour expiration, httpOnly secure cookies

## Identified Threats & Mitigations

### 1. Authentication & Authorization

**Threat**: Weak credential validation, brute force login attacks

**Mitigation**:
- ✅ Constant-time password comparison using `timingSafeEqual()` (prevents timing attacks)
- ✅ HTTP-only, Secure, SameSite cookies for JWT storage
- ✅ JWT expiration set to 1 hour (reduces window of token misuse)
- ✅ Environment variable validation at startup (fail-fast on missing JWT_SECRET)

**Implementation**: [auth.service.ts](../server/services/auth.service.ts)

### 2. XSS (Cross-Site Scripting)

**Threat**: Malicious JavaScript injection through news content

**Mitigation**:
- ✅ Vue 3 auto-escaping of string interpolations (prevents DOM XSS by default)
- ⚠️ Content sanitization via DOMPurify (if v-html is used for rich content)
- ✅ Content Security Policy headers (can be added to nuxt.config if needed)

**Implementation**: Content stored as plain text; if HTML rendering needed, use `v-sanitize` directive

### 3. SQL Injection

**Threat**: Malicious SQL through user input

**Mitigation**:
- ✅ Drizzle ORM with parameterized queries (prevents SQL injection)
- ✅ Input validation via Zod schemas on all endpoints
- ✅ Database driver types enforce type safety at compile time

**Implementation**: [schemas.ts](../packages/shared/schemas.ts), all endpoints validate with Zod

### 4. CSRF (Cross-Site Request Forgery)

**Threat**: Admin actions triggered from malicious third-party site

**Mitigation**:
- ✅ SameSite=Lax cookie policy (prevents cross-site cookie transmission)
- ✅ JWT in httpOnly cookie (not accessible to JavaScript)
- ⚠️ Optional: CSRF token for state-changing operations (not implemented)

**Implementation**: Cookie set in [login.post.ts](../server/api/auth/login.post.ts)

### 5. Privilege Escalation

**Threat**: Regular users accessing admin endpoints

**Mitigation**:
- ✅ `requireAdmin()` middleware on all admin endpoints (validates JWT + username check)
- ✅ Admin-only middleware on admin routes
- ✅ No user enumeration (same error message for invalid username/password)

**Implementation**: [utils/auth.ts](../server/utils/auth.ts), all admin routes protected

### 6. Rate Limiting

**Threat**: Brute force attacks, DoS on login endpoint

**Mitigation**:
- ⚠️ Not implemented (would need middleware like `h3-ratelimit`)
- Recommendation: Add rate limiting to `/api/auth/login` endpoint

### 7. Information Disclosure

**Threat**: Error messages revealing system details

**Mitigation**:
- ✅ Generic error messages in auth responses (401 Unauthorized)
- ✅ Detailed errors only in development (error middleware in nuxt.config)
- ✅ No stack traces exposed to clients in production

**Implementation**: [utils/validate.ts](../server/utils/validate.ts) error handling

### 8. Dependency Vulnerabilities

**Threat**: Outdated packages with known vulnerabilities

**Mitigation**:
- Use `pnpm audit` regularly
- Keep dependencies updated (Nuxt, Vue, Drizzle, Zod, etc.)
- Review changelogs before updating major versions

### 9. Database Access Control

**Threat**: Unauthorized database access via connection string exposure

**Mitigation**:
- ✅ DATABASE_URL stored in environment variables (never in code)
- ✅ Separate credentials for development and production
- ✅ Database driver options enforce SSL/TLS in production

**Implementation**: [db/client.ts](../server/db/client.ts) uses `process.env.DATABASE_URL`

### 10. Session Management

**Threat**: Session hijacking, token theft

**Mitigation**:
- ✅ JWT tokens expire after 1 hour
- ✅ httpOnly cookies prevent JavaScript access
- ✅ Secure flag ensures HTTPS transmission
- ✅ SameSite=Lax prevents cross-site cookie sharing

## Security Checklist

- [x] Environment variables validated on startup
- [x] Passwords compared using constant-time comparison
- [x] JWT tokens stored in httpOnly cookies
- [x] Admin endpoints protected with middleware
- [x] Input validation with Zod on all endpoints
- [x] Error messages generic (no system details leaked)
- [x] No SQL injection possible (Drizzle ORM + parameterized queries)
- [x] Vue auto-escaping prevents DOM XSS
- [ ] Rate limiting on login endpoint (recommended)
- [ ] Content Security Policy headers (optional)
- [ ] DOMPurify for rich HTML content (if needed)

## Future Hardening

1. **Add rate limiting** to `/api/auth/login`
2. **Implement CSRF tokens** for admin form submissions
3. **Add Content-Security-Policy headers** to nuxt.config
4. **Enable HSTS** for HTTPS enforcement
5. **Regular security audits** with `npm audit`, `pnpm audit`
6. **Penetration testing** before production deployment
7. **Web Application Firewall (WAF)** in production (Cloudflare, AWS WAF, etc.)
8. **Logging & Monitoring** for suspicious activities

## Compliance Notes

- GDPR: Personal data (admin username) in JWT - consider encryption
- OWASP Top 10: This model addresses A01-Broken Access Control, A02-Cryptographic Failures, A03-Injection, A07-XSS
