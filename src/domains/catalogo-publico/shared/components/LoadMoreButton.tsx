import { Button } from "@/shared/ui";
import type { ReactElement } from "react";

export interface ILoadMoreButtonProps {
  isLoading: boolean;
  onClick: () => void | Promise<void>;
}

export function LoadMoreButton({
  isLoading,
  onClick,
}: ILoadMoreButtonProps): ReactElement {
  return (
    <div className="mt-8 flex justify-center">
      <Button
        variant="ghost"
        isLoading={isLoading}
        onClick={() => {
          void onClick();
        }}
        disabled={isLoading}
        className="inline-flex min-w-40 items-center justify-center rounded-2xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:border-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Carregar mais
      </Button>
    </div>
  );
}