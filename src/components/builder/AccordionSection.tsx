import React from 'react'

export interface AccordionSectionProps {
  title: React.ReactNode
  description?: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}

export default function AccordionSection({
  title,
  description,
  defaultOpen,
  children,
}: AccordionSectionProps) {
  return (
    <details
      className="group rounded-2xl border theme-border theme-card overflow-hidden"
      open={defaultOpen}
    >
      <summary className="list-none cursor-pointer select-none px-5 py-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold theme-text">{title}</div>
          {description ? <div className="mt-1 text-sm theme-text-muted">{description}</div> : null}
        </div>
        <div className="shrink-0 mt-0.5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl border theme-border theme-card group-open:bg-primary/10 group-open:border-primary/40 transition-colors">
            <span
              className="text-lg leading-none theme-text group-open:text-primary transition-colors"
              aria-hidden
            >
              +
            </span>
          </span>
        </div>
      </summary>
      <div className="px-5 pb-5 pt-0">{children}</div>
    </details>
  )
}
