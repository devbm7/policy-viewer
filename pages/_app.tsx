import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Set to true to enable maintenance mode, false to disable
const MAINTENANCE_MODE = true;
// Define paths that should be excluded from maintenance mode (optional)
const EXCLUDED_PATHS = ['/api', '/_next', '/static', '/maintenance'];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if we're in maintenance mode and if the current path should be redirected
    if (MAINTENANCE_MODE) {
      const pathname = router.pathname;
      
      // Don't redirect if already on maintenance page or if path is excluded
      const isMaintenancePage = pathname === '/maintenance';
      const isExcludedPath = EXCLUDED_PATHS.some(path => pathname.startsWith(path));
      
      if (!isMaintenancePage && !isExcludedPath) {
        router.push('/maintenance');
      }
    }
  }, [router.pathname, router]);

  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
      <Analytics />
    </>
  );
}
 
export default MyApp;