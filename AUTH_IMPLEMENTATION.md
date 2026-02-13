# Authentication Implementation Guide

## Overview

BioSim Lab now includes a complete authentication system using Supabase Auth with email/password authentication.

## Implementation Details

### 1. Supabase Client

**Location:** `/src/lib/supabase.ts`

A centralized Supabase client is configured with:
- Auto token refresh
- Persistent sessions
- Session detection in URLs

Environment variables required:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 2. Authentication Context

**Location:** `/src/context/AuthContext.tsx`

Provides global authentication state with:
- `user` - Current authenticated user
- `session` - Current session
- `loading` - Loading state during auth checks
- `signUp(email, password)` - Create new account
- `signIn(email, password)` - Sign in existing user
- `signOut()` - Sign out current user

Usage:
```tsx
import { useAuth } from '../context/AuthContext';

const { user, signIn, signOut } = useAuth();
```

### 3. Authentication Components

#### LoginForm
**Location:** `/src/components/auth/LoginForm.tsx`

- Email/password login
- Error handling with visual feedback
- Redirects to home page after successful login
- Link to signup page

#### SignupForm
**Location:** `/src/components/auth/SignupForm.tsx`

- Email/password registration
- Password confirmation
- Email verification message after signup
- Auto-redirect to login after 2 seconds
- Link to login page

### 4. Route Protection

**Location:** `/src/routes/ProtectedRoute.tsx`

Protects routes from unauthenticated access:
- Shows loading spinner during auth check
- Redirects to `/login` if user is not authenticated
- Renders protected content if user is authenticated

### 5. Router Configuration

**Location:** `/src/Router.tsx`

Routes:
- `/login` - Public login page
- `/signup` - Public signup page
- `/` - Protected lab bench (requires auth)
- `/profile` - Protected student profile (requires auth)
- `/leaderboard` - Public leaderboard
- `/instructor/setup` - Public instructor setup
- `/instructor/:code` - Public instructor dashboard

### 6. Header Updates

**Location:** `/src/components/Header.tsx`

- Shows navigation buttons only when user is authenticated
- Displays "Sign Out" button for authenticated users
- Shows "Sign In" button for unauthenticated users
- Hides navigation on auth pages

## Email Verification

Email verification is configured through Supabase Dashboard:

1. Go to Authentication → Email Templates in Supabase Dashboard
2. Ensure "Confirm your signup" template is enabled
3. Users will receive verification email after signup
4. Users can sign in after verifying their email

To disable email verification (for testing):
1. Go to Authentication → Providers → Email
2. Uncheck "Enable email confirmation"

## User Flow

### New User
1. Visit `/signup`
2. Enter email and password
3. Receive verification email (if enabled)
4. Verify email via link
5. Visit `/login`
6. Sign in and access protected routes

### Returning User
1. Visit `/login` (or automatically redirected from protected routes)
2. Enter credentials
3. Redirected to home page
4. Session persists across page refreshes

### Sign Out
1. Click "Sign Out" in header
2. Session cleared
3. Redirected to login page

## Security Features

- Passwords hashed by Supabase Auth
- JWT tokens for session management
- Automatic token refresh
- Secure session persistence
- Protected routes require authentication
- Environment variables for sensitive keys

## Testing

To test the authentication:

1. Start the development server: `npm run dev`
2. Navigate to `/signup` to create an account
3. Check email for verification link (if enabled)
4. Navigate to `/login` to sign in
5. Verify access to protected routes (`/`, `/profile`)
6. Test sign out functionality
7. Verify redirect to login when accessing protected routes while logged out

## Styling

All auth components use:
- Tailwind CSS for styling
- Cyan color scheme (`cyan-500`, `cyan-600`, `cyan-700`)
- Clean, minimal design
- Mobile responsive layouts
- Clear error states
- Loading indicators

## Future Enhancements

Potential additions:
- Password reset functionality
- Social authentication (Google, GitHub, etc.)
- Two-factor authentication
- Profile management
- Account settings page
