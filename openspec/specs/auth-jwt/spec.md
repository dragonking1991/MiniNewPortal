# auth-jwt Specification

## Purpose
TBD - created by archiving change mini-news-portal. Update Purpose after archive.
## Requirements
### Requirement: Hardcoded admin credentials loaded from environment
The system SHALL read admin credentials from environment variables `ADMIN_USERNAME` and `ADMIN_PASSWORD` and SHALL NOT commit them to source control.

#### Scenario: Missing env at boot
- **WHEN** the API starts without `ADMIN_USERNAME` or `ADMIN_PASSWORD` set
- **THEN** the process logs a fatal error and exits with non-zero status

#### Scenario: Comparison uses constant-time check
- **WHEN** login compares submitted credentials to the configured ones
- **THEN** the comparison uses a constant-time string comparison to avoid timing attacks

### Requirement: JWT token issuance
The system SHALL issue HS256 JWTs with payload `{ sub, role, iat, exp }`, expiring in 1 hour, signed with `JWT_SECRET`.

#### Scenario: Successful issuance
- **WHEN** credentials are valid
- **THEN** the API returns a token with `sub = "admin"`, `role = "admin"`, a current `iat`, and `exp = iat + 3600`

#### Scenario: Missing secret at boot
- **WHEN** `JWT_SECRET` is not set
- **THEN** the API refuses to start

### Requirement: JWT verification middleware
The system SHALL provide an auth guard that verifies a Bearer token from the `Authorization` header OR the `mnp_token` cookie and attaches the verified principal to the request.

#### Scenario: Valid token grants access
- **WHEN** a request includes a valid, unexpired JWT
- **THEN** the guard allows the request and exposes `req.user = { sub, role }`

#### Scenario: Missing token rejected
- **WHEN** a protected endpoint receives a request with no token
- **THEN** the guard responds 401 with `error.code = "UNAUTHORIZED"`

#### Scenario: Expired token rejected
- **WHEN** the supplied JWT is expired
- **THEN** the guard responds 401 with `error.code = "TOKEN_EXPIRED"`

#### Scenario: Tampered token rejected
- **WHEN** the JWT signature is invalid
- **THEN** the guard responds 401 with `error.code = "UNAUTHORIZED"`

### Requirement: Stateless server-side state
The system SHALL NOT maintain any server-side session store; authentication state SHALL be derived entirely from the verified JWT on each request.

#### Scenario: No session storage
- **WHEN** the API is inspected for session middleware or store dependencies
- **THEN** none are present and horizontal scaling does not require sticky sessions

### Requirement: Secure cookie handling
When the API sets the JWT cookie, it SHALL use `HttpOnly`, `Secure` (in non-dev environments), `SameSite=Lax`, and a `Max-Age` matching token expiry.

#### Scenario: Cookie flags in production
- **WHEN** the API responds with a Set-Cookie for `mnp_token` in production
- **THEN** the cookie includes `HttpOnly; Secure; SameSite=Lax; Max-Age=3600; Path=/`

#### Scenario: Logout clears cookie
- **WHEN** the logout endpoint is called
- **THEN** the response sets `mnp_token` to empty with `Max-Age=0`

