import { useCMSStore } from './cmsStore';
import type { SiteData } from './cmsData';

// Hook for public site to read CMS data
export function useSiteData(): SiteData {
  return useCMSStore((s) => s.data);
}
