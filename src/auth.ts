import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

/**
 * Auth.js (NextAuth v5) configuration
 * Uses Vercel environment variables for secure backend:
 * - AUTH_SECRET: Required for encryption (generate: npx auth secret)
 * - ADMIN_EMAIL: Admin login email
 * - ADMIN_PASSWORD: Admin login password
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
          console.error('Auth: ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment');
          return null;
        }

        if (
          credentials?.email === email &&
          credentials?.password === password
        ) {
          return { id: 'admin', email, name: 'Admin' };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const isAdmin = request.nextUrl.pathname.startsWith('/admin');
      const isAdminApi = request.nextUrl.pathname.startsWith('/api/admin');
      const isLoginPage = request.nextUrl.pathname === '/admin/login';

      if (isLoginPage) {
        return true; // Allow access to login page
      }
      if ((isAdmin || isAdminApi) && !auth) {
        return false; // Redirect/block if not authenticated
      }
      return true;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  trustHost: true, // Required for Vercel
});
