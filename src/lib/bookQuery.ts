import { Book } from "@/types/book";

export type SortKey =
  | "shelf"
  | "date-desc"
  | "date-asc"
  | "title-asc"
  | "title-desc"
  | "rating-desc"
  | "rating-asc";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "shelf", label: "Shelf order" },
  { key: "date-desc", label: "Newest published" },
  { key: "date-asc", label: "Oldest published" },
  { key: "title-asc", label: "Title A–Z" },
  { key: "title-desc", label: "Title Z–A" },
  { key: "rating-desc", label: "Highest rated" },
  { key: "rating-asc", label: "Lowest rated" },
];

/** Sentinel for "no author/genre filter"; real values come from the books themselves. */
export const ALL = "__all__";

export interface BookQuery {
  search: string;
  sort: SortKey;
  author: string;
  genre: string;
}

export const DEFAULT_QUERY: BookQuery = { search: "", sort: "shelf", author: ALL, genre: ALL };

const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });

/** ISBNs are often typed with hyphens or spaces, so compare digits (and a trailing X) only. */
const normalizeIsbn = (value: string) => value.replace(/[^0-9x]/gi, "").toLowerCase();

function matchesSearch(book: Book, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (!term) return true;
  if (book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term)) {
    return true;
  }
  const isbnTerm = normalizeIsbn(term);
  return isbnTerm.length > 0 && normalizeIsbn(book.isbn).includes(isbnTerm);
}

const comparators: Record<Exclude<SortKey, "shelf">, (a: Book, b: Book) => number> = {
  // ISO dates (YYYY-MM-DD) sort correctly as strings.
  "date-desc": (a, b) => b.publicationDate.localeCompare(a.publicationDate),
  "date-asc": (a, b) => a.publicationDate.localeCompare(b.publicationDate),
  "title-asc": (a, b) => collator.compare(a.title, b.title),
  "title-desc": (a, b) => collator.compare(b.title, a.title),
  "rating-desc": (a, b) => b.rating - a.rating,
  "rating-asc": (a, b) => a.rating - b.rating,
};

export function applyBookQuery(books: Book[], query: BookQuery): Book[] {
  const result = books.filter(
    (book) =>
      matchesSearch(book, query.search) &&
      (query.author === ALL || book.author === query.author) &&
      (query.genre === ALL || book.genres.includes(query.genre))
  );
  // filter() already returned a copy, so sorting in place does not touch state.
  return query.sort === "shelf" ? result : result.sort(comparators[query.sort]);
}

/** Distinct, alphabetised values for the filter menus. */
export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort(collator.compare);
}
