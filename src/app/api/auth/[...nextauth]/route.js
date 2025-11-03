import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });

          if (!res.ok) {

            return null;
          }

          const data = await res.json();
          const user = data?.user;
          const token = data?.token;

          if (!user) return null;
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image || "",
            backendToken: token || null,
          };
        } catch (err) {
          console.error("Credentials authorize error:", err);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
   async jwt({ token, user, account, profile }) {
      if (user) {
        if (user.backendToken) token.backendToken = user.backendToken;
        if (user.id) token.id = user.id;
        if (user.name) token.name = user.name;
        if (user.email) token.email = user.email;
        if (user.image) token.image = user.image;
      }
if (account && account.provider === "google" && profile) {
        try {
           const resp = await fetch(`${BACKEND_URL}/api/auth/oauth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile.email,
              name: profile.name || profile?.given_name || "",
              picture: profile.picture,
              googleId: profile.sub || profile.id,
            }),
          });

          if (resp.ok) {
            const json = await resp.json();
            if (json?.token) token.backendToken = json.token;
            if (json?.user) {
              token.id = json.user.id || json.user._id;
              token.name = json.user.name;
              token.email = json.user.email;
              token.image = json.user.image || "";
            }
          } else {
            console.error("Backend oauth/google failed", await resp.text());
          }
        } catch (err) {
          console.error("Error calling backend oauth/google:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = session.user || {};
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.image;
      session.user.backendToken = token.backendToken;
      return session;
    },
  },

  pages: { signIn: "/get-started" },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
