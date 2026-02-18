'use client';

import { AdSense } from './AdSense';

interface AdBannerProps {
  /**
   * Banner position: 'top', 'bottom', 'middle', 'sidebar'
   */
  position?: 'top' | 'bottom' | 'middle' | 'sidebar';
  /**
   * Custom className
   */
  className?: string;
  /**
   * Ad unit ID
   */
  adUnitId?: string;
}

/**
 * Pre-configured banner ad component
 */
export function AdBanner({ position = 'middle', className = '', adUnitId }: AdBannerProps) {
  const positionClasses = {
    top: 'my-4',
    bottom: 'my-6 mt-8',
    middle: 'my-6',
    sidebar: 'my-4',
  };

  return (
    <div className={`flex justify-center ${positionClasses[position]} ${className}`}>
      <AdSense
        adUnitId={adUnitId}
        format="auto"
        className="min-h-[100px] w-full max-w-[728px]"
      />
    </div>
  );
}
