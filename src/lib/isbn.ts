/**
 * ISBN validation with checksum verification.
 * Accepts ISBN-10 and ISBN-13, with or without hyphens/spaces.
 */

/** Strips hyphens and spaces and upper-cases the check character. */
export function normalizeIsbn(value: string): string {
  return value.replace(/[-\s]/g, "").toUpperCase();
}

function isValidIsbn10(isbn: string): boolean {
  if (!/^\d{9}[\dX]$/.test(isbn)) return false;
  // Weighted sum: digits 1..10 multiplied by 10..1, must be divisible by 11.
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const char = isbn[i];
    const digit = char === "X" ? 10 : Number(char);
    sum += digit * (10 - i);
  }
  return sum % 11 === 0;
}

function isValidIsbn13(isbn: string): boolean {
  if (!/^\d{13}$/.test(isbn)) return false;
  // Alternating weights of 1 and 3; the total must be divisible by 10.
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += Number(isbn[i]) * (i % 2 === 0 ? 1 : 3);
  }
  return sum % 10 === 0;
}

export function isValidIsbn(value: string): boolean {
  const isbn = normalizeIsbn(value);
  return isbn.length === 10 ? isValidIsbn10(isbn) : isValidIsbn13(isbn);
}

/**
 * Returns a human-readable error, or null when the ISBN is valid.
 * Written for use as a HeroUI/React Aria `validate` callback.
 */
export function validateIsbn(value: string): string | null {
  const isbn = normalizeIsbn(value);
  if (isbn.length === 0) return "ISBN is required.";
  if (isbn.length !== 10 && isbn.length !== 13) {
    return "ISBN must be 10 or 13 characters (hyphens are allowed).";
  }
  if (isbn.length === 10 && !/^\d{9}[\dX]$/.test(isbn)) {
    return "ISBN-10 must be 9 digits followed by a digit or X.";
  }
  if (isbn.length === 13 && !/^\d{13}$/.test(isbn)) {
    return "ISBN-13 must contain digits only.";
  }
  if (!isValidIsbn(isbn)) return "Check digit does not match. Please re-check the ISBN.";
  return null;
}
