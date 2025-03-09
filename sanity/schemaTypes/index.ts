import { type SchemaTypeDefinition } from "sanity";

import { Author } from "@/sanity/schemaTypes/Author";
import { startup } from "@/sanity/schemaTypes/startup";
import { playlist } from "@/sanity/schemaTypes/playlist";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [Author, startup, playlist],
};