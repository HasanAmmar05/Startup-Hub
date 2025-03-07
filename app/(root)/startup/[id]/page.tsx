import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import { STARTUP_BY_ID_QUERY, PLAYLIST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { SanityLive } from "@/sanity/lib/live";
import { writeClient } from "@/sanity/lib/write-client";

const md = markdownit();

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  try {
    // Fetch startup data
    const { data: startupData } = await sanityFetch({
      query: STARTUP_BY_ID_QUERY,
      params: { id },
    });

    if (!startupData) {
      return notFound();
    }

    // Increment views directly on the server
    await writeClient
      .patch(id)
      .set({ views: (startupData.views || 0) + 1 })
      .commit();

    // Fetch playlist data
    const { data: playlistData } = await sanityFetch({
      query: PLAYLIST_BY_SLUG_QUERY,
      params: { slug: "editor-picks-new" },
    });

    const editorPosts = playlistData?.select || [];
    const parsedContent = md.render(startupData?.pitch || "");

    return (
      <>
        <section className="pink_container !min-h-[230px]">
          <p className="tag">{formatDate(startupData?._createdAt)}</p>
          <h1 className="heading">{startupData.title}</h1>
          <p className="sub-heading !max-w-5xl">{startupData.description}</p>
        </section>

        <section className="section_container">
          <img
            src={startupData.image || "/placeholder.svg?height=400&width=800"}
            alt="thumbnail"
            className="w-full h-auto rounded-xl"
          />

          <div className="space-y-5 mt-10 max-w-4xl mx-auto">
            <div className="flex-between gap-5">
              {startupData.author && (
                <Link
                  href={`/user/${startupData.author._id}`}
                  className="flex gap-2 items-center mb-3"
                >
                  <Image
                    src={startupData.author.image || "/placeholder.svg?height=64&width=64"}
                    alt="avatar"
                    width={64}
                    height={64}
                    className="rounded-full drop-shadow-lg"
                  />
                  <div>
                    <p className="text-20-medium">{startupData.author.name}</p>
                    <p className="text-16-medium !text-black-300">
                      @{startupData.author.username}
                    </p>
                  </div>
                </Link>
              )}
              <p className="category-tag">{startupData.category}</p>
            </div>

            <h3 className="text-30-bold">Pitch Details</h3>
            {parsedContent ? (
              <article
                className="prose max-w-4xl font-work-sans break-all"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />
            ) : (
              <p className="no-result">No details provided</p>
            )}
          </div>

          <hr className="divider" />

          {editorPosts.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <p className="text-30-semibold">Editor Picks</p>
              <ul className="mt-7 card_grid-sm">
                {editorPosts.map((post: StartupTypeCard, i: number) => (
                  <StartupCard key={i} post={post} />
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10">
            <Suspense fallback={<Skeleton className="view_skeleton" />}>
              <View views={startupData.views || 0} />
            </Suspense>
          </div>
        </section>

        <SanityLive />
      </>
    );
  } catch (error) {
    console.error("Error fetching startup data:", error);
    return (
      <div className="section_container">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className="heading">Something went wrong</h2>
          <p className="sub-heading mt-4">
            We couldn't load the startup details. Please try again later.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block px-6 py-3 rounded-lg bg-primary text-white"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
}