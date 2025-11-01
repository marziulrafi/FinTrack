import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "./dbConnect";
import User from "../models/User";

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new Error("Missing email or password");
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() }).lean();
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(password, user.passwordHash || "");
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return { id: String(user._id), name: user.name || "", email: user.email, image: user.image || null };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }

      if (account?.provider === "google" && profile?.email) {
        await dbConnect();
        const email = String(profile.email).toLowerCase();
        let dbUser = await User.findOne({ email }).lean();

        if (!dbUser) {
          const newDoc = await User.create({
            name: profile.name || "",
            email,
            image: profile.picture || profile.image,
          });
          dbUser = newDoc.toObject();
        }

        token.id = token.id || String(dbUser._id);
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
