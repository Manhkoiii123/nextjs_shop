import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'

export const authOptions = {
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
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
      name: 'facebook',
      authorization: {
        params: {
          scope: 'email,public_profile'
        }
      }
    })
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async jwt({ token, account }: any) {
      if (account && account.provider) {
        token.provider = account.provider
      }

      if (account) {
        token.accessToken = account.access_token
      }

      return token
    },
    async session({ session, token, user }: any) {
      session.accessToken = token.accessToken
      session.provider = token.provider

      return session
    }
  }
}

export default NextAuth(authOptions)
