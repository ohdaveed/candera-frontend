import { cn } from "../lib/utils";
import { Cluster } from "@/components/ui/stack";

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
      <Cluster className="flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <Cluster className="flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onTagChange("all")}
            aria-pressed={activeTag === "all"}
            className={cn(
              "min-h-10 text-[10px] uppercase tracking-widest px-4 py-2 border transition-colors duration-200",
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
                "min-h-10 text-[10px] uppercase tracking-widest px-4 py-2 border transition-colors duration-200",
                activeTag === tag
                  ? "bg-candera-ember text-white border-candera-ember"
                  : "border-candera-stone text-candera-sage hover:border-candera-ember hover:text-candera-ember",
              )}
            >
              {tag}
            </button>
          ))}
        </Cluster>

        <select
          aria-label="Sort products"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="min-h-10 w-full bg-transparent px-4 py-2 text-[10px] uppercase tracking-widest text-candera-sage sm:w-auto border border-candera-stone appearance-none cursor-pointer
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
      </Cluster>

      <p className="text-[10px] uppercase tracking-widest text-candera-sage mt-4">
        Showing {count} of {total} candle{count !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
