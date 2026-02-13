"use client";

interface TabItem {
  id: string;
  label: string;
  hiddenOnMobile?: boolean;
}

interface SheetTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange(nextTab: string): void;
}

export function SheetTabs({ tabs, activeTab, onChange }: SheetTabsProps) {
  return (
    <div className="-mx-1 border-b border-border px-1 pb-4">
      <div className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={[
              "min-h-[44px] shrink-0 rounded-md px-4 py-2.5 text-sm font-semibold transition-all",
              activeTab === tab.id
                ? "bg-accent text-white shadow-sm"
                : "border border-border bg-paper-card text-ink-muted hover:text-ink",
              tab.hiddenOnMobile ? "hidden md:inline-flex md:items-center" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
