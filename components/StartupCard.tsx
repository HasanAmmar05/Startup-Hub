"use client";

import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Author, Startup } from "@/sanity/types";
import { Skeleton } from "@/components/ui/skeleton";
import StartupImage from "@/components/StartupImage";
import AuthorImage from "@/components/AuthorImage";

export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author };

const StartupCard = ({
  post,
  currentUserId,
}: {
  post: StartupTypeCard;
  currentUserId?: string;
}) => {
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

  // Debug image URLs
  console.log(`StartupCard - ${title} - Image:`, image);
  console.log(`StartupCard - ${title} - Author:`, author);

  const formattedDate = _createdAt ? formatDate(_createdAt) : "Invalid Date";

  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup-card_date">{formattedDate}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-sm font-medium">{views}</span>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          {author?._id && (
            <Link href={`/user/${author._id}`}>
              <p className="text-base font-medium line-clamp-1">
                {author?.name || "Unknown Author"}
              </p>
            </Link>
          )}
          <Link href={`/startup/${_id}`}>
            <h3 className="text-2xl font-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        {author?._id && (
          <Link href={`/user/${author._id}`}>
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
              <AuthorImage
                src={author.image || ""}
                alt={author.name || "Author"}
                fallbackInitial={author?.name?.charAt(0) || "U"}
              />
            </div>
          </Link>
        )}
      </div>

      <Link href={`/startup/${_id}`}>
        <p className="startup-card_desc">{description}</p>
        <div className="startup-card_img">
          <StartupImage
            src={image || ""}
            alt={title}
            className="w-full h-[200px]"
          />
        </div>
      </Link>

      <div className="flex-between gap-3 mt-5">
        {category && (
          <Link href={`/?query=${category.toLowerCase()}`}>
            <p className="text-base font-medium">{category}</p>
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
