# Profiles Table Implementation

## Overview

The `profiles` table extends Supabase Auth by storing additional user metadata for the BioSim Lab platform. Profiles are automatically created when users sign up and can be updated by users.

## Database Schema

### Table: `profiles`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE | User ID from Supabase Auth |
| `email` | text | nullable | User email (copied from auth.users) |
| `full_name` | text | NOT NULL | User's full name |
| `university` | text | NOT NULL | User's university/institution |
| `program_department` | text | NOT NULL | User's program or department |
| `year_of_study` | text | nullable, CHECK constraint | Academic year or position |
| `referral_source` | text | nullable, CHECK constraint | How user heard about the platform |
| `created_at` | timestamptz | DEFAULT now() | Profile creation timestamp |
| `updated_at` | timestamptz | DEFAULT now() | Last update timestamp |

### Constraints

**year_of_study** allowed values:
- `100L`, `200L`, `300L`, `400L`, `500L`
- `MSc`, `PhD`
- `Lecturer`, `Lab Technician`, `Staff`

**referral_source** allowed values:
- `WhatsApp Group`, `Lecturer`, `Friend`
- `Social Media`, `AMR-ITP`, `Noblekinmat`, `Other`

## Security (RLS)

Row Level Security is enabled with the following policies:

1. **SELECT Policy**: Users can view only their own profile
   - Condition: `auth.uid() = id`

2. **UPDATE Policy**: Users can update only their own profile
   - Condition: `auth.uid() = id`

3. **No INSERT Policy**: Profiles cannot be manually inserted
   - Created automatically via trigger

## Automation

### Profile Creation Trigger

When a new user is created in `auth.users`, a profile is automatically created:

**Function**: `handle_new_user()`
- Uses `SECURITY DEFINER` for elevated privileges
- Extracts data from `raw_user_meta_data`
- Prevents duplicate profiles with `ON CONFLICT DO NOTHING`

**Trigger**: `on_auth_user_created`
- Fires `AFTER INSERT` on `auth.users`
- Executes for each row

### Updated Timestamp Trigger

When a profile is updated, the `updated_at` field is automatically refreshed:

**Function**: `handle_updated_at()`
- Sets `updated_at` to current timestamp

**Trigger**: `on_profile_updated`
- Fires `BEFORE UPDATE` on `profiles`
- Executes for each row

## User Signup Flow

### 1. Frontend (SignupForm)

User provides:
- Full Name (required)
- Email (required)
- University (required)
- Program/Department (required)
- Year of Study (optional)
- Referral Source (optional)
- Password (required)

### 2. Auth Context

The signup function passes metadata to Supabase:

```typescript
await supabase.auth.signUp({
  email: data.email,
  password: data.password,
  options: {
    data: {
      full_name: data.fullName,
      university: data.university,
      program_department: data.programDepartment,
      year_of_study: data.yearOfStudy,
      referral_source: data.referralSource,
    }
  }
});
```

### 3. Database

1. Supabase Auth creates user in `auth.users`
2. Metadata stored in `raw_user_meta_data` column
3. Trigger fires and creates profile in `profiles` table
4. Profile data extracted from `raw_user_meta_data`

## Profile Service

### Location
`/src/services/profileService.ts`

### Functions

#### `getProfile(userId: string)`
Fetches a user's profile by ID.

```typescript
const { data, error } = await getProfile(userId);
```

#### `updateProfile(userId: string, updates: ProfileUpdateData)`
Updates a user's profile with the provided data.

```typescript
const { data, error } = await updateProfile(userId, {
  full_name: 'New Name',
  university: 'New University',
});
```

### TypeScript Types

```typescript
interface Profile {
  id: string;
  email: string | null;
  full_name: string;
  university: string;
  program_department: string;
  year_of_study: string | null;
  referral_source: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileUpdateData {
  full_name?: string;
  university?: string;
  program_department?: string;
  year_of_study?: string | null;
  referral_source?: string | null;
}
```

## Usage Examples

### Fetching Current User Profile

```typescript
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../services/profileService';

function MyComponent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      getProfile(user.id).then(({ data, error }) => {
        if (data) setProfile(data);
      });
    }
  }, [user]);

  return <div>{profile?.full_name}</div>;
}
```

### Updating User Profile

```typescript
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/profileService';

async function handleUpdate() {
  const { user } = useAuth();

  const { data, error } = await updateProfile(user.id, {
    university: 'University of Ibadan',
    year_of_study: '300L',
  });

  if (error) {
    console.error('Update failed:', error);
  } else {
    console.log('Profile updated:', data);
  }
}
```

## Migration File

**Location**: `/supabase/migrations/create_profiles_table.sql`

The migration includes:
- Table creation with constraints
- RLS policies
- Trigger functions
- Triggers on auth.users and profiles

## Testing Checklist

- [ ] New user signup creates profile automatically
- [ ] Profile contains correct data from signup form
- [ ] User can view their own profile
- [ ] User can update their own profile
- [ ] User cannot view other users' profiles
- [ ] User cannot update other users' profiles
- [ ] User cannot manually insert profiles
- [ ] `updated_at` timestamp updates on profile changes
- [ ] Duplicate profiles are prevented
- [ ] Profile is deleted when auth user is deleted (CASCADE)

## Future Enhancements

Potential additions:
- Profile picture/avatar support
- Additional academic information (graduation year, research interests)
- Public profile visibility settings
- Profile completion percentage
- Activity tracking (last login, simulation counts)
- Email notification preferences
