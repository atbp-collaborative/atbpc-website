/**
 * Verification & Test Suite for Production Launch Button & Domain Rerouting
 *
 * Run with:
 * node --experimental-strip-types scripts/test-launch-reroute.ts
 */

interface MiddlewareSimulationInput {
  hostname: string;
  pathname: string;
  search?: string;
  isSiteLaunched: boolean;
  isMaintenanceActive: boolean;
  hasPreviewAccess?: boolean;
}

interface MiddlewareSimulationResult {
  action: 'REDIRECT' | 'REWRITE' | 'PASS';
  target?: string;
  statusCode?: number;
  headerSet?: Record<string, string>;
}

/**
 * Simulates middleware edge logic with identical rules to src/middleware.ts
 */
function simulateMiddlewareRules(input: MiddlewareSimulationInput): MiddlewareSimulationResult {
  const {
    hostname,
    pathname,
    search = '',
    isSiteLaunched,
    isMaintenanceActive,
    hasPreviewAccess = false,
  } = input;

  const isProductionDomain =
    hostname === 'atbpcollaborative.com' ||
    hostname === 'www.atbpcollaborative.com' ||
    hostname === 'atbpcollaborative.local';

  const isVercelStagingDomain =
    hostname === 'atbpc-website.vercel.app' ||
    hostname === 'atbpc-website.vercel.local';

  const isMaintenanceExempt =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/under-maintenance';

  const isPreLaunchExempt =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/launching-soon' ||
    pathname === '/under-maintenance';

  // 1. Maintenance Mode Check
  if (isMaintenanceActive && !isMaintenanceExempt) {
    return {
      action: 'REWRITE',
      target: '/under-maintenance',
      headerSet: { 'x-under-maintenance': 'true', 'x-maintenance-mode': 'site-wide' },
    };
  }

  // 2. Vercel Staging Domain Rerouting Guard (When site is launched)
  if (isSiteLaunched && isVercelStagingDomain) {
    const targetUrl = new URL(pathname + search, 'https://www.atbpcollaborative.com').toString();
    return {
      action: 'REDIRECT',
      target: targetUrl,
      statusCode: 307,
    };
  }

  // 3. Pre-Launch Gate on Production Domain
  const shouldShowLaunchingSoon = isProductionDomain && !isSiteLaunched && !hasPreviewAccess;
  if (shouldShowLaunchingSoon && !isPreLaunchExempt) {
    return {
      action: 'REWRITE',
      target: '/launching-soon',
      headerSet: { 'x-launching-soon': 'true' },
    };
  }

  // 4. Status URLs Reroute Guard when live
  if (!isMaintenanceActive && !shouldShowLaunchingSoon) {
    if (
      pathname === '/under-maintenance' ||
      pathname === '/launching-soon' ||
      pathname === '/under-construction'
    ) {
      return {
        action: 'REDIRECT',
        target: '/',
      };
    }
  }

  return { action: 'PASS' };
}

