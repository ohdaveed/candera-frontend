import { useState } from "react";
import { Clock3, Eye, FileText, Hash, ListOrdered, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Grid, Section } from "@/components/ui/section";
import { Cluster, Stack } from "@/components/ui/stack";
import { PARSE_STATUS } from "./store";
import { useExhibitSync } from "./useExhibitSync";

function formatBytes(value) {
  if (!Number.isFinite(value) || value <= 0) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${(value / 1024 ** unitIndex).toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function toDateTimeInputValue(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function fromDateTimeInputValue(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function StatusPill({ status }) {
  const label =
    status === PARSE_STATUS.READY
      ? "Ready"
      : status === PARSE_STATUS.ERROR
        ? "Review"
        : status === PARSE_STATUS.PARSING
          ? "Parsing"
          : "Queued";

  return (
    <span className="border border-candera-stone/50 px-2 py-1 text-[10px] uppercase tracking-widest text-candera-sage">
      {label}
    </span>
  );
}

function EmptyState({ children }) {
  return (
    <div className="border border-dashed border-candera-stone/70 px-4 py-10 text-center text-sm text-candera-sage">
      {children}
    </div>
  );
}

function MasterPanel({
  items,
  onFiles,
  onTimestampChange,
  onPageFootprintChange,
  onRemove,
  onClear,
}) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  }

  function handleDragLeave(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    onFiles(event.dataTransfer.files);
  }

  return (
    <Card className="border border-candera-stone/40 shadow-none" size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText size={16} /> Master
        </CardTitle>
        <CardDescription>Normalized records</CardDescription>
      </CardHeader>
      <CardContent>
        <Stack
          className={`gap-5 border border-dashed p-3 transition-colors ${
            isDragging
              ? "border-candera-ember bg-candera-ember/10"
              : "border-transparent bg-transparent"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Cluster className="justify-between gap-3">
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 bg-candera-obsidian px-5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-candera-ember">
              <Upload size={14} />
              Add Files
              <input
                type="file"
                multiple
                className="sr-only"
                onChange={(event) => {
                  onFiles(event.target.files);
                  event.target.value = "";
                }}
              />
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={items.length === 0}
              onClick={onClear}
            >
              Clear
            </Button>
          </Cluster>

          {items.length === 0 ? (
            <EmptyState>No records loaded</EmptyState>
          ) : (
            <Stack className="gap-4">
              {items.map((item) => (
                <Stack
                  key={item.id}
                  className="gap-4 border border-candera-stone/40 bg-white/60 p-4"
                >
                  <Cluster className="items-start justify-between gap-4">
                    <Stack className="min-w-0 gap-1">
                      <p className="truncate text-sm font-semibold text-candera-obsidian">
                        {item.fileName}
                      </p>
                      <p className="text-xs text-candera-sage">{formatBytes(item.fileSize)}</p>
                    </Stack>
                    <StatusPill status={item.parseStatus} />
                  </Cluster>

                  <Grid className="grid-cols-1 gap-3 sm:grid-cols-[1fr_7rem]">
                    <label className="text-[10px] uppercase tracking-widest text-candera-sage">
                      <span className="mb-1 block">Timestamp</span>
                      <Input
                        type="datetime-local"
                        value={toDateTimeInputValue(item.timestamp)}
                        onChange={(event) =>
                          onTimestampChange(item.id, fromDateTimeInputValue(event.target.value))
                        }
                      />
                    </label>
                    <label className="text-[10px] uppercase tracking-widest text-candera-sage">
                      <span className="mb-1 block">Pages</span>
                      <Input
                        type="number"
                        min="1"
                        value={item.pageFootprint}
                        onChange={(event) =>
                          onPageFootprintChange(item.id, Number(event.target.value))
                        }
                      />
                    </label>
                  </Grid>

                  <Cluster className="justify-between gap-3">
                    <p className="text-xs text-candera-sage">
                      {item.parseError ? item.parseError : item.exhibitCode}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${item.fileName}`}
                      onClick={() => onRemove(item.id)}
                    >
                      <Trash2 />
                    </Button>
                  </Cluster>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function ViewerPanel({ items }) {
  return (
    <Card className="border border-candera-stone/40 shadow-none" size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye size={16} /> Viewer
        </CardTitle>
        <CardDescription>Chronological sequence</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState>No preview available</EmptyState>
        ) : (
          <Stack className="gap-3">
            {items.map((item) => (
              <Cluster
                key={item.id}
                className="justify-between gap-4 border-b border-candera-stone/30 pb-3 last:border-b-0 last:pb-0"
              >
                <Stack className="min-w-0 gap-1">
                  <p className="truncate text-sm font-semibold text-candera-obsidian">
                    {item.exhibitCode}
                  </p>
                  <p className="truncate text-xs text-candera-sage">{item.fileName}</p>
                </Stack>
                <span className="shrink-0 font-mono text-xs text-candera-obsidian">
                  {item.pageRange.start}-{item.pageRange.end}
                </span>
              </Cluster>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

function IndexMapPanel({ items, totalPages, pendingCount }) {
  return (
    <Card className="border border-candera-stone/40 shadow-none" size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListOrdered size={16} /> Index Map
        </CardTitle>
        <CardDescription>Derived ranges</CardDescription>
      </CardHeader>
      <CardContent>
        <Stack className="gap-6">
          <Grid className="grid-cols-2 gap-3">
            <div className="border border-candera-stone/40 p-4">
              <Hash size={14} className="mb-3 text-candera-ember" />
              <p className="text-2xl font-light text-candera-obsidian">{totalPages}</p>
              <p className="text-[10px] uppercase tracking-widest text-candera-sage">Pages</p>
            </div>
            <div className="border border-candera-stone/40 p-4">
              <Clock3 size={14} className="mb-3 text-candera-ember" />
              <p className="text-2xl font-light text-candera-obsidian">{pendingCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-candera-sage">Pending</p>
            </div>
          </Grid>

          {items.length === 0 ? (
            <EmptyState>No index entries</EmptyState>
          ) : (
            <ol className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-[5rem_1fr_auto] items-center gap-3 text-xs"
                >
                  <span className="font-semibold text-candera-obsidian">{item.exhibitCode}</span>
                  <span className="truncate text-candera-sage">{item.fileName}</span>
                  <span className="font-mono text-candera-obsidian">
                    {item.pageRange.start}-{item.pageRange.end}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ExhibitSyncPage() {
  const { panels, addFiles, updateTimestamp, updatePageFootprint, removeItem, clearItems } =
    useExhibitSync();

  return (
    <main className="min-h-screen bg-candera-vellum pt-24">
      <Section>
        <Container className="space-y-10">
          <Stack className="gap-4">
            <p className="text-[11px] uppercase tracking-[0.3em] text-candera-sage">
              Exhibit Synchronization
            </p>
            <h1 className="font-display text-4xl leading-tight text-candera-obsidian md:text-6xl">
              Multi-panel indexer
            </h1>
          </Stack>

          <Grid className="grid-cols-1 gap-5 xl:grid-cols-[1.25fr_1fr_1fr]">
            <MasterPanel
              items={panels.masterItems}
              onFiles={addFiles}
              onTimestampChange={updateTimestamp}
              onPageFootprintChange={updatePageFootprint}
              onRemove={removeItem}
              onClear={clearItems}
            />
            <ViewerPanel items={panels.viewerItems} />
            <IndexMapPanel
              items={panels.indexItems}
              totalPages={panels.totalPages}
              pendingCount={panels.pendingCount}
            />
          </Grid>
        </Container>
      </Section>
    </main>
  );
}
