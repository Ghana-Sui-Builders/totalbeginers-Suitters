# TODO: Backend Implementation - Priority Tasks

## 🔴 CRITICAL - Do First (For Basic Functionality)

### 1. Create Type Definitions
**File: `src/types.ts`**
```typescript
// TODO: Create all TypeScript interfaces
// - Request body types for all endpoints
// - Response types
// - JWT payload type
// - Extend Express Request with userAddress
// Estimated time: 1-2 hours
```

### 2. Create Validation Module
**File: `src/utils/validation.ts`**
```typescript
// TODO: Implement validation functions
// - isValidSuiAddress() - Check 0x + 64 hex chars
// - isValidUsername() - 3-30 chars, alphanumeric + underscores
// - isValidUrl() - Must start with http/https, max 500 chars
// - isValidBio() - Max 160 characters
// - isValidContent() - 1-280 characters
// - sanitizeInput() - Prevent injection
// Estimated time: 2-3 hours
```

### 3. Create Error Handler
**File: `src/utils/error-handler.ts`**
```typescript
// TODO: Implement error handling system
// - Custom error classes (ValidationError, AuthError, etc.)
// - Global error middleware
// - Consistent error response format
// - Production-safe error messages
// Estimated time: 2 hours
```

### 4. Add Missing SUI Service Functions
**File: `src/sui.service.ts`**
```typescript
// TODO: Add these functions:
// 1. checkUsernameAvailability(username: string): Promise<boolean>
//    - Query Registry's usernames table
//    - Return true if available
// 
// 2. getProfileObject(profileId: string): Promise<any>
//    - Fetch full profile object
//    - Used for validation
//
// 3. validateObjectOwnership(objectId: string, owner: string): Promise<boolean>
//    - Check object owner matches expected address
//    - Used before delete operations
//
// Estimated time: 2-3 hours
```

### 5. Update `/api/register` Endpoint
**File: `src/index.ts`**
```typescript
// TODO: Add to POST /api/register:
// 1. Import and use validation functions
// 2. Validate all inputs (username, bio, image_url, address)
// 3. Check if user already has profile (getUserProfileId)
// 4. Check if username is taken (checkUsernameAvailability)
// 5. Return 409 Conflict if profile exists or username taken
// 6. Wrap in try-catch with proper error handling
// 7. Add detailed error messages
// Estimated time: 1 hour
```

### 6. Update `/api/post` Endpoint
```typescript
// TODO: Add validation and error handling:
// 1. Validate content length (1-280 chars)
// 2. Validate image URL if provided
// 3. Check if profile exists before creating post
// 4. Handle errors from blockchain
// 5. Return 404 if profile not found
// Estimated time: 1 hour
```

### 7. Update `/api/like` Endpoint
```typescript
// TODO: Add validation and error handling:
// 1. Validate post_id format
// 2. Check if post exists
// 3. Handle E_ALREADY_LIKED error from contract
// 4. Return 409 Conflict if already liked
// 5. Return 404 if post not found
// Estimated time: 1 hour
```

### 8. Update `/api/profile` Endpoint
```typescript
// TODO: Add validation and error handling:
// 1. Validate all input fields
// 2. Check username availability if changing
// 3. Handle E_USERNAME_EXISTS error
// 4. Return proper error codes
// Estimated time: 1 hour
```

---

## 🟡 HIGH PRIORITY - Do Second (For Complete API)

### 9. Implement Missing Endpoints

#### A. POST /api/follow
```typescript
// TODO: Create endpoint
// - Authenticate user
// - Get user's profile ID
// - Validate target profile exists
// - Check not following self
// - Handle E_ALREADY_FOLLOWING error
// - Build and execute transaction
// Estimated time: 1.5 hours
```

#### B. DELETE /api/follow/:follow_id
```typescript
// TODO: Create endpoint
// - Authenticate user
// - Validate user owns the follow object
// - Build unfollow transaction
// - Execute and return
// Estimated time: 1 hour
```

#### C. DELETE /api/like/:like_id
```typescript
// TODO: Create endpoint
// - Authenticate user
// - Validate ownership of like object
// - Also get post ID for updating count
// - Build unlike transaction
// - Execute and return
// Estimated time: 1 hour
```

#### D. DELETE /api/post/:post_id
```typescript
// TODO: Create endpoint
// - Authenticate user
// - Validate user is post author
// - Build delete_post transaction
// - Execute and return
// Estimated time: 1 hour
```

#### E. DELETE /api/profile
```typescript
// TODO: Create endpoint
// - Authenticate user
// - Add warning about irreversibility
// - Build delete_profile transaction
// - Clean up from Registry
// - Execute and return
// Estimated time: 1 hour
```

### 10. Enhance Health Check
```typescript
// TODO: Upgrade GET /health endpoint:
// - Check Sui network connectivity
// - Query sponsor wallet balance
// - Warn if balance low (<1 SUI)
// - Return detailed status
// Estimated time: 30 minutes
```

---

## 🟠 MEDIUM PRIORITY - Do Third (For Security)

