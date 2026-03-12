import type { ReactElement } from "react";

export function CatalogCardSkeleton(): ReactElement {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="h-56 w-full animate-pulse bg-zinc-200" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-zinc-200" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200" />
        <div className="h-10 w-32 animate-pulse rounded-xl bg-zinc-200" />
      </div>
    </article>
  );
}