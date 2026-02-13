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
    <div className="flex flex-wrap gap-2 border-b border-border pb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={[
            "rounded-md px-4 py-2 text-sm font-semibold transition-all",
            activeTab === tab.id
              ? "bg-accent text-white shadow-sm"
              : "border border-border bg-paper-card text-ink-muted hover:text-ink",
            tab.hiddenOnMobile ? "hidden md:block" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
