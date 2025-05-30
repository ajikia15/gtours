# Authentication System Documentation

## Overview

This document describes the improved Firebase authentication system that addresses token management issues, race conditions, and performance optimizations while maintaining security and user experience.

## Architecture

The authentication system consists of three main layers:

1. **Server-side Token Management** (`src/lib/auth-utils.ts`)
2. **Client-side Token Utilities** (`src/lib/client-auth-utils.ts`)
3. **Authentication Context** (`src/context/auth.tsx`)
4. **Server Actions** (`src/context/actions.tsx`)

## Key Components

### 1. Server-side Token Management (`src/lib/auth-utils.ts`)

**Purpose**: Handles token verification and automatic refresh on the server side.

#### Key Features:

- **Race Condition Prevention**: Uses promise caching to prevent multiple simultaneous refresh attempts
- **Automatic Token Refresh**: Attempts to refresh expired tokens before throwing errors
- **Centralized Cookie Management**: Consistent cookie configuration across the application

#### Main Functions:

```typescript
// Verifies user token with automatic refresh fallback
export const verifyUserToken = async (token?: string): Promise<DecodedIdToken>

// Verifies admin-specific tokens
export const verifyAdminToken = async (token?: string): Promise<DecodedIdToken>
```

#### Race Condition Prevention:

```typescript
const refreshPromises = new Map<string, Promise<string | null>>();
```

- Single cache key prevents multiple concurrent refresh attempts
- Promise is cleaned up after completion

#### Cookie Configuration:

```typescript
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
```

### 2. Client-side Token Utilities (`src/lib/client-auth-utils.ts`)

**Purpose**: Provides efficient token management for client components.

#### Key Features:

- **Smart Caching**: 30-second cooldown prevents excessive token refreshes
- **Minimal Server Interaction**: Reduces unnecessary server action calls
- **Simple API**: Easy-to-use functions for components

#### Main Functions:

```typescript
// Gets fresh token with built-in caching
export const getFreshToken = async (): Promise<string | null>

// Quick authentication check
export const isAuthenticated = (): boolean

// Get current user ID
export const getCurrentUserUid = (): string | null
```

#### Caching Strategy:

```typescript
let lastTokenRefresh = 0;
const TOKEN_REFRESH_COOLDOWN = 30000; // 30 seconds
```

### 3. Authentication Context (`src/context/auth.tsx`)

**Purpose**: Manages application-wide authentication state and token refresh strategy.

#### Key Features:

- **Smart Refresh Strategy**: Only refreshes when tokens are close to expiration
- **Reduced Server Actions**: Minimal calls to server actions
- **Event-based Refresh**: Responds to page focus when necessary

#### Refresh Strategy:

- **Periodic Check**: Every 45 minutes
- **Conditional Refresh**: Only if token expires within 10 minutes
- **Focus Refresh**: Only if token expires within 5 minutes

#### Token Update Logic:

```typescript
// Only update server cookies on initial auth or forced refresh
if (token && refreshToken && forceRefresh) {
  await setToken({ token, refreshToken });
}
```

### 4. Server Actions (`src/context/actions.tsx`)

**Purpose**: Handles server-side cookie operations for authentication tokens.

#### Functions:

```typescript
// Sets authentication tokens with proper expiration
export const setToken = async({ token, refreshToken });

// Removes authentication tokens
export const removeToken = async();
```

#### Cookie Expiration:

- **Access Token**: 1 hour
- **Refresh Token**: 30 days

## Problem Solutions

### 1. Race Conditions ✅

**Problem**: Multiple simultaneous token refresh attempts causing inconsistent state.

**Solution**: Promise caching in `refreshFirebaseToken()`

```typescript
// Return existing promise if refresh is already in progress
if (refreshPromises.has(cacheKey)) {
  return refreshPromises.get(cacheKey)!;
}
```

### 2. Cookie Management Issues ✅

**Problem**: Inconsistent cookie settings across files, missing path configuration.

**Solution**: Centralized `COOKIE_CONFIG` used across all files

```typescript
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
```

### 3. Client-Server Token Sync Issues ✅

**Problem**: Client calling server actions unnecessarily, causing dependency loops.

**Solution**:

- Client-side caching reduces server calls
- Conditional server cookie updates
- Smart refresh strategy

### 4. Overly Aggressive Refresh Strategy ✅

**Problem**: Tokens being refreshed too frequently, causing unnecessary API calls.

**Solution**:

- Changed from 50-minute forced refresh to 45-minute conditional check
- Only refresh if token expires within 10 minutes
- Focus-based refresh only when needed

### 5. Unnecessary Server Actions ✅

**Problem**: Every token operation triggering server actions.

**Solution**:

- Client-side caching with 30-second cooldown
- Server cookies only updated when necessary
- Removed redundant server action calls

## Usage Examples

### Server-side Authentication Patterns

**For Protected Routes (Required Auth):**