async function runTests() {
  console.log('===============================================================');
  console.log('🧪 TESTING PRODUCTION LAUNCH BUTTON & DOMAIN REROUTING LOGIC');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(title: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${title}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${title}`);
      if (details) console.error(`     Details: ${details}`);
      failed++;
    }
  }

  // --------------------------------------------------------------------------
  // Scenario 1: Launched Site on atbpc-website.vercel.app -> Reroute to Production
  // --------------------------------------------------------------------------
  console.log('--- Test Suite 1: Vercel Staging Domain Rerouting ---');
  const res1 = simulateMiddlewareRules({
    hostname: 'atbpc-website.vercel.app',
    pathname: '/studio',
    search: '?tab=services',
    isSiteLaunched: true,
    isMaintenanceActive: false,
  });
  assert(
    'Reroutes Vercel /studio to https://www.atbpcollaborative.com/studio?tab=services with 307',
    res1.action === 'REDIRECT' &&
      res1.target === 'https://www.atbpcollaborative.com/studio?tab=services' &&
      res1.statusCode === 307,
    JSON.stringify(res1)
  );

  const res1Root = simulateMiddlewareRules({
    hostname: 'atbpc-website.vercel.app',
    pathname: '/',
    isSiteLaunched: true,
    isMaintenanceActive: false,
  });
  assert(
    'Reroutes Vercel homepage (/) to https://www.atbpcollaborative.com/ with 307',
    res1Root.action === 'REDIRECT' &&
      res1Root.target === 'https://www.atbpcollaborative.com/' &&
      res1Root.statusCode === 307,
    JSON.stringify(res1Root)
  );

  // --------------------------------------------------------------------------
  // Scenario 2: Pre-Launch Site on atbpc-website.vercel.app -> Staging Access
  // --------------------------------------------------------------------------
  console.log('\n--- Test Suite 2: Vercel Domain Pre-Launch Staging Mode ---');
  const res2 = simulateMiddlewareRules({
    hostname: 'atbpc-website.vercel.app',
    pathname: '/studio',
    isSiteLaunched: false,
    isMaintenanceActive: false,
  });
  assert(
    'Allows direct staging access to /studio when site is NOT launched',
    res2.action === 'PASS',
    JSON.stringify(res2)
  );

  // --------------------------------------------------------------------------
  // Scenario 3: Production Domain in Pre-Launch Mode -> Launching Soon Gate
  // --------------------------------------------------------------------------
  console.log('\n--- Test Suite 3: Production Domain Pre-Launch Blocker ---');
  const res3 = simulateMiddlewareRules({
    hostname: 'atbpcollaborative.com',
    pathname: '/',
    isSiteLaunched: false,
    isMaintenanceActive: false,
  });
  assert(
    'Rewrites production domain to /launching-soon when unlaunched',
    res3.action === 'REWRITE' &&
      res3.target === '/launching-soon' &&
      res3.headerSet?.['x-launching-soon'] === 'true',
    JSON.stringify(res3)
  );

  const res3Www = simulateMiddlewareRules({
    hostname: 'www.atbpcollaborative.com',
    pathname: '/works',
    isSiteLaunched: false,
    isMaintenanceActive: false,
  });
  assert(
    'Rewrites www.atbpcollaborative.com to /launching-soon when unlaunched',
    res3Www.action === 'REWRITE' &&
      res3Www.target === '/launching-soon',
    JSON.stringify(res3Www)
  );

  const res3Preview = simulateMiddlewareRules({
    hostname: 'atbpcollaborative.com',
    pathname: '/works',
    isSiteLaunched: false,
    isMaintenanceActive: false,
    hasPreviewAccess: true,
  });
  assert(
    'Bypasses launching-soon when preview cookie/query is present',
    res3Preview.action === 'PASS',
    JSON.stringify(res3Preview)
  );

  // --------------------------------------------------------------------------
  // Scenario 4: Production Domain in Launched Mode -> Full Public Access
  // --------------------------------------------------------------------------
  console.log('\n--- Test Suite 4: Production Domain Launched Mode ---');
  const res4 = simulateMiddlewareRules({
    hostname: 'atbpcollaborative.com',
    pathname: '/works',
    isSiteLaunched: true,
    isMaintenanceActive: false,
  });
  assert(
    'Serves public works page on atbpcollaborative.com when launched',
    res4.action === 'PASS',
    JSON.stringify(res4)
  );

  const res4Status = simulateMiddlewareRules({
    hostname: 'atbpcollaborative.com',
    pathname: '/launching-soon',
    isSiteLaunched: true,
    isMaintenanceActive: false,
  });
  assert(
    'Redirects manual /launching-soon visit to / when site is launched',
    res4Status.action === 'REDIRECT' && res4Status.target === '/',
    JSON.stringify(res4Status)
  );

  // --------------------------------------------------------------------------
  // Scenario 5: Maintenance Mode Overrides Launch State
  // --------------------------------------------------------------------------
  console.log('\n--- Test Suite 5: Maintenance Mode Precedence ---');
  const res5 = simulateMiddlewareRules({
    hostname: 'atbpcollaborative.com',
    pathname: '/works',
    isSiteLaunched: true,
    isMaintenanceActive: true,
  });
  assert(
    'Maintenance mode takes precedence over launched state (rewrites to /under-maintenance)',
    res5.action === 'REWRITE' && res5.target === '/under-maintenance',
    JSON.stringify(res5)
  );

  const res5Admin = simulateMiddlewareRules({
    hostname: 'atbpcollaborative.com',
    pathname: '/admin/dashboard',
    isSiteLaunched: false,
    isMaintenanceActive: true,
  });
  assert(
    'Admin console is exempt from both maintenance mode and pre-launch gate',
    res5Admin.action === 'PASS',
    JSON.stringify(res5Admin)
  );

  console.log('\n===============================================================');
  console.log(`Summary: ${passed} passed, ${failed} failed`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
