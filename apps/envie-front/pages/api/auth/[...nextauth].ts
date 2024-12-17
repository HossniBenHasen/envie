import * as jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  session: {
    maxAge: 60 * 60,
  },
  pages: {
    signIn: "/Login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any, req: any) {
        const res = await fetch(process.env.URL_AUTH_API + "auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();

        if (res.ok && user) {
          return user;
        }

        return null;
      },

    })
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token = jwt.decode(user.access_token);
        token.access_token = user.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.token = token;
      return session;
    },
  },
}

export default NextAuth(authOptions);
