# Authentication Quick Reference

## 🚀 Quick Start

### Server-side Authentication

```typescript
import { verifyUserToken } from "@/lib/auth-utils";

// In your server action or API route
const decodedToken = await verifyUserToken(); // Throws error if invalid
```

### Client-side Authentication

```typescript
import { getFreshToken } from "@/lib/client-auth-utils";

// In your component
const token = await getFreshToken(); // Returns null if invalid
```

### Using Auth Context

```typescript
import { useAuth } from "@/context/auth";

const { currentUser, loading, customClaims } = useAuth();
```

## 📁 File Structure

```
src/
├── lib/
│   ├── auth-utils.ts          # Server-side token verification
│   └── client-auth-utils.ts   # Client-side token utilities
├── context/
│   ├── auth.tsx              # Authentication context provider
│   └── actions.tsx           # Server actions for cookies
└── app/api/
    └── refresh-token/
        └── route.ts          # Token refresh API endpoint
```

## 🔧 Key Functions

| Function                | Location               | Purpose                                                |
| ----------------------- | ---------------------- | ------------------------------------------------------ |
| `getCurrentUserToken()` | `auth-utils.ts`        | Get current user token (returns null if not logged in) |
| `requireUserAuth()`     | `auth-utils.ts`        | Server-side token verification (throws if not authed)  |
| `verifyUserToken()`     | `auth-utils.ts`        | ⚠️ **DEPRECATED** - Use requireUserAuth() instead      |
| `verifyAdminToken()`    | `auth-utils.ts`        | Admin token verification                               |
| `getFreshToken()`       | `client-auth-utils.ts` | Get valid client token with caching                    |
| `isAuthenticated()`     | `client-auth-utils.ts` | Quick auth check                                       |
| `useAuth()`             | `auth.tsx`             | React hook for auth state + ensureTokenSync()          |

## ⚡ Performance Features

- **30-second client-side cache** - Prevents excessive token refreshes
- **Race condition prevention** - Promise caching for concurrent requests
- **Smart refresh timing** - Only refresh when tokens expire within 10 minutes
- **Minimal server actions** - Reduced server round-trips

## 🍪 Cookie Configuration

All auth cookies use consistent settings:

```typescript
{
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  expires: /* 1 hour for access, 30 days for refresh */
}
```

## 🔄 Token Refresh Strategy

| Trigger             | Condition           | Action                         |
| ------------------- | ------------------- | ------------------------------ |
| Periodic            | Every 45 minutes    | Check if expires in 10 minutes |
| Page Focus          | User returns to tab | Check if expires in 5 minutes  |
| Server Verification | Token invalid       | Attempt refresh once           |
| Client Request      | Manual call         | Respect 30-second cooldown     |

## ❌ Error Messages

| Error                                       | Meaning                  | Action                                 |
| ------------------------------------------- | ------------------------ | -------------------------------------- |
| `"Authentication required"`                 | User not logged in       | Redirect to login                      |
| `"Invalid authentication token"`            | Malformed token          | Clear session, redirect to login       |
| `"Authentication required - please log in"` | Token expired/invalid    | Auto-refresh attempted, may need login |
| `"Admin privileges required"`               | Insufficient permissions | Show access denied                     |

## 🧪 Testing Patterns

### Mock Authentication

```typescript
jest.mock("@/lib/client-auth-utils", () => ({
  getFreshToken: jest.fn().mockResolvedValue("mock-token"),
  isAuthenticated: jest.fn().mockReturnValue(true),
}));
```

### Mock Auth Context

```typescript
const mockAuth = {
  currentUser: { uid: "test-uid", email: "test@example.com" },
  loading: false,
  customClaims: null,
};
```

## 🐛 Common Issues & Solutions

### Issue: Token refresh fails

**Check**: Firebase configuration and refresh token cookie

```bash
# In browser console
document.cookie.split(';').find(c => c.includes('firebaseAuthRefreshToken'))
```

### Issue: Excessive API calls

**Check**: Client-side caching is working

```typescript
// Should not call server if within 30 seconds
await getFreshToken();
await getFreshToken(); // Should use cache
```

### Issue: Race conditions

**Check**: Multiple simultaneous requests

- Should be automatically handled by promise caching
- Look for multiple network requests in browser dev tools

## 📊 Monitoring

### Key Metrics to Watch

- Token refresh frequency
- Failed verification attempts
- Race condition prevention hits
- Cookie update failures

### Debug Logging

```typescript
// Enable in development
console.log("Successfully refreshed Firebase token");
console.log("Token expires soon, performing refresh");
console.error("Token verification error:", error);
```

## 🔐 Security Checklist

- ✅ httpOnly cookies prevent XSS
- ✅ Secure cookies in production
- ✅ SameSite protection against CSRF
- ✅ Server-side token validation
- ✅ Automatic token cleanup on failure
- ✅ Path-specific cookie scope

## 🌟 Best Practices

### Do ✅

- Use `getFreshToken()` for client-side API calls
- Use `verifyUserToken()` in server actions
- Handle authentication errors gracefully
- Test token expiration scenarios

### Don't ❌

- Call server actions unnecessarily from client
- Force refresh tokens too frequently
- Ignore authentication errors
- Store tokens in localStorage

## 🔄 New Auth Function Usage

### When to Use Each Function

**`getCurrentUserToken()`** - For optional auth checks:

```typescript
const user = await getCurrentUserToken();
if (user) {
  // Show personalized content
} else {
  // Show public content
}
```

**`requireUserAuth()`** - For protected routes/actions:

```typescript
// In server components or actions that REQUIRE authentication
const user = await requireUserAuth(); // Throws if not authenticated
```

**`verifyUserToken()`** - ⚠️ **Deprecated**:

```typescript
// OLD (deprecated) - will show console warning
const user = await verifyUserToken();

// NEW (recommended)
const user = await requireUserAuth();
```

## 📝 Environment Variables

```env
# Required for Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Optional admin configuration
ADMIN_EMAIL=admin@example.com
```

## 🚨 Emergency Procedures

### Clear All Auth State

```typescript
// Client-side
await auth.signOut();

// Server-side
await removeToken();
```

### Force Token Refresh

```typescript
// Client-side
const token = await user.getIdToken(true);

// Through context
const { refreshToken } = useAuth();
await refreshToken();
```

### Debug Token State

```typescript
// Check token expiration
const tokenResult = await user.getIdTokenResult(false);
console.log("Expires:", tokenResult.expirationTime);
console.log("Claims:", tokenResult.claims);
```
