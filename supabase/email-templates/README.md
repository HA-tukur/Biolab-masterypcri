# Supabase Email Templates

Professional, transactional email templates for BioSim Lab authentication flows.

## Templates

1. **email-verification.html** - Sent when users sign up and need to verify their email
2. **password-reset.html** - Sent when users request a password reset

## Design Principles

- Transactional style (GitHub/Stripe-like)
- Table-based layout for email client compatibility
- Inline CSS only
- Mobile-responsive (16px min font, 44px min button height)
- System fonts for reliability
- Brand color: #2D7A6E

## Setup Instructions

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Email Templates**
3. Select the template you want to customize:
   - "Confirm signup" → Use `email-verification.html`
   - "Reset password" → Use `password-reset.html`
4. Copy the HTML content from the respective file
5. Paste it into the template editor
6. Click **Save**

### Option 2: Supabase CLI (Advanced)

If using Supabase CLI with `supabase/config.toml`:

```toml
[auth.email.template.confirmation]
subject = "Verify your BioSim Lab account"
content_path = "./supabase/email-templates/email-verification.html"

[auth.email.template.recovery]
subject = "Reset your BioSim Lab password"
content_path = "./supabase/email-templates/password-reset.html"
```

Then run:
```bash
supabase db push
```

## Template Variables

Supabase provides these variables for use in templates:

- `{{ .ConfirmationURL }}` - The confirmation/reset link
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your application URL
- `{{ .Token }}` - Raw token (if needed for custom flows)

## Testing

Before deploying to production:

1. Test in multiple email clients (Gmail, Outlook, Apple Mail)
2. Test on mobile devices
3. Verify all links work correctly
4. Check that colors render consistently

## Customization

To maintain consistency with BioSim Lab branding:

- Brand green: `#2D7A6E`
- Dark text: `#1F2937`
- Body text: `#4B5563`
- Secondary text: `#6B7280`
- Light gray: `#9CA3AF`

Keep templates transactional - avoid marketing language, emojis, or excessive branding.
