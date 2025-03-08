import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  link: z.string().url("Please enter a valid URL"),
  pitch: z.string().min(50, "Pitch must be at least 50 characters")
});