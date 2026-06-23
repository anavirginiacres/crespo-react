"use client";

import {
  FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProductSuggestion } from "@/lib/products";
import styles from "./Nav.module.scss";

const MIN_CHARS = 3;
const DEBOUNCE_MS = 300;

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const listboxId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (pathname === "/productos") {
      setQuery(searchParams.get("q") ?? "");
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const term = query.trim();

    if (term.length < MIN_CHARS) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/products/suggest?q=${encodeURIComponent(term)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          setSuggestions([]);
          setIsOpen(false);
          return;
        }

        const data = (await response.json()) as ProductSuggestion[];
        setSuggestions(data);
        setIsOpen(true);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setSuggestions([]);
          setIsOpen(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    setIsOpen(false);

    if (!term) {
      router.push("/productos");
      return;
    }

    router.push(`/productos?q=${encodeURIComponent(term)}`);
  }

  function handleClear() {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);

    if (pathname === "/productos" && searchParams.get("q")) {
      router.push("/productos");
    }
  }

  function handleSuggestionSelect(suggestion: ProductSuggestion) {
    setQuery(suggestion.name);
    setIsOpen(false);
    router.push(`/productos/${suggestion.id}`);
  }

  const term = query.trim();
  const showSuggestions = isOpen && term.length >= MIN_CHARS;

  return (
    <div className={styles.searchWrapper} ref={wrapperRef}>
      <form className={styles.searchForm} onSubmit={handleSubmit} role="search">
        <label htmlFor="nav-search" className={styles.srOnly}>
          Buscar productos
        </label>
        <input
          id="nav-search"
          type="text"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (suggestions.length > 0 && term.length >= MIN_CHARS) {
              setIsOpen(true);
            }
          }}
          placeholder="Buscar productos..."
          className={styles.searchInput}
          autoComplete="off"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-controls={showSuggestions ? listboxId : undefined}
          aria-autocomplete="list"
        />
        {query.length > 0 && (
          <button
            type="button"
            className={styles.searchClear}
            onClick={handleClear}
            aria-label="Borrar búsqueda"
          >
            ×
          </button>
        )}
        <button type="submit" className={styles.searchButton} aria-label="Buscar">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </form>

      {showSuggestions && (
        <ul
          id={listboxId}
          className={styles.searchSuggestions}
          role="listbox"
          aria-label="Sugerencias de búsqueda"
        >
          {isLoading && suggestions.length === 0 && (
            <li className={styles.searchSuggestionStatus}>Buscando...</li>
          )}

          {!isLoading && suggestions.length === 0 && (
            <li className={styles.searchSuggestionStatus}>
              No hay resultados para &ldquo;{term}&rdquo;
            </li>
          )}

          {suggestions.map((suggestion) => (
            <li key={suggestion.id} role="option">
              <button
                type="button"
                className={styles.searchSuggestionItem}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                <span className={styles.searchSuggestionName}>
                  {suggestion.name}
                </span>
                {(suggestion.caption || suggestion.tags) && (
                  <span className={styles.searchSuggestionMeta}>
                    {suggestion.caption ?? suggestion.tags}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
