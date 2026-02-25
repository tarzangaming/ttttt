# How to Change Backend (Admin) Login Password

Your admin login uses **environment variables** for the password. There is no "change password" page in the app — you change it by updating these variables.

---

## Variables Used

| Variable         | Purpose              |
|------------------|----------------------|
| `ADMIN_EMAIL`    | Admin login email    |
| `ADMIN_PASSWORD` | Admin login password |
| `AUTH_SECRET`    | NextAuth encryption (do not change unless rotating secrets) |

---

## Option 1: Change Password on Vercel (Production)

1. **Open Vercel Dashboard**  
   https://vercel.com/dashboard

2. **Select your project** (e.g. roofing / bennettconstruction).

3. **Go to Settings → Environment Variables**  
   - Click the project  
   - **Settings** tab  
   - **Environment Variables** in the sidebar

4. **Edit or add:**
   - **`ADMIN_PASSWORD`**  
     - If it exists: click the three dots → **Edit** → set a new strong password → Save  
     - If it doesn’t exist: **Add New** → Name: `ADMIN_PASSWORD`, Value: your new password → Save  

   - Optional: change **`ADMIN_EMAIL`** the same way if you want a new login email.

5. **Redeploy**  
   - **Deployments** tab  
   - Click the three dots on the latest deployment → **Redeploy**  
   - Or push a new commit to trigger a deploy  

   Environment variables are applied on the next deployment, so redeploy is required for the new password to take effect.

6. **Log in**  
   - Go to: `https://your-domain.com/admin/login`  
   - Use the **new** email and password.

---

## Option 2: Change Password Locally (.env)

For local development:

1. **Create or edit**  
   - Create `.env.local` in the project root if it doesn’t exist (same folder as `package.json`).

2. **Set (or update) these lines:**
   ```env
   AUTH_SECRET=your-auth-secret-here
   ADMIN_EMAIL=your-admin@example.com
   ADMIN_PASSWORD=your-new-password
   ```

3. **Restart the dev server**  
   - Stop it (Ctrl+C) and run:
   ```bash
   npm run dev
   ```

4. **Log in**  
   - Go to: `http://localhost:3000/admin/login`  
   - Use the email and password from `.env.local`.

---

## Password Tips

- Use a **strong password**: at least 12 characters, mix of letters, numbers, and symbols.
- **Do not** commit `.env` or `.env.local` to Git (they should be in `.gitignore`).
- If you think the password was exposed, change it in both Vercel and local `.env.local`, and optionally rotate `AUTH_SECRET` (then set the new value in Vercel and locally and redeploy).

---

## Quick Checklist (Vercel)

- [ ] Vercel → Project → **Settings** → **Environment Variables**
- [ ] Edit **ADMIN_PASSWORD** (and **ADMIN_EMAIL** if needed)
- [ ] **Redeploy** the project
- [ ] Log in at `/admin/login` with the new credentials

---

## Troubleshooting

**"Invalid credentials" after changing**  
- Ensure you **redeployed** on Vercel after changing env vars.  
- Check for typos in `ADMIN_EMAIL` and `ADMIN_PASSWORD` (no extra spaces).  
- On Vercel, confirm the variable is set for the right environment (Production/Preview/Development).

**Forgot current password**  
- Set a new `ADMIN_PASSWORD` (and `ADMIN_EMAIL` if you want) in Vercel (or `.env.local`), redeploy, then use the new credentials. There is no “forgot password” flow; changing the env vars is how you reset it.
