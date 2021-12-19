import NextAuth from "next-auth";
import SlackProvider from "next-auth/providers/slack";

export default NextAuth({
  providers: [
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID || "",
      clientSecret: process.env.SLACK_CLIENT_SECRET || "",
      idToken: true,
    }),
  ],

  pages: {
    signIn: "/",
    signOut: "/home",
  },
  // https://github.com/nextauthjs/next-auth/discussions/1775
  callbacks: {
    async session({ session, token }) {
      // session.user = token.user;
      // session.accessToken = token.accessToken;
      // session.error = token.error;

      console.log("SESSION: ", session);
      console.log("TOKEN: ", token);

      return session;
    },
    async jwt({ token, user, account, ...huh }) {
      console.log("TOKEN2: ", token);

      return token;
    },
  },
});

// https://next-auth.js.org/tutorials/refresh-token-rotation
// https://github.com/nextauthjs/next-auth-refresh-token-example
