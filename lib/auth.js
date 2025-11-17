import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-post", type: "text" },
        password: { label: "Passord", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials:", credentials);
          return null;
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) {
          console.log("User not found or missing password");
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          console.log("Invalid password");
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          profileImage: user.profileImage
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login", // optional: redirect errors to login
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.profileImage = user.profileImage || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.profileImage = token.profileImage || null;
      }
      return session;
    },
  },

  // Optional: enable debug logging
  // debug: true,
};
