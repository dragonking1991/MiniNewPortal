# Mini News Portal - API Documentation

## Base URL

```
http://localhost:3000/api
```

All endpoints return JSON responses. Authentication uses httpOnly cookies with JWT tokens.

## Authentication

### Login

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

**Notes:**
- Token is automatically stored in httpOnly cookie `mnp_token`
- Token expires after 1 hour
- Password is compared using constant-time comparison for security

### Get Current User

**Request:**
```bash
curl http://localhost:3000/api/auth/me \
  -b "mnp_token=your-jwt-token"
```

**Response:** `200 OK`
```json
{
  "username": "admin",
  "isAuthenticated": true
}
```

**Status Codes:**
- `401 Unauthorized` - JWT invalid or expired

### Logout

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b "mnp_token=your-jwt-token"
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

**Notes:**
- Clears the `mnp_token` cookie

## Public Endpoints

### Get All Categories

**Request:**
```bash
curl http://localhost:3000/api/categories
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Technology",
    "slug": "technology",
    "newsCount": 12,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Business",
    "slug": "business",
    "newsCount": 8,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
]
```

### List Published News

**Request:**
```bash
curl 'http://localhost:3000/api/news?page=1&limit=20&categoryId=1&categorySlug=technology'
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Items per page (max: 100)
- `categoryId` (optional) - Filter by category ID
- `categorySlug` (optional) - Filter by category slug

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": 1,
      "title": "Breaking: New AI Model Released",
      "slug": "breaking-new-ai-model-released",
      "summary": "A groundbreaking new AI model has been announced...",
      "content": "Full article content here...",
      "status": "PUBLISHED",
      "categoryId": 1,
      "viewCount": 156,
      "imageUrl": "https://example.com/image.jpg",
      "publishedAt": "2025-01-15T09:00:00.000Z",
      "createdAt": "2025-01-15T08:00:00.000Z",
      "updatedAt": "2025-01-15T09:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 156,
  "hasMore": true
}
```

### Get Article by Slug

**Request:**
```bash
curl http://localhost:3000/api/news/breaking-new-ai-model-released
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Breaking: New AI Model Released",
  "slug": "breaking-new-ai-model-released",
  "summary": "A groundbreaking new AI model has been announced...",
  "content": "Full article content here...",
  "status": "PUBLISHED",
  "categoryId": 1,
  "viewCount": 157,
  "imageUrl": "https://example.com/image.jpg",
  "publishedAt": "2025-01-15T09:00:00.000Z",
  "createdAt": "2025-01-15T08:00:00.000Z",
  "updatedAt": "2025-01-15T09:00:00.000Z",
  "newerSlug": "latest-market-update",
  "olderSlug": "previous-week-summary"
}
```

**Status Codes:**
- `200 OK` - Article found (view count incremented)
- `404 Not Found` - Article not found

**Notes:**
- View count is incremented automatically when accessed
- `newerSlug` and `olderSlug` show adjacent articles in publication order

### Most Viewed Today

**Request:**
```bash
curl http://localhost:3000/api/news/most-viewed-today
```

**Response:** `200 OK`
```json
[
  {
    "newsId": 3,
    "title": "Market Surge Continues",
    "slug": "market-surge-continues",
    "viewCount": 542
  },
  {
    "newsId": 1,
    "title": "Breaking: New AI Model Released",
    "slug": "breaking-new-ai-model-released",
    "viewCount": 157
  }
]
```

**Notes:**
- Returns top 5 most viewed articles in the last 24 hours
- View count is tracked daily and reset each UTC day

## Admin Endpoints

All admin endpoints require authentication (JWT in httpOnly cookie).

### List Categories (Admin)

**Request:**
```bash
curl 'http://localhost:3000/api/admin/categories?page=1&limit=20' \
  -b "mnp_token=your-jwt-token"
```

**Response:** `200 OK` (same structure as public categories list)

**Status Codes:**
- `401 Unauthorized` - Not authenticated

### Create Category

**Request:**
```bash
curl -X POST http://localhost:3000/api/admin/categories \
  -H "Content-Type: application/json" \
  -b "mnp_token=your-jwt-token" \
  -d '{
    "name": "Entertainment",
    "slug": "entertainment"
  }'
```

