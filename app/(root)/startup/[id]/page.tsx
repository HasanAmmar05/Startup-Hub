import { Suspense } from "react"
import { auth } from "@/auth"
import { client } from "@/sanity/lib/client"
import { writeClient } from "@/sanity/lib/write-client"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { EyeIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import markdownit from "markdown-it"

const md = markdownit()

interface Startup {
  _id: string
  title: string
  description: string
  _createdAt: string
  image: string
  category: string
  pitch: string
  views: number
  author: {
    _id: string
    name: string
    image: string
    bio: string
    username: string
  }
}

// Separate component for content rendering with suspense
function PitchContent({ content }: { content: string }) {
  const parsedContent = md.render(content || "")

  if (!parsedContent) {
    return <p className="no-result">No details provided</p>
  }

  return (
    <article className="prose max-w-4xl font-work-sans break-all" dangerouslySetInnerHTML={{ __html: parsedContent }} />
  )
}

// Separate component for view counter with suspense
function ViewCounter({ id, initialViews }: { id: string; initialViews: number }) {
  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
      <EyeIcon className="w-5 h-5 text-primary" />
      <p className="text-16-medium font-medium">{initialViews} views</p>
    </div>
  )
}

export default async function StartupPage({
  params,
}: {
  params: { id: string }
}) {
  if (!params?.id || typeof params.id !== "string") {
    console.error(`Invalid startup ID provided: ${params?.id}`)
    return notFound()
  }

  try {
    // Fetch startup data
    const startupData = await client.fetch<Startup | null>(
      `*[_type == "startup" && _id == $id][0]{
        _id,
        title,
        description,
        _createdAt,
        image,
        category,
        pitch,
        views,
        "author": author->{
          _id,
          name,
          image,
          bio,
          username
        }
      }`,
      { id: params.id },
    )

    if (!startupData) {
      console.error(`No startup found with ID: ${params.id}`)
      return notFound()
    }

    // Increment views directly on the server
    await writeClient
      .patch(params.id)
      .set({ views: (startupData.views || 0) + 1 })
      .commit()
      .catch((error) => console.error("Error incrementing views:", error))

    const session = await auth()

    // Fetch related startups (editor picks) - simplified for this example
    const editorPicks = await client.fetch<Startup[]>(
      `*[_type == "startup" && _id != $id][0...3]{
        _id,
        title,
        description,
        _createdAt,
        image,
        category,
        views
      }`,
      { id: params.id },
    )

    return (
      <>
        <section className="pink_container !min-h-[230px]">
          <p className="tag">{formatDate(startupData._createdAt)}</p>
          <h1 className="heading">{startupData.title}</h1>
          <p className="sub-heading !max-w-5xl">{startupData.description}</p>
        </section>

        <section className="section_container">
          {/* Image with priority loading for LCP optimization */}
          <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden">
            <Image
              src={startupData.image || "/placeholder.svg?height=400&width=800"}
              alt={startupData.title}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-5 mt-10 max-w-4xl mx-auto">
            <div className="flex justify-between items-center gap-5">
              <div className="flex items-center gap-5">
                {startupData.author && (
                  <Link href={`/user/${startupData.author._id}`} className="flex gap-2 items-center">
                    <div className="relative w-16 h-16">
                      <Image
                        src={startupData.author.image || "/placeholder.svg?height=64&width=64"}
                        alt={startupData.author.name}
                        width={64}
                        height={64}
                        className="rounded-full drop-shadow-lg object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-20-medium">{startupData.author.name}</p>
                      <p className="text-16-medium !text-black-300">
                        @{startupData.author.username || startupData.author.name.toLowerCase().replace(/\s+/g, "")}
                      </p>
                    </div>
                  </Link>
                )}
                <p className="category-tag">{startupData.category}</p>
              </div>

              <Suspense fallback={<Skeleton className="h-10 w-28 rounded-full" />}>
                <ViewCounter id={params.id} initialViews={startupData.views + 1} />
              </Suspense>
            </div>

            <h3 className="text-30-bold">Pitch Details</h3>
            <Suspense fallback={<Skeleton className="h-40 w-full" />}>
              <PitchContent content={startupData.pitch} />
            </Suspense>
          </div>

          <hr className="divider" />

          {editorPicks.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <p className="text-30-semibold">Editor Picks</p>
              <ul className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {editorPicks.map((post, i) => (
                  <li key={i} className="card">
                    <Link href={`/startup/${post._id}`}>
                      <div className="relative w-full aspect-video rounded-t-lg overflow-hidden">
                        <Image
                          src={post.image || "/placeholder.svg?height=200&width=300"}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-18-semibold line-clamp-1">{post.title}</h3>
                        <p className="text-14-regular text-gray-600 line-clamp-2 mt-2">{post.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-12-medium bg-gray-100 px-2 py-1 rounded">{post.category}</span>
                          <div className="flex items-center gap-1">
                            <EyeIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-12-medium">{post.views || 0}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </>
    )
  } catch (error) {
    console.error("Error fetching startup:", error)
    return (
      <div className="section_container">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className="heading">Something went wrong</h2>
          <p className="sub-heading mt-4">We couldn't load the startup details. Please try again later.</p>
          <Link href="/" className="mt-8 inline-block px-6 py-3 rounded-lg bg-primary text-white">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }
}

