import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, token } from "../env";

if (!token) {
  throw new Error("Sanity token is required");
}

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  stega: {
    enabled: false,
    studioUrl: null,
  },
});

// Validate token presence
if (!writeClient.config().token) {
  throw new Error("Write token not found");
}
