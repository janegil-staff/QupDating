import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
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
          throw new Error("Missing email or password");
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) {
          console.log("User not found or missing password");
          throw new Error("User not found or missing password");
        }
        if (user.isBanned) {
          throw new Error("Your account has been banned");
        }

        await User.findByIdAndUpdate(user._id, { lastSeen: new Date() });

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          console.log("Invalid password");
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          role: user.role,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          isVerified: user.isVerified,
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
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.profileImage = user.profileImage || null;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.profileImage = token.profileImage || null;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },

  // Optional: enable debug logging
  // debug: true,
};
