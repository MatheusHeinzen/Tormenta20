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
    <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={[
            "rounded-lg px-4 py-2 text-sm font-semibold transition-all",
            activeTab === tab.id
              ? "bg-zinc-900 text-white shadow-sm"
              : "border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900",
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