### 11. Add Rate Limiting
```bash
# TODO: Install dependency
npm install express-rate-limit

# Then in src/index.ts:
# - Import express-rate-limit
# - Configure per-IP limiter (100 req/15min)
# - Configure per-user limiter for posts (50/hour)
# - Add to middleware stack
# - Return 429 with Retry-After header
# Estimated time: 1 hour
```

### 12. Configure CORS Properly
```typescript
// TODO: Update CORS configuration in src/index.ts
// - Don't use wildcard in production
// - Set specific allowed origins
// - Configure credentials properly
// - Set allowed methods
// Estimated time: 30 minutes
```

### 13. Add Comprehensive Logging
```bash
# TODO: Install Winston
npm install winston

# Create src/utils/logger.ts:
# - Configure Winston with transports
# - Different log levels (debug, info, warn, error)
# - JSON format for production
# - File rotation
# 
# Then update all files:
# - Replace console.log with logger.info
# - Replace console.error with logger.error
# - Add request logging middleware
# Estimated time: 2 hours
```

### 14. Improve Server Startup
```typescript
// TODO: Add to src/index.ts startup:
// - Validate all env vars before starting
// - Check Sui network connectivity
// - Check sponsor wallet balance
// - Log full configuration
// - Add graceful shutdown handler
// Estimated time: 1 hour
```

### 15. Enhance Auth Middleware
```typescript
// TODO: Update src/auth.middleware.ts:
// - Add Sui address format validation
// - Better error messages
// - Add TODO comment for production JWT verification
// - Add security warning comments
// Estimated time: 30 minutes
```

---

## 🟢 LOW PRIORITY - Do Last (For Polish)

### 16. Add JSDoc Comments
```typescript
// TODO: Add detailed JSDoc to all functions
// - Parameter descriptions
// - Return type descriptions
// - Example usage
// - Security notes
// Estimated time: 2-3 hours
```

### 17. Create API Documentation
```bash
# TODO: Set up Swagger/OpenAPI
npm install swagger-ui-express swagger-jsdoc

# - Create swagger.json
# - Define all endpoints
# - Add request/response examples
# - Document error codes
# - Host at /api-docs
# Estimated time: 3-4 hours
```

### 18. Write Tests
```bash
# TODO: Set up Jest
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest

# - Configure Jest
# - Write unit tests for validation functions
# - Write integration tests for endpoints
# - Mock Sui client
# - Aim for >80% coverage
# Estimated time: 8-10 hours
```

---

## 📊 TIME ESTIMATES

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| **Critical (Do First)** | Tasks 1-8 | **12-15 hours** |
| **High Priority (Do Second)** | Tasks 9-10 | **7 hours** |
| **Medium Priority (Do Third)** | Tasks 11-15 | **6 hours** |
| **Low Priority (Do Last)** | Tasks 16-18 | **13-17 hours** |
| **TOTAL** | 18 tasks | **38-45 hours** |

---

## 🎯 RECOMMENDED WORKFLOW

### For Hackathon Demo (Minimum)
**Time: 1-2 days**
1. Complete Critical tasks (1-8)
2. Complete High Priority endpoints (9)
3. Skip security and polish for now
4. Focus on functionality

### For Production Launch (Full)
**Time: 1 week**
1. Day 1-2: Critical tasks (1-8)
2. Day 3: High Priority tasks (9-10)
3. Day 4: Medium Priority security (11-15)
4. Day 5: Testing and documentation (16-18)
5. Day 6-7: Security audit and deployment

---

## ✅ COMPLETION TRACKING

### Phase 1: Critical Infrastructure
- [ ] Task 1: Type Definitions
- [ ] Task 2: Validation Module
- [ ] Task 3: Error Handler
- [ ] Task 4: SUI Service Functions
- [ ] Task 5: Update /api/register
- [ ] Task 6: Update /api/post
- [ ] Task 7: Update /api/like
- [ ] Task 8: Update /api/profile

### Phase 2: Complete API
- [ ] Task 9A: POST /api/follow
- [ ] Task 9B: DELETE /api/follow/:follow_id
- [ ] Task 9C: DELETE /api/like/:like_id
- [ ] Task 9D: DELETE /api/post/:post_id
- [ ] Task 9E: DELETE /api/profile
- [ ] Task 10: Enhanced Health Check

### Phase 3: Security
- [ ] Task 11: Rate Limiting
- [ ] Task 12: CORS Configuration
- [ ] Task 13: Logging System
- [ ] Task 14: Server Startup Validation
- [ ] Task 15: Auth Middleware Improvements

### Phase 4: Polish
- [ ] Task 16: JSDoc Comments
- [ ] Task 17: API Documentation
- [ ] Task 18: Test Suite

---

## 📝 NOTES

- Start with Phase 1 (Critical) - These are blocking issues
- Phase 2 completes the API surface
- Phase 3 adds production security
- Phase 4 is nice-to-have but important for maintainability
- Each task includes time estimate for planning
- Mark tasks complete as you finish them
- Update estimates based on actual time taken

---

**Current Status: 30% Complete**
**Next Task: Create `src/types.ts`**
