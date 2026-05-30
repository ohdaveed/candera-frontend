import { Clock } from "lucide-react";
import { Grid, Cluster, Stack } from "@/components/ui";

const PROFILE_LABELS = [
  ["top", "Top"],
  ["heart", "Heart"],
  ["base", "Base"],
];

export function FragranceProfileCard({ profile = {}, burnTime = "—", atmosphere, className = "" }) {
  return (
    <Stack className={`gap-5 ${className}`}>
      <Stack className="gap-3">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
          Fragrance Profile
        </p>
        <Grid className="grid-cols-3 gap-2 text-[9px] font-medium uppercase tracking-widest text-stone-600">
          {PROFILE_LABELS.map(([key, label], index) => (
            <div
              key={key}
              className={
                index === 0
                  ? "border-r border-stone-200 pr-2"
                  : index === 1
                    ? "border-r border-stone-200 px-2"
                    : "pl-2"
              }
            >
              <span className="text-candera-ember block mb-1">{label}</span>
              {profile[key] ?? "—"}
            </div>
          ))}
        </Grid>
      </Stack>

      <Cluster className="flex-wrap justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
        <Cluster className="gap-2">
          <Clock size={12} />
          {burnTime}
        </Cluster>
        {atmosphere && (
          <span className="font-editorial text-sm italic normal-case text-candera-ember/60">
            {atmosphere}
          </span>
        )}
      </Cluster>
    </Stack>
  );
}
