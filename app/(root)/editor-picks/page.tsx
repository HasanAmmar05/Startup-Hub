import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";

export default async function EditorPicksPage() {
  const session = await auth();

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
    "Editor picks page - Fetched editor picks:",
    JSON.stringify(editorPicks.slice(0, 1), null, 2)
  );

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">Editor Picks</h1>
        <p className="sub-heading !max-w-3xl">
          Curated selection of the most promising and innovative startups
        </p>
      </section>

      <section className="section_container">
        {editorPicks.length > 0 ? (
          <ul className="mt-7 card_grid">
            {editorPicks.map((post: StartupTypeCard) => (
              <StartupCard
                key={post?._id}
                post={post}
                currentUserId={session?.user?.id}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center py-20">
            <p className="text-24-medium">
              No editor picks available at the moment
            </p>
            <p className="text-16-regular text-gray-500 mt-2">
              Check back later for our curated selection
            </p>
          </div>
        )}
      </section>
    </>
  );
}
