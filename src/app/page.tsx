"use client";

import { useMemo, useState } from "react";
import { Magnifier, Plus } from "@gravity-ui/icons";
import { Button, toast } from "@heroui/react";
import data from "../../public/data.json";
import BookCard from "@/components/BookCard";
import BookDialog from "@/components/BookDialog";
import DeleteBookDialog from "@/components/DeleteBookDialog";
import { BookFormValues } from "@/components/BookForm";
import BookToolbar from "@/components/BookToolbar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { applyBookQuery, BookQuery, DEFAULT_QUERY, uniqueSorted } from "@/lib/bookQuery";
import { Book } from "@/types/book";

/** Covers in the first grid row are preloaded so the largest paint is not delayed. */
const ABOVE_THE_FOLD_COUNT = 4;

const UNDO_TOAST_TIMEOUT_MS = 8000;

export default function Page() {
  const [books, setBooks] = useState<Book[]>(data as Book[]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
  const [bookToDelete, setBookToDelete] = useState<Book | undefined>(undefined);
  const [query, setQuery] = useState<BookQuery>(DEFAULT_QUERY);

  const visibleBooks = useMemo(() => applyBookQuery(books, query), [books, query]);
  const authors = useMemo(() => uniqueSorted(books.map((b) => b.author)), [books]);
  const genres = useMemo(() => uniqueSorted(books.flatMap((b) => b.genres)), [books]);

  const openAddDialog = () => {
    setSelectedBook(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (book: Book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedBook(undefined);
  };

  const handleAddBook = (values: BookFormValues) => {
    const book: Book = {
      ...values,
      id: Math.max(...books.map((b) => b.id), 0) + 1,
    };
    setBooks([...books, book]);
    closeDialog();
  };

  const handleUpdateBook = (values: BookFormValues) => {
    setBooks(
      books.map((book) =>
        book.id === selectedBook?.id ? { ...book, ...values } : book
      )
    );
    closeDialog();
  };

  const handleRateBook = (id: number, rating: number) => {
    setBooks((current) => current.map((book) => (book.id === id ? { ...book, rating } : book)));
  };

  const requestDelete = (id: number) => {
    setBookToDelete(books.find((book) => book.id === id));
  };

  const handleDeleteBook = (book: Book) => {
    // Keep the original position so Undo puts the book back where it was.
    const index = books.findIndex((b) => b.id === book.id);
    setBooks((current) => current.filter((b) => b.id !== book.id));
    setBookToDelete(undefined);

    const id = toast("Book deleted", {
      description: `“${book.title}” was removed from the shelf.`,
      variant: "success",
      // Longer than the default so there is time to reach Undo.
      timeout: UNDO_TOAST_TIMEOUT_MS,
      actionProps: {
        children: "Undo",
        variant: "tertiary",
        onPress: () => {
          setBooks((current) =>
            current.some((b) => b.id === book.id)
              ? current
              : [...current.slice(0, index), book, ...current.slice(index)]
          );
          toast.close(id);
        },
      },
    });
  };

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Book Gallery</h1>
            <p className="text-sm text-muted">
              {books.length} {books.length === 1 ? "book" : "books"} on the shelf
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onPress={openAddDialog}>
              <Plus className="size-4" />
              Add book
            </Button>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <BookToolbar
          query={query}
          onQueryChange={setQuery}
          authors={authors}
          genres={genres}
          resultCount={visibleBooks.length}
          totalCount={books.length}
        />

        {visibleBooks.length === 0 && books.length > 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-4 py-16 text-center">
            <Magnifier className="size-8 text-muted" />
            <p className="font-medium">No books match your search</p>
            <p className="text-sm text-muted">Try a different title, author, or ISBN, or clear the filters.</p>
            <Button variant="secondary" onPress={() => setQuery(DEFAULT_QUERY)}>
              Clear search &amp; filters
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleBooks.map((book, index) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={openEditDialog}
              onDelete={requestDelete}
              onRate={handleRateBook}
              priority={index < ABOVE_THE_FOLD_COUNT}
            />
          ))}
        </div>
      </main>

      <BookDialog
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        book={selectedBook}
        onSubmit={selectedBook ? handleUpdateBook : handleAddBook}
      />

      <DeleteBookDialog
        book={bookToDelete}
        onOpenChange={(open) => {
          if (!open) setBookToDelete(undefined);
        }}
        onConfirm={handleDeleteBook}
      />
    </>
  );
}
