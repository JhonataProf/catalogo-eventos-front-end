import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { cn } from "../utils/cn";
import { Container, type ContainerSize } from "./Container";

export type SectionSpacing = "sm" | "md" | "lg" | "xl";

export interface ISectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  containerSize?: ContainerSize;
  spacing?: SectionSpacing;
}

const spacingClasses: Record<SectionSpacing, string> = {
  sm: "py-6",
  md: "py-8",
  lg: "py-10",
  xl: "py-14",
};

export function Section({
  children,
  className,
  title,
  description,
  actions,
  containerSize = "xl",
  spacing = "lg",
  ...rest
}: ISectionProps): ReactElement {
  const hasHeader: boolean = Boolean(title || description || actions);

  return (
    <section className={cn(spacingClasses[spacing], className)} {...rest}>
      <Container size={containerSize}>
        {hasHeader ? (
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              {title ? (
                <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">
                  {title}
                </h2>
              ) : null}

              {description ? (
                <p className="max-w-2xl text-sm leading-6 text-zinc-600 md:text-base">
                  {description}
                </p>
              ) : null}
            </div>

            {actions ? <div>{actions}</div> : null}
          </div>
        ) : null}

        {children}
      </Container>
    </section>
  );
}