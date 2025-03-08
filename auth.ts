import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

export const { auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user: { name, email, image }, account, profile }) {
      const existingUser = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
        id: profile?.id
      });
      if (!existingUser) {
        // Create new author in Sanity
        await writeClient.create({
          _type: "author",
          _id: `author-${profile?.id}`, // Add this line to set explicit _id
          githubId: profile?.id, // Add this to link with GitHub ID
          name: name,
          username: profile?.login,
          email: email,
          image: image,
          bio: profile?.bio ?? ""
        });
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        // Query user by GitHub ID instead of profile.id
        const user = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: profile.id
        });
        token.id = user?._id; // Store Sanity document _id
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    }
  }
});
