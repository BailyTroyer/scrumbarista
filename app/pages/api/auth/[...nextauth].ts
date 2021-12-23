import NextAuth from "next-auth";
import SlackProvider from "next-auth/providers/slack";

export default NextAuth({
  providers: [
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID || "",
      clientSecret: process.env.SLACK_CLIENT_SECRET || "",
      idToken: true,
      profile(profile, tokens) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,

          // Auth tokens for calling API requests to Scrumbarista API
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
          tokenType: tokens.token_type,
          state: tokens.state,
        };
      },
    }),
  ],

  pages: {
    signIn: "/",
    signOut: "/home",
  },
  callbacks: {
    async session({ session, token }) {
      return { ...session, ...token };
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
  },
});

// https://github.com/nextauthjs/next-auth/discussions/1775
// https://next-auth.js.org/tutorials/refresh-token-rotation
// https://github.com/nextauthjs/next-auth-refresh-token-example
