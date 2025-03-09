import createImageUrlBuilder from "@sanity/image-url"
import { dataset, projectId } from "../env"

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
})

export const urlForImage = (source: any) => {
  // Handle direct URL strings
  if (typeof source === "string") {
    // If it's already a URL, return it directly
    if (source.startsWith("http")) {
      return {
        url: () => source,
      }
    }

    // If it's a Sanity asset ID, try to build a URL
    if (source.startsWith("image-")) {
      return imageBuilder.image(source)
    }

    // Otherwise, return the string as is
    return {
      url: () => source,
    }
  }

  // Handle Sanity image references
  if (source && typeof source === "object") {
    return imageBuilder.image(source)
  }

  // Return null for invalid sources
  return null
}

