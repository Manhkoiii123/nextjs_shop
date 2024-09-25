import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: 'select_account'
        }
      },
      name: 'google'
    })
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token
      }

      return token
    },
    async session({ session, token, user }: any) {
      session.accessToken = token.accessToken

      return session
    }
  }
}

export default NextAuth(authOptions)
