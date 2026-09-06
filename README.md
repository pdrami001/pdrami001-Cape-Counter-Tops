# StoneCraft Surfaces

Premium granite, quartz and sintered stone fabrication and installation catalogue. The public site is backed by Supabase products, while a server-protected admin workspace manages availability, featured status and product content.

## Technology Stack

- Next.js 16 App Router, React 19 and TypeScript
- Tailwind CSS 4, Lucide React and Radix UI primitives
- Supabase PostgreSQL, Auth, Row Level Security and Storage
- Vercel deployment

## Folder Structure

```text
src/app                  Next.js routes, metadata and auth callback
src/components           Public, product and admin UI
src/lib                   Supabase clients, data access, validation and constants
src/types                 Database and product types
supabase/migrations      Schema, RLS and Storage policies
supabase/seed.sql        Optional replaceable sample products
```

## Local Development

Requirements: Node.js 20.9 or newer and an npm-enabled Supabase project.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The public page also renders without Supabase credentials, showing its intentional empty catalogue state. Product data and admin actions require the environment variables below.

## Environment Variables

Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

These values are public browser configuration. Never use a secret or service-role key in a `NEXT_PUBLIC_*` variable, client component, Git commit or Vercel public environment variable.

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. In Project Settings > API, copy the Project URL and publishable key into `.env.local`.
3. Open the Supabase SQL Editor and run the files in `supabase/migrations/` in filename order.
4. Optionally run `supabase/seed.sql` to add the six sample products. The rows are safe to remove or replace later.
5. Confirm that Authentication > Providers > Email is enabled. Disable public sign-ups in Authentication > Settings; administrator accounts should be created manually.

### Creating The First Administrator

1. In Supabase Authentication > Users, select **Add user** and create the administrator email/password.
2. Copy that user's UUID.
3. In the SQL Editor, run:

```sql
insert into public.admin_users (user_id)
values ('PASTE_AUTH_USER_UUID_HERE');
```

Only UUIDs explicitly inserted into `admin_users` can write products. Being authenticated alone does not grant access. The dashboard also checks this table server-side before rendering.

### Storage

The third migration creates the public `product-images` bucket and restricts uploads, updates and deletes to listed administrators. The UI accepts JPG, PNG and WebP files up to 5 MB and creates collision-resistant object names. Seed products intentionally have no image, so the catalogue still works before uploads are configured.

## Running Migrations And Seed Data

Use the Supabase SQL Editor, or install the Supabase CLI and run `supabase db push` after linking the project. Run `supabase/seed.sql` only after the schema migrations. Do not commit credentials or a local Supabase config containing secrets.

## Admin Login And Inventory

Visit `/admin/login` directly; it is intentionally absent from public navigation. An authorised user is redirected to `/admin/dashboard`. A non-admin account is signed out after login and receives an authorization error. The dashboard supports product creation and editing with Zod validation, image upload, stock and featured toggles, confirmed deletion, and mobile-friendly inventory cards.

All mutations go through Supabase with RLS policies. The browser never receives a service-role credential.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

The build does not require a live Supabase connection. A real project URL/key are required to test catalogue reads, authentication, RLS, Storage and CRUD behavior.

## Vercel Deployment

1. Push this repository to the desired Git provider and import it into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` under Project Settings > Environment Variables for Preview and Production.
3. Deploy using the default Next.js build settings.
4. In Supabase Authentication > URL Configuration, add the Vercel production URL and `https://YOUR_DOMAIN/auth/callback` to the allowed redirect URLs as needed.
5. Add the production administrator UUID to `admin_users` in the production database, then test login and one complete CRUD flow.

## Replacing Branding And Contact Details

Update `src/lib/constants.ts` to change the editable placeholder brand name, navigation and WhatsApp number. The current number is `27710779244`, and every link is generated through `src/lib/whatsapp.ts` with URL-encoded messages. Replace the CSS-based sample surface treatments with supplied portfolio images when ready. No fake address, email or social profile is included.

## Troubleshooting

- **Catalogue says no products:** check both environment variables, confirm the migrations ran, and verify the public `products` SELECT policy.
- **Admin login rejects a valid user:** copy the Auth user UUID exactly into `public.admin_users`; an Auth account is not automatically an administrator.
- **Image upload fails:** confirm the `product-images` migration ran, the file is JPG/PNG/WebP and under 5 MB, and the signed-in user is in `admin_users`.
- **Vercel build fails from missing environment values:** the build is designed to complete without them, but check that the deployed project uses the same dependency lockfile and current Node version.

## Security Notes

RLS is enabled on every application table. Public users can only read catalogue products. Insert, update, delete and Storage writes require an explicit `admin_users` row. The server uses `auth.getUser()` for authorization checks rather than trusting a client session alone. `.env*` files are ignored by Git; `.env.example` contains placeholders only.
