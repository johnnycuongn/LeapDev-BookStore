"use client";

import { AlertDialog, Button } from "@heroui/react";
import { Book } from "@/types/book";

interface DeleteBookDialogProps {
  /** The book awaiting confirmation; the dialog is open while this is set. */
  book: Book | undefined;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (book: Book) => void;
}

export default function DeleteBookDialog({ book, onOpenChange, onConfirm }: DeleteBookDialogProps) {
  return (
    // Escape cancels (HeroUI disables it on alert dialogs by default); backdrop clicks still do not.
    <AlertDialog.Backdrop
      isOpen={book !== undefined}
      onOpenChange={onOpenChange}
      isKeyboardDismissDisabled={false}
      variant="blur"
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-[400px]">
          <AlertDialog.CloseTrigger />
          <AlertDialog.Header>
            <AlertDialog.Icon status="danger" />
            <AlertDialog.Heading>Delete this book?</AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <p>
              <strong className="text-foreground">{book?.title}</strong>
              {book?.author ? ` by ${book.author}` : ""} will be removed from the shelf.
            </p>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button slot="close" variant="tertiary">
              Cancel
            </Button>
            <Button
              slot="close"
              variant="danger"
              onPress={() => {
                if (book) onConfirm(book);
              }}
            >
              Delete
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
}
