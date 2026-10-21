/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-8 max-w-7xl mx-auto w-full animate-pulse space-y-6">
        <div className="h-10 w-64 bg-black/10 dark:bg-white/10 rounded-lg" />
        <div className="h-96 w-full bg-black/5 dark:bg-white/5 rounded-2xl" />
      </div>
    </div>
  );
}
