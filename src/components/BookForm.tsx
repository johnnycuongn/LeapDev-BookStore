"use client";

import {
  Description,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  NumberField,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";
import { FormEvent, useState } from "react";
import { Book } from "@/types/book";
import { CURRENCIES, DEFAULT_CURRENCY } from "@/lib/currencies";
import { normalizeIsbn, validateIsbn } from "@/lib/isbn";

export type BookFormValues = Omit<Book, "id">;

interface BookFormProps {
  /** Lets an external submit button (e.g. in a modal footer) target this form. */
  id: string;
  book?: Book;
  onSubmit: (values: BookFormValues) => void;
}

const MIN_DESCRIPTION_LENGTH = 10;
const today = () => new Date().toISOString().slice(0, 10);

function requiredText(label: string) {
  return (value: string) => (value.trim().length === 0 ? `${label} is required.` : null);
}

/** NumberField passes NaN for an empty input; the min/max checks stay with the field. */
function requiredNumber(label: string) {
  return (value: number) => (Number.isNaN(value) ? `${label} is required.` : null);
}

function validateCoverImage(value: string) {
  const trimmed = value.trim();
  if (trimmed.length === 0) return "Cover image is required.";
  if (trimmed.startsWith("/") || /^https?:\/\/\S+$/i.test(trimmed)) return null;
  return "Enter an http(s) URL or a path starting with “/”.";
}

function validatePublicationDate(value: string) {
  if (value.length === 0) return "Publication date is required.";
  if (Number.isNaN(Date.parse(value))) return "Enter a valid date.";
  if (value > today()) return "Publication date cannot be in the future.";
  return null;
}

export default function BookForm({ id, book, onSubmit }: BookFormProps) {
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  // NumberField treats NaN as "empty"; using it (instead of undefined) keeps the field controlled.
  const [price, setPrice] = useState<number>(book?.price ?? NaN);
  const [currency, setCurrency] = useState(book?.currency ?? DEFAULT_CURRENCY);
  const [isbn, setIsbn] = useState(book?.isbn ?? "");
  const [publisher, setPublisher] = useState(book?.publisher ?? "");
  const [publicationDate, setPublicationDate] = useState(book?.publicationDate ?? "");
  const [genres, setGenres] = useState(book?.genres.join(", ") ?? "");
  const [pages, setPages] = useState<number>(book?.pages ?? NaN);
  const [stock, setStock] = useState<number>(book?.stock ?? 0);
  const [coverImage, setCoverImage] = useState(book?.coverImage ?? "");
  const [description, setDescription] = useState(book?.description ?? "");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Only reached when every field passed validation.
    event.preventDefault();
    onSubmit({
      title: title.trim(),
      author: author.trim(),
      price,
      currency,
      isbn: normalizeIsbn(isbn),
      publisher: publisher.trim(),
      publicationDate,
      genres: genres
        .split(",")
        .map((genre) => genre.trim())
        .filter(Boolean),
      pages,
      stock,
      coverImage: coverImage.trim(),
      description: description.trim(),
      rating: book?.rating ?? 0,
    });
  };

  return (
    <Form id={id} onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TextField
        isRequired
        autoFocus
        name="title"
        value={title}
        onChange={setTitle}
        validate={requiredText("Title")}
        className="sm:col-span-2"
        fullWidth
      >
        <Label>Title</Label>
        <Input placeholder="e.g. Dune" />
        <FieldError />
      </TextField>

      <TextField
        isRequired
        name="author"
        value={author}
        onChange={setAuthor}
        validate={requiredText("Author")}
        fullWidth
      >
        <Label>Author</Label>
        <Input placeholder="e.g. Frank Herbert" />
        <FieldError />
      </TextField>

      <TextField
        isRequired
        name="isbn"
        value={isbn}
        onChange={setIsbn}
        validate={validateIsbn}
        fullWidth
      >
        <Label>ISBN</Label>
        <Input inputMode="numeric" placeholder="978-0-441-01359-3" />
        <Description>ISBN-10 or ISBN-13. Hyphens and spaces are fine.</Description>
        <FieldError />
      </TextField>

      <Select
        isRequired
        name="currency"
        value={currency}
        onChange={(key) => {
          if (key !== null && !Array.isArray(key)) setCurrency(String(key));
        }}
        placeholder="Choose a currency"
        fullWidth
      >
        <Label>Currency</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="max-h-72">
          <ListBox>
            {CURRENCIES.map((item) => (
              <ListBox.Item key={item.code} id={item.code} textValue={`${item.code} ${item.name}`}>
                <Label>{item.code}</Label>
                <Description>{item.name}</Description>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
        <FieldError />
      </Select>

      <NumberField
        isRequired
        name="price"
        value={price}
        onChange={(value) => setPrice(value ?? NaN)}
        validate={requiredNumber("Price")}
        minValue={0}
        step={0.01}
        formatOptions={{ style: "currency", currency, currencyDisplay: "narrowSymbol" }}
        fullWidth
      >
        <Label>Price</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input placeholder="0.00" />
          <NumberField.IncrementButton />
        </NumberField.Group>
        <FieldError />
      </NumberField>

      <TextField name="publisher" value={publisher} onChange={setPublisher} fullWidth>
        <Label>Publisher</Label>
        <Input placeholder="e.g. Chilton Books" />
      </TextField>

      <TextField
        isRequired
        name="publicationDate"
        type="date"
        value={publicationDate}
        onChange={setPublicationDate}
        validate={validatePublicationDate}
        fullWidth
      >
        <Label>Publication date</Label>
        <Input max={today()} />
        <FieldError />
      </TextField>

      <NumberField
        isRequired
        name="pages"
        value={pages}
        onChange={(value) => setPages(value ?? NaN)}
        validate={requiredNumber("Pages")}
        minValue={1}
        step={1}
        formatOptions={{ maximumFractionDigits: 0 }}
        fullWidth
      >
        <Label>Pages</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input placeholder="e.g. 412" />
          <NumberField.IncrementButton />
        </NumberField.Group>
        <FieldError />
      </NumberField>

      <NumberField
        isRequired
        name="stock"
        value={stock}
        onChange={(value) => setStock(value ?? NaN)}
        validate={requiredNumber("Stock")}
        minValue={0}
        step={1}
        formatOptions={{ maximumFractionDigits: 0 }}
        fullWidth
      >
        <Label>Stock</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input />
          <NumberField.IncrementButton />
        </NumberField.Group>
        <FieldError />
      </NumberField>

      <TextField name="genres" value={genres} onChange={setGenres} className="sm:col-span-2" fullWidth>
        <Label>Genres</Label>
        <Input placeholder="Science Fiction, Space Opera" />
        <Description>Separate genres with commas.</Description>
      </TextField>

      <TextField
        isRequired
        name="coverImage"
        value={coverImage}
        onChange={setCoverImage}
        validate={validateCoverImage}
        className="sm:col-span-2"
        fullWidth
      >
        <Label>Cover image</Label>
        <Input placeholder="/images/covers/dune.jpg or https://…" />
        <FieldError />
      </TextField>

      <TextField
        isRequired
        name="description"
        value={description}
        onChange={setDescription}
        validate={(value) =>
          value.trim().length < MIN_DESCRIPTION_LENGTH
            ? `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters.`
            : null
        }
        className="sm:col-span-2"
        fullWidth
      >
        <Label>Description</Label>
        <TextArea rows={3} placeholder="A short summary shown on the book card." />
        <FieldError />
      </TextField>
    </Form>
  );
}
