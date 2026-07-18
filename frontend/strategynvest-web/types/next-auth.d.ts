import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username?: string
      email?: string | null
      name?: string | null
      image?: string | null
      roles?: string[]
    }
  }

  interface User {
    username?: string
    roles?: string[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username?: string
    roles?: string[]
  }
}
