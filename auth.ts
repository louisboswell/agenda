// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import type { NextAuthConfig } from "next-auth";
import { supabase, supabaseAdmin } from "@/lib/supabase"; // <-- Import your Supabase client

const providers: Provider[] = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

// The main NextAuth configuration object
const authConfig: NextAuthConfig = {
  providers,
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  callbacks: {
    /**
     * This callback is called whenever a user signs in.
     * We use it to create a user in our database if they don't exist yet.
     */
    async signIn({ user, account, profile }) {
      // user.id is the unique user ID from the provider (e.g., Google)
      if (!user.email || !user.id) {
        console.error("User email or ID is missing from provider.");
        return false; // Deny sign-in if essential info is missing
      }

      try {
        // 1. Check if the user already exists in your 'profiles' table
        const { data: existingUser, error: fetchError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", user.email)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 is the code for "No rows found", which is expected for new users.
          // Any other database error should prevent sign-in.
          console.error("Error fetching user from Supabase:", fetchError);
          return false;
        }

        // 2. If the user does not exist, create a new entry
        if (!existingUser) {
          console.log("New user detected. Creating profile...");
          const { error: insertError } = await supabaseAdmin.from("profiles").insert({
            id: user.id, // Use the provider's user ID as our primary key
            email: user.email,
            name: user.name,
            avatar_url: user.image,
          });

          if (insertError) {
            console.error("Error creating new user in Supabase:", insertError);
            return false; // Prevent sign-in on database error
          }
        } else {
          console.log("Existing user signed in:", user.email);
          // Optional: You could add logic here to update the user's name or avatar
          // if it has changed since their last login.
        }

        // 3. If all checks pass, allow the sign-in
        return true;
      } catch (error) {
        console.error("Unexpected error in signIn callback:", error);
        return false;
      }
    },

    /**
     * This callback is called whenever a session is checked.
     * We use it to add the user's unique ID to the session object.
     */
    async session({ session, token }) {
      // The 'sub' property on the token is the user's unique ID from the provider.
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);