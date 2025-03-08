import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Author, Startup } from "@/sanity/types";
import { Skeleton } from "@/components/ui/skeleton";
import StartupImage from "@/components/StartupImage";

export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author };

const StartupCard = ({ post }: { post: StartupTypeCard }) => {
  if (!post) return null;

  const {
    _createdAt,
    views = 0,
    author,
    title = "Untitled Startup",
    category = "Uncategorized",
    _id,
    image,
    description = "No description available",
  } = post;

  const formattedDate = _createdAt ? formatDate(_createdAt) : "Invalid Date";

  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup-card_date">{formattedDate}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          {author?._id && (
            <Link href={`/user/${author._id}`}>
              <p className="text-16-medium line-clamp-1">
                {author?.name || "Unknown Author"}
              </p>
            </Link>
          )}
          <Link href={`/startup/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        {author?._id && (
          <Link href={`/user/${author._id}`}>
            {author?.image ? (
              <Image
                src={author.image || "/placeholder.svg"}
                alt={author.name || "Author"}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                {author?.name?.charAt(0) || "U"}
              </div>
            )}
          </Link>
        )}
      </div>

      <Link href={`/startup/${_id}`}>
        <p className="startup-card_desc">{description}</p>
        {image ? (
          <StartupImage
            src={image || "/placeholder.svg"}
            alt={title}
            className="startup-card_img"
          />
        ) : (
          <div className="startup-card_img bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </Link>

      <div className="flex-between gap-3 mt-5">
        {category && (
          <Link href={`/?query=${category.toLowerCase()}`}>
            <p className="text-16-medium">{category}</p>
          </Link>
        )}
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export const StartupCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li key={cn("skeleton", index)}>
        <Skeleton className="startup-card_skeleton" />
      </li>
    ))}
  </>
);

export default StartupCard;
