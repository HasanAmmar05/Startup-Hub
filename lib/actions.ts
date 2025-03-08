"use server";

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPitch(
  prevState: any,
  formData: FormData,
  pitch: string
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
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
    };

    const response = await writeClient.create(pitchData);

    // Revalidate relevant paths
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
      message:
        error instanceof Error ? error.message : "Failed to create pitch",
    };
  }
}
