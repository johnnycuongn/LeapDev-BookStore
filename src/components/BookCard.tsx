"use client";

import Image from "next/image";
import { Ellipsis, Pencil, TrashBin } from "@gravity-ui/icons";
import { Button, Card, Chip, Dropdown, Label } from "@heroui/react";
import { Book } from "@/types/book";
import { formatPrice } from "@/lib/currencies";
import StarRating from "./StarRating";

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  onRate: (id: number, rating: number) => void;
  /** Preload the cover; set for above-the-fold cards. */
  priority?: boolean;
}

const MAX_VISIBLE_GENRES = 2;

export default function BookCard({ book, onEdit, onDelete, onRate, priority = false }: BookCardProps) {
  const visibleGenres = book.genres.slice(0, MAX_VISIBLE_GENRES);
  const hiddenGenreCount = book.genres.length - visibleGenres.length;

  return (
    <Card className="group h-full">
      {/* Cover with the action menu overlaid in the top-right corner */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-default">
        <Image
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute end-2 top-2 z-10">
          <Dropdown>
            <Button
              isIconOnly
              aria-label={`Actions for ${book.title}`}
              size="sm"
              variant="secondary"
              className="bg-surface/85 shadow-sm backdrop-blur"
            >
              <Ellipsis className="size-4" />
            </Button>
            <Dropdown.Popover placement="bottom end">
              <Dropdown.Menu
                aria-label={`${book.title} actions`}
                onAction={(key) => {
                  if (key === "edit") onEdit(book);
                  if (key === "delete") onDelete(book.id);
                }}
              >
                <Dropdown.Item id="edit" textValue="Edit">
                  <Pencil className="size-4 shrink-0 text-muted" />
                  <Label>Edit</Label>
                </Dropdown.Item>
                <Dropdown.Item id="delete" textValue="Delete" variant="danger">
                  <TrashBin className="size-4 shrink-0 text-danger" />
                  <Label>Delete</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>

        <StarRating
          value={book.rating}
          onChange={(rating) => onRate(book.id, rating)}
          aria-label={`Rate ${book.title}`}
          tone="overlay"
          className="absolute bottom-2 start-2 z-10 rounded-full bg-black/25 px-1.5 py-1 backdrop-blur-sm"
        />
      </div>

      <Card.Header className="gap-0.5">
        <Card.Title className="line-clamp-1 text-base" title={book.title}>
          {book.title}
        </Card.Title>
        <Card.Description className="line-clamp-1">{book.author}</Card.Description>
      </Card.Header>

      <Card.Content className="gap-3">
        <p className="line-clamp-2 text-sm text-muted">{book.description}</p>
        {book.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {visibleGenres.map((genre) => (
              <Chip key={genre} size="sm" variant="soft">
                {genre}
              </Chip>
            ))}
            {hiddenGenreCount > 0 && (
              <Chip size="sm" variant="soft" aria-label={`${hiddenGenreCount} more genres`}>
                +{hiddenGenreCount}
              </Chip>
            )}
          </div>
        )}
      </Card.Content>

      <Card.Footer className="justify-between">
        <span className="text-base font-semibold text-foreground">
          {formatPrice(book.price, book.currency)}
        </span>
        <span className={`text-xs ${book.stock > 0 ? "text-muted" : "text-danger"}`}>
          {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
        </span>
      </Card.Footer>
    </Card>
  );
}
