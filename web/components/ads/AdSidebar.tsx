'use client';

import { AdSense } from './AdSense';

interface AdSidebarProps {
  /**
   * Ad unit ID
   */
  adUnitId?: string;
  /**
   * Custom className
   */
  className?: string;
}

/**
 * Sidebar ad component (vertical format)
 */
export function AdSidebar({ adUnitId, className = '' }: AdSidebarProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <AdSense
        adUnitId={adUnitId}
        format="vertical"
        className="min-h-[250px] w-full max-w-[300px]"
      />
    </div>
  );
}
