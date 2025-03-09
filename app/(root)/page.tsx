import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { auth } from "@/auth";
import Link from "next/link";
import { client } from "@/sanity/lib/client";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const session = await auth();

  console.log("session id :" + session?.id);

  // Use direct query like in UserStartups
  const posts = await client.fetch(
    `*[_type == "startup" && (
      !defined($search) || 
      title match "*" + $search + "*" || 
      category match "*" + $search + "*" ||
      author->name match "*" + $search + "*"
    )] | order(_createdAt desc) {
      _id,
      _createdAt,
      title,
      description,
      views,
      image,
      category,
      "author": author->{
        _id,
        name,
        image
      }
    }`,
    { search: query || null }
  );

  console.log("Fetched posts:", JSON.stringify(posts.slice(0, 1), null, 2));

  // Fetch editor picks with direct query
  const editorPicksData = await client.fetch(
    `*[_type == "playlist" && slug.current == "editor-picks"][0]{
      _id,
      title,
      slug,
      select[]->{
        _id,
        _createdAt,
        title,
        description,
        image,
        category,
        views,
        "author": author->{
          _id,
          name,
          image
        }
      }
    }`
  );

  const editorPicks = editorPicksData?.select || [];
  console.log(
    "Fetched editor picks:",
    JSON.stringify(editorPicks.slice(0, 1), null, 2)
  );

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br />
          Connect With Entrepreneurs
        </h1>

        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual
          Competitions.
        </p>

        <SearchForm query={query} />
      </section>

      {/* Editor Picks Section */}
      {editorPicks.length > 0 && !query && (
        <section className="section_container">
          <div className="flex items-center justify-between">
            <p className="text-30-semibold">Editor Picks</p>
            <Link href="/editor-picks" className="text-primary hover:underline">
              View All
            </Link>
          </div>
          <ul className="mt-7 card_grid">
            {editorPicks.slice(0, 3).map((post: StartupTypeCard) => (
              <StartupCard
                key={post?._id}
                post={post}
                currentUserId={session?.user?.id}
              />
            ))}
          </ul>
        </section>
      )}

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard
                key={post?._id}
                post={post}
                currentUserId={session?.user?.id}
              />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>
    </>
  );
}
