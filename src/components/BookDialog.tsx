"use client";

import { Book as BookIcon } from "@gravity-ui/icons";
import { Button, Modal } from "@heroui/react";
import { Book } from "@/types/book";
import BookForm, { BookFormValues } from "./BookForm";

interface BookDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  /** When set, the dialog edits this book; otherwise it adds a new one. */
  book?: Book;
  onSubmit: (values: BookFormValues) => void;
}

const FORM_ID = "book-form";

export default function BookDialog({ isOpen, onOpenChange, book, onSubmit }: BookDialogProps) {
  const isEditing = book !== undefined;

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} variant="blur">
      <Modal.Container size="lg" placement="auto">
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <BookIcon className="size-5" />
            </Modal.Icon>
            <Modal.Heading>{isEditing ? "Edit book" : "Add a new book"}</Modal.Heading>
            <p className="mt-1.5 text-sm leading-5 text-muted">
              {isEditing
                ? `Update the details for “${book.title}”.`
                : "Fill in the details below to add a book to the shelf."}
            </p>
          </Modal.Header>
          <Modal.Body>
            {/* Keyed so switching between books always starts from that book's values. */}
            <BookForm key={book?.id ?? "new"} id={FORM_ID} book={book} onSubmit={onSubmit} />
          </Modal.Body>
          <Modal.Footer>
            <Button slot="close" variant="tertiary">
              Cancel
            </Button>
            <Button type="submit" form={FORM_ID}>
              {isEditing ? "Save changes" : "Add book"}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
