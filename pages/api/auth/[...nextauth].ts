import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials as any;
        const res = await axios.post("https://frontend-test-api.aircall.io/auth/login", { username, password });
        const user = res.data;

        if (user) {
          return user;
        } else return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token, user }) {
      session.user = token;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};



export default NextAuth(authOptions);
