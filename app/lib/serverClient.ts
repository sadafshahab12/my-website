// lib/serverClient.ts

import { createClient } from "next-sanity";

export const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-01-01",
  token: process.env.SANITY_WRITE_TOKEN, // must have write permission
  useCdn: false,
});