```typescript
import { requireUserAuth } from "@/lib/auth-utils";

export async function protectedServerAction() {
  try {
    const decodedToken = await requireUserAuth();
    // User is authenticated, proceed with logic
    return { userId: decodedToken.uid };
  } catch (error) {
    // User not authenticated, redirect to login
    redirect("/login");
  }
}
```

**For Optional Auth (Public Pages with Personalization):**

```typescript
import { getCurrentUserToken } from "@/lib/auth-utils";

export async function publicPageWithAuth() {
  const user = await getCurrentUserToken();

  if (user) {
    // Show personalized content
    const favourites = await getUserFavourites();
    return { user, favourites };
  } else {
    // Show public content
    return { user: null, favourites: [] };
  }
}
```

**Deprecated Pattern (Don't Use):**

```typescript
// ❌ OLD WAY - Don't use, throws errors for normal non-authenticated states
import { verifyUserToken } from "@/lib/auth-utils";

try {
  const user = await verifyUserToken(); // Throws even when user simply isn't logged in
} catch (error) {
  // This runs even for users who are simply not logged in (normal state)
}
```

### Client-side Token Usage

```typescript
import { getFreshToken } from "@/lib/client-auth-utils";

export default function MyComponent() {
  const handleApiCall = async () => {
    const token = await getFreshToken();
    if (!token) {
      router.push("/login");
      return;
    }

    // Use token for API call
    await myApiCall(token);
  };
}
```

### Authentication Context Usage

```typescript
import { useAuth } from "@/context/auth";

export default function MyComponent() {
  const { currentUser, loading, customClaims, ensureTokenSync } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <div>Please log in</div>;

  return <div>Welcome, {currentUser.email}</div>;
}
```

## Error Handling

The system uses standard JavaScript `Error` objects with improved, context-appropriate messages:

- `"Authentication required"` - User needs to log in (for protected routes)
- `"Invalid authentication token"` - Token is malformed
- `"Authentication required - please log in"` - Token needs refresh or user needs to log in
- `"Admin privileges required"` - User lacks admin access

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
ADMIN_EMAIL=admin@example.com
```

### Cookie Settings

All authentication cookies use consistent settings:

- `httpOnly: true` - Prevents XSS attacks
- `secure: true` (production) - HTTPS only
- `sameSite: "lax"` - CSRF protection
- `path: "/"` - Available site-wide

## Performance Optimizations

1. **Token Caching**: 30-second client-side cache prevents redundant refreshes
2. **Promise Caching**: Prevents race conditions in token refresh
3. **Conditional Refresh**: Only refresh when actually needed
4. **Minimal Server Actions**: Reduced server round-trips
5. **Smart Intervals**: Check every 45 minutes instead of constant refresh

## Security Considerations

1. **httpOnly Cookies**: Prevents client-side JavaScript access
2. **Secure Cookies**: HTTPS-only in production
3. **SameSite Protection**: Prevents CSRF attacks
4. **Token Validation**: Server-side Firebase Admin SDK verification
5. **Automatic Cleanup**: Invalid tokens are removed immediately

## Monitoring and Debugging

The system includes comprehensive logging:

```typescript
console.log("Successfully refreshed Firebase token");
console.log("Token expires soon, performing refresh");
console.error("Token verification error:", error);
```

Key events to monitor:

- Token refresh attempts
- Token verification failures
- Race condition prevention
- Cookie updates

## Migration Notes

### Breaking Changes

- Removed custom `AuthError` class (now uses standard `Error`)
- Simplified client-side token functions
- Changed refresh intervals

### Backwards Compatibility

- All public APIs remain the same
- Existing components work without changes
- Cookie names unchanged

## Testing Considerations

### Key Test Scenarios

1. Token expiration handling
2. Race condition prevention
3. Network failure during refresh
4. Invalid token handling
5. Focus-based refresh triggers

### Test Utilities

```typescript
// Mock token refresh for testing
jest.mock("@/lib/client-auth-utils", () => ({
  getFreshToken: jest.fn().mockResolvedValue("mock-token"),
}));
```

## Troubleshooting

### Common Issues

1. **"No authentication token found"**

   - User needs to log in
   - Check if cookies are being set properly

2. **Token refresh failures**

   - Check Firebase configuration
   - Verify refresh token exists in cookies

3. **Race condition errors**

   - Should be automatically handled by promise caching
   - Check browser network tab for multiple simultaneous requests

4. **Excessive token refreshes**
   - Verify cooldown logic is working
   - Check if multiple components are calling `getFreshToken()`

### Debug Commands

```typescript
// Check current auth state
console.log("Current user:", auth.currentUser);

// Check token expiration
const tokenResult = await user.getIdTokenResult(false);
console.log("Token expires:", tokenResult.expirationTime);

// Force token refresh
const token = await user.getIdToken(true);
```

## Future Improvements

1. **Token Pre-refresh**: Refresh tokens before they expire proactively
2. **Offline Support**: Handle token refresh when coming back online
3. **Multiple Tab Sync**: Coordinate token refresh across browser tabs
4. **Metrics Collection**: Track token refresh frequency and failures
5. **Custom Token Claims**: Enhanced role-based access control
