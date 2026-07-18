import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

interface BackendUser {
  id: string
  username: string
  roles: string[]
}

async function findOrCreateBackendUser(
  email: string,
  name: string | null | undefined,
): Promise<BackendUser | null> {
  const username = email.split('@')[0]

  // 1. Try to create — succeeds for new users
  const createRes = await fetch(`${API}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      email,
      password: crypto.randomUUID(),
      roles: ['USER'],
    }),
  })

  if (createRes.ok) {
    const u = await createRes.json()
    return { id: String(u.id), username: u.username, roles: u.roles ?? ['USER'] }
  }

  // 2. User already exists — look up by email
  const searchRes = await fetch(`${API}/users?email=${encodeURIComponent(email)}`)
  if (searchRes.ok) {
    const list = await searchRes.json()
    if (Array.isArray(list) && list.length > 0) {
      const u = list[0]
      return { id: String(u.id), username: u.username, roles: u.roles ?? ['USER'] }
    }
  }

  return null
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null
        try {
          const res = await fetch(`${API}/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          })
          if (!res.ok) return null
          const u = await res.json()
          return {
            id: String(u.id),
            name: u.username,
            email: u.email,
            username: u.username,
            roles: u.roles ?? ['USER'],
          }
        } catch {
          return null
        }
      },
    }),
  ],
  pages: { signIn: '/signin' },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'credentials' && user) {
        token.id = user.id
        token.username = (user as Record<string, unknown>).username as string
        token.roles = (user as Record<string, unknown>).roles as string[]
        return token
      }
      // Only runs on the very first sign-in (account is only present then)
      if (account?.provider === 'google' && user?.email) {
        const backendUser = await findOrCreateBackendUser(user.email, user.name)
        if (backendUser) {
          token.id = backendUser.id
          token.username = backendUser.username
          token.roles = backendUser.roles
        }
        // If backend is unreachable, token.sub (Google sub) stays as the fallback id
      }
      return token
    },
    session({ session, token }) {
      // Use backend id if available, otherwise fall back to Google sub
      session.user.id = (token.id ?? token.sub) as string
      session.user.username = (token.username ?? session.user.name) as string
      session.user.roles = (token.roles ?? ['USER']) as string[]
      return session
    },
  },
})
