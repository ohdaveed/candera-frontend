import { cn } from "../lib/utils";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low – High" },
  { value: "price-desc", label: "Price: High – Low" },
  { value: "name", label: "Name A – Z" },
];

export default function FilterBar({
  tags,
  activeTag,
  onTagChange,
  sortBy,
  onSortChange,
  count,
  total,
}) {
  return (
    <div className="mb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onTagChange("all")}
            aria-pressed={activeTag === "all"}
            className={cn(
              "text-[10px] uppercase tracking-widest px-4 py-2 border transition-colors duration-200",
              activeTag === "all"
                ? "bg-candera-obsidian text-white border-candera-obsidian"
                : "border-candera-stone text-candera-sage hover:border-candera-obsidian hover:text-candera-obsidian",
            )}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagChange(tag)}
              aria-pressed={activeTag === tag}
              className={cn(
                "text-[10px] uppercase tracking-widest px-4 py-2 border transition-colors duration-200",
                activeTag === tag
                  ? "bg-candera-warm text-white border-candera-warm"
                  : "border-candera-stone text-candera-sage hover:border-candera-warm hover:text-candera-warm",
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <select
          aria-label="Sort products"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-[10px] uppercase tracking-widest bg-transparent border border-candera-stone
            text-candera-sage px-4 py-2 appearance-none cursor-pointer
            hover:border-candera-obsidian hover:text-candera-obsidian transition-colors duration-200
            focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="normal-case tracking-normal text-sm"
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-[10px] uppercase tracking-widest text-candera-sage mt-4">
        Showing {count} of {total} candle{count !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
