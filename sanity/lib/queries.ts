import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY = defineQuery(`*[_type == "startup" && (
  !defined($search) || 
  title match "*" + $search + "*" || 
  category match "*" + $search + "*" ||
  author->name match "*" + $search + "*"
)] | order(_createdAt desc) {
  _id,
  title,
  description,
  _createdAt,
  "image": image.asset->url,
  "category": category->name,
  "author": author->{
    _id,
    name,
    "image": image.asset->url,
    bio
  },
  views
}`);

export const STARTUP_BY_ID_QUERY = `*[_type == "startup" && _id == $id][0]{
  _id,
  title,
  description,
  _createdAt,
  "image": image.asset->url,
  "category": category->name,
  pitch,
  views,
  "author": author->{
    _id,
    name,
    "image": image.asset->url,
    bio
  }
}`;

export const STARTUP_VIEWS_QUERY = defineQuery(`
    *[_type == "startup" && _id == $id][0]{
        _id, views
    }
`);

export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
*[_type == "author" && id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    "image": image.asset->url,
    bio
}
`);

export const AUTHOR_BY_ID_QUERY = defineQuery(`
*[_type == "author" && _id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    "image": image.asset->url,
    bio
}
`);

export const STARTUPS_BY_AUTHOR_QUERY =
  defineQuery(`*[_type == "startup" && author._ref == $id] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, 
    name, 
    "image": image.asset->url,
    bio
  }, 
  views,
  description,
  "category": category->name,
  "image": image.asset->url,
}`);

export const EDITOR_PICKS_QUERY = defineQuery(`*[_type == "playlist" && slug.current == "editor-picks"][0]{
  _id,
  title,
  slug,
  select[]->{
    _id,
    _createdAt,
    title,
    description,
    "image": image.asset->url,
    "category": category->name,
    views,
    "author": author->{
      _id,
      name,
      "image": image.asset->url,
      bio
    }
  }
}`);

export const PLAYLIST_BY_SLUG_QUERY = `*[_type == "playlist" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  select[]->{
    _id,
    _createdAt,
    title,
    description,
    "image": image.asset->url,
    "category": category->name,
    views,
    "author": author->{
      _id,
      name,
      "image": image.asset->url,
      bio
    }
  }
}`;
