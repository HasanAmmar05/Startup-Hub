import { client } from "@/sanity/lib/client"
import StartupCard from "./StartupCard"

interface UserStartupsProps {
  id: string
  currentUserId?: string
}

const UserStartups = async ({ id, currentUserId }: UserStartupsProps) => {
  if (!id || typeof id !== "string") {
    throw new Error(`No valid user ID provided: ${id}`)
  }

  try {
    const startups = await client.fetch(
      `*[_type == "startup" && author._ref == $userId] {
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
      { userId: id },
    )

    console.log("Fetched startups:", JSON.stringify(startups, null, 2))

    if (!startups?.length) {
      return <div className="w-full text-center text-muted-foreground">No startups found.</div>
    }

    return startups.map((startup: any) => (
      <StartupCard key={startup._id} post={startup} currentUserId={currentUserId} />
    ))
  } catch (error) {
    console.error("Error fetching user startups:", error)
    return <div className="w-full text-center text-red-500">Failed to load startups. Please try again later.</div>
  }
}

export default UserStartups

