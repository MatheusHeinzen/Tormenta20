'use client';

import { useEffect } from 'react';

interface AdSenseProps {
  /**
   * Ad format: 'auto', 'rectangle', 'vertical', 'horizontal'
   */
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  /**
   * Ad size: 'responsive' or specific dimensions
   */
  style?: React.CSSProperties;
  /**
   * Additional className for styling
   */
  className?: string;
  /**
   * Ad unit ID from AdSense (e.g., "1234567890")
   * If not provided, uses NEXT_PUBLIC_ADSENSE_AD_UNIT_ID env var
   */
  adUnitId?: string;
}

/**
 * Google AdSense component
 * 
 * Usage:
 * <AdSense 
 *   adUnitId="1234567890" 
 *   format="auto" 
 *   className="my-4"
 * />
 */
export function AdSense({
  format = 'auto',
  style,
  className = '',
  adUnitId,
}: AdSenseProps) {
  // Get ad unit ID from prop or environment variable
  const finalAdUnitId = adUnitId || process.env.NEXT_PUBLIC_ADSENSE_AD_UNIT_ID || '';
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '';

  useEffect(() => {
    // Initialize ad after component mounts
    if (typeof window !== 'undefined' && window.adsbygoogle && finalAdUnitId) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [finalAdUnitId]);

  if (!finalAdUnitId || !adClientId) {
    // In development, show placeholder
    if (process.env.NODE_ENV === 'development') {
      return (
        <div
          className={`flex items-center justify-center border-2 border-dashed border-border bg-paper-card p-8 text-center text-xs text-ink-muted ${className}`}
          style={style}
        >
          <div>
            <p className="font-semibold">AdSense Ad Placeholder</p>
            <p className="mt-1">Configure NEXT_PUBLIC_ADSENSE_CLIENT_ID e NEXT_PUBLIC_ADSENSE_AD_UNIT_ID</p>
          </div>
        </div>
      );
    }
    return null;
  }

  const adStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    ...style,
  };

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={adStyle}
      data-ad-client={adClientId}
      data-ad-slot={finalAdUnitId}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}
