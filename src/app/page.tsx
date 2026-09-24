"use client";

import { useState } from "react";
import { Plus } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import data from "../../public/data.json";
import BookCard from "@/components/BookCard";
import BookDialog from "@/components/BookDialog";
import { BookFormValues } from "@/components/BookForm";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Book } from "@/types/book";

/** Covers in the first grid row are preloaded so the largest paint is not delayed. */
const ABOVE_THE_FOLD_COUNT = 4;

export default function Page() {
  const [books, setBooks] = useState<Book[]>(data as Book[]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);

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

  const handleDeleteBook = (id: number) => {
    if (confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((book) => book.id !== id));
    }
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book, index) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={openEditDialog}
              onDelete={handleDeleteBook}
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
    </>
  );
}
