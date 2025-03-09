import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import UserStartups from "@/components/UserStartups";
import { Suspense } from "react";
import { ensureValidImageUrl } from "@/lib/utils";

interface User {
  name: string;
  image: string;
  username: string;
  bio: string;
}

export default async function Page({ params }: { params: { id: string } }) {
  // Validate id parameter
  if (!params?.id || typeof params.id !== "string") {
    console.error(`Invalid user ID provided: ${params?.id}`);
    return notFound();
  }

  try {
    // Fetch user data and auth session concurrently
    const [userData, session] = await Promise.all([
      client.fetch<User | null>(AUTHOR_BY_ID_QUERY, { id: params.id }),
      auth(),
    ]);

    // If no user data is found, return 404
    if (!userData) {
      console.error(`No user found with ID: ${params.id}`);
      return notFound();
    }

    // Ensure valid image URL
    const userImageUrl = ensureValidImageUrl(
      userData.image,
      "/user-placeholder.svg"
    );

    // Debug
    console.log("User profile image URL:", userData.image);
    console.log("Processed user profile image URL:", userImageUrl);

    return (
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {userData.name}
            </h3>
          </div>

          <Image
            src={userImageUrl}
            alt={userData.name}
            width={220}
            height={220}
            className="profile_image"
            priority
            unoptimized={true} // Bypass image optimization for external images
          />

          <p className="text-30-extrabold mt-7 text-center">
            @{userData.username}
          </p>
          <p className="mt-1 text-center text-14-normal">{userData.bio}</p>
        </div>

        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">
            {session?.user?.id === params.id ? "Your" : "All"} Startups
          </p>
          <Suspense fallback={<div>Loading startups...</div>}>
            <ul className="card_grid-sm">
              <UserStartups id={params.id} currentUserId={session?.user?.id} />
            </ul>
          </Suspense>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error in user page:", error);
    return notFound();
  }
}