**Response:** `200 OK`
```json
{
  "id": 5,
  "name": "Entertainment",
  "slug": "entertainment",
  "createdAt": "2025-01-15T15:30:00.000Z",
  "updatedAt": "2025-01-15T15:30:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Category created
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Not authenticated
- `409 Conflict` - Slug already exists

### Get Category

**Request:**
```bash
curl http://localhost:3000/api/admin/categories/1 \
  -b "mnp_token=your-jwt-token"
```

**Response:** `200 OK`

### Update Category

**Request:**
```bash
curl -X PUT http://localhost:3000/api/admin/categories/1 \
  -H "Content-Type: application/json" \
  -b "mnp_token=your-jwt-token" \
  -d '{
    "name": "Tech News",
    "slug": "tech-news"
  }'
```

**Response:** `200 OK`

**Status Codes:**
- `200 OK` - Category updated
- `400 Bad Request` - Validation error
- `404 Not Found` - Category not found
- `409 Conflict` - New slug already exists

### Delete Category

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/admin/categories/1 \
  -b "mnp_token=your-jwt-token"
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

**Status Codes:**
- `200 OK` - Category deleted
- `404 Not Found` - Category not found
- `409 Conflict` - Category has news items

### List News (Admin)

**Request:**
```bash
curl 'http://localhost:3000/api/admin/news?page=1&limit=20&categoryId=1&status=DRAFT' \
  -b "mnp_token=your-jwt-token"
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `categoryId` (optional)
- `status` (optional) - DRAFT or PUBLISHED

**Response:** `200 OK` (same structure as public news list)

### Create News

**Request:**
```bash
curl -X POST http://localhost:3000/api/admin/news \
  -H "Content-Type: application/json" \
  -b "mnp_token=your-jwt-token" \
  -d '{
    "title": "New Article Title",
    "slug": "new-article-title",
    "summary": "Brief summary of the article",
    "content": "Full article content goes here...",
    "imageUrl": "https://example.com/image.jpg",
    "categoryId": 1,
    "status": "DRAFT",
    "publishedAt": null
  }'
```

**Response:** `200 OK`

**Status Codes:**
- `200 OK` - News created
- `400 Bad Request` - Validation error (e.g., slug too long)
- `409 Conflict` - Slug already exists
- `422 Unprocessable Entity` - Published without publishedAt

### Get News

**Request:**
```bash
curl http://localhost:3000/api/admin/news/1 \
  -b "mnp_token=your-jwt-token"
```

**Response:** `200 OK`

### Update News

**Request:**
```bash
curl -X PUT http://localhost:3000/api/admin/news/1 \
  -H "Content-Type: application/json" \
  -b "mnp_token=your-jwt-token" \
  -d '{
    "status": "PUBLISHED",
    "publishedAt": "2025-01-15T10:00:00Z"
  }'
```

**Response:** `200 OK`

**Status Codes:**
- `200 OK` - News updated
- `404 Not Found` - News not found
- `409 Conflict` - New slug already exists
- `422 Unprocessable Entity` - Publishing without publishedAt

### Delete News

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/admin/news/1 \
  -b "mnp_token=your-jwt-token"
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

**Common Error Codes:**
- `NOT_FOUND` - Resource not found (404)
- `CONFLICT` - Resource already exists (409)
- `VALIDATION_ERROR` - Invalid input (400)
- `UNAUTHORIZED` - Authentication required (401)
- `FORBIDDEN` - Permission denied (403)

## OpenAPI Specification

Full OpenAPI 3.0 specification is available at:

```
GET /api/_openapi
```

Use this with tools like Swagger UI or Postman for interactive API exploration.

## Rate Limiting

Currently not implemented. Recommended for production:
- Login endpoint: 5 requests per minute per IP
- API endpoints: 60 requests per minute per user

## Pagination

Endpoints returning lists use cursor-based pagination:

```json
{
  "items": [...],
  "page": 1,
  "limit": 20,
  "total": 156,
  "hasMore": true
}
```

- `page`: Current page number (1-based)
- `limit`: Items per page (1-100, default 20)
- `total`: Total count of items
- `hasMore`: Whether more items exist

## CORS

CORS is not explicitly configured. Browsers can make requests from the same origin. For cross-origin requests, add CORS middleware to nuxt.config.

## Webhook Support

Not currently implemented.

## API Versioning

Not implemented. All endpoints are v1 (implicit).

## Testing

E2E tests cover major API flows:

```bash
pnpm test:e2e
```

Unit tests for services:

```bash
pnpm test
```
