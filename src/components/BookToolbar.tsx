"use client";

import { Sliders, Xmark } from "@gravity-ui/icons";
import { Button, Dropdown, Header, Label, SearchField, Separator } from "@heroui/react";
import type { Selection } from "@heroui/react";
import { ALL, BookQuery, DEFAULT_QUERY, SORT_OPTIONS, SortKey } from "@/lib/bookQuery";

interface BookToolbarProps {
  query: BookQuery;
  onQueryChange: (query: BookQuery) => void;
  authors: string[];
  genres: string[];
  resultCount: number;
  totalCount: number;
}

/** Single-select menus report a Set; take its only key. */
const firstKey = (selection: Selection) =>
  selection === "all" ? undefined : (selection.values().next().value as string | undefined);

export default function BookToolbar({
  query,
  onQueryChange,
  authors,
  genres,
  resultCount,
  totalCount,
}: BookToolbarProps) {
  const update = (patch: Partial<BookQuery>) => onQueryChange({ ...query, ...patch });

  const activeFilterCount = Number(query.author !== ALL) + Number(query.genre !== ALL);
  const sortLabel = SORT_OPTIONS.find((option) => option.key === query.sort)?.label;
  const isFiltered = query.search.trim() !== "" || activeFilterCount > 0;

  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <SearchField
          aria-label="Search books"
          className="min-w-0 flex-1"
          value={query.search}
          onChange={(search) => update({ search })}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input className="w-full" placeholder="Search by title, author, or ISBN" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <Dropdown>
          <Button variant="secondary" aria-label="Sort and filter books">
            <Sliders className="size-4" />
            <span className="hidden sm:inline">Sort &amp; filter</span>
            {activeFilterCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-accent text-xs text-accent-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <Dropdown.Popover className="min-w-[240px]" placement="bottom end">
            <Dropdown.Menu
              aria-label="Sort and filter"
              onAction={(key) => {
                if (key === "reset") onQueryChange({ ...DEFAULT_QUERY, search: query.search });
              }}
            >
              <Dropdown.Section
                selectionMode="single"
                disallowEmptySelection
                selectedKeys={new Set([query.sort])}
                onSelectionChange={(selection) => {
                  const sort = firstKey(selection) as SortKey | undefined;
                  if (sort) update({ sort });
                }}
              >
                <Header>Sort by</Header>
                {SORT_OPTIONS.map((option) => (
                  <Dropdown.Item key={option.key} id={option.key} textValue={option.label}>
                    <Dropdown.ItemIndicator type="dot" />
                    <Label>{option.label}</Label>
                  </Dropdown.Item>
                ))}
              </Dropdown.Section>
              <Separator />
              <Dropdown.Section>
                <Header>Filter by</Header>
                <FilterSubmenu
                  id="author"
                  label="Author"
                  allLabel="All authors"
                  options={authors}
                  value={query.author}
                  onChange={(author) => update({ author })}
                />
                <FilterSubmenu
                  id="genre"
                  label="Genre"
                  allLabel="All genres"
                  options={genres}
                  value={query.genre}
                  onChange={(genre) => update({ genre })}
                />
              </Dropdown.Section>
              <Separator />
              <Dropdown.Item id="reset" textValue="Reset sort and filters">
                <Label>Reset sort &amp; filters</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>

      <div className="flex min-h-8 flex-wrap items-center gap-2 text-sm text-muted">
        <span aria-live="polite">
          {isFiltered ? `Showing ${resultCount} of ${totalCount} books` : `${totalCount} books`}
          {query.sort !== "shelf" && ` · ${sortLabel}`}
        </span>
        {query.author !== ALL && (
          <ActiveFilter label={`Author: ${query.author}`} onClear={() => update({ author: ALL })} />
        )}
        {query.genre !== ALL && (
          <ActiveFilter label={`Genre: ${query.genre}`} onClear={() => update({ genre: ALL })} />
        )}
      </div>
    </div>
  );
}

interface FilterSubmenuProps {
  id: string;
  label: string;
  allLabel: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

function FilterSubmenu({ id, label, allLabel, options, value, onChange }: FilterSubmenuProps) {
  return (
    <Dropdown.SubmenuTrigger>
      <Dropdown.Item id={id} textValue={label}>
        <Label>{label}</Label>
        <span className="ms-auto max-w-32 truncate text-xs text-muted">
          {value === ALL ? "All" : value}
        </span>
        <Dropdown.SubmenuIndicator />
      </Dropdown.Item>
      <Dropdown.Popover className="max-h-80 min-w-[220px] overflow-y-auto">
        <Dropdown.Menu
          aria-label={`Filter by ${label.toLowerCase()}`}
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={new Set([value])}
          onSelectionChange={(selection) => {
            const next = firstKey(selection);
            if (next) onChange(next);
          }}
        >
          <Dropdown.Item id={ALL} textValue={allLabel}>
            <Dropdown.ItemIndicator />
            <Label>{allLabel}</Label>
          </Dropdown.Item>
          {options.map((option) => (
            <Dropdown.Item key={option} id={option} textValue={option}>
              <Dropdown.ItemIndicator />
              <Label>{option}</Label>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.SubmenuTrigger>
  );
}

function ActiveFilter({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <Button size="sm" variant="tertiary" onPress={onClear} aria-label={`Remove filter ${label}`}>
      {label}
      <Xmark className="size-3.5" />
    </Button>
  );
}
