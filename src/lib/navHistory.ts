// Tracks whether the user has made at least one in-app client-side route
// change since this JS session started. `window.history.length` isn't a
// reliable signal here: a freshly opened tab's initial blank entry still
// counts toward it, so router.back() from a direct/refreshed link can land
// on that blank entry instead of falling back to a known route.
let hasNavigated = false;

export function markNavigated(): void {
  hasNavigated = true;
}

export function hasNavigatedWithinApp(): boolean {
  return hasNavigated;
}
