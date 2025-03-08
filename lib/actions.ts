"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

export async function createPitch(prevState: any, formData: FormData, pitch: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const pitchData = {
      _type: "startup",
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"), // Now directly using the string value
      image: formData.get("link"),
      pitch: pitch,
      author: {
        _type: "reference",
        _ref: session.user.id
      }
    };

    const response = await writeClient.create(pitchData);
    return { ...prevState, status: "SUCCESS", _id: response._id };
  } catch (error) {
    console.error("Error creating pitch:", error);
    return { ...prevState, status: "ERROR", error: "Failed to create pitch" };
  }
}