"use server";

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import { revalidatePath } from "next/cache";

export async function createPitch(
  prevState: any,
  formData: FormData,
  pitch: string
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      console.error("No user ID in session");
      return {
        status: "ERROR",
        message: "Authentication required",
      };
    }

    const pitchData = {
      _type: "startup",
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      image: formData.get("link"),
      pitch: pitch,
      author: {
        _type: "reference",
        _ref: session.user.id,
      },
      _createdAt: new Date().toISOString(),
    };

    const response = await writeClient.create(pitchData);

    // Revalidate the home page and user profile
    revalidatePath("/");
    revalidatePath(`/user/${session.user.id}`);

    return {
      status: "SUCCESS",
      _id: response._id,
    };
  } catch (error) {
    console.error("Error creating pitch:", error);
    return {
      status: "ERROR",
      message: "Failed to create pitch",
    };
  }
}
