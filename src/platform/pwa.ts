let devCleanupStarted = false;

async function clearDevServiceWorkerState(): Promise<void> {
  if (devCleanupStarted) return;
  devCleanupStarted = true;
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  } catch {
    // If cleanup fails in dev, we still keep the app running.
  }

  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch {
    // Cache cleanup is best-effort only.
  }
}

export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;
  if (import.meta.env.DEV) {
    void clearDevServiceWorkerState();
    return;
  }
  if (!('serviceWorker' in navigator)) return;
  const register = () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // PWA should never block the playable app.
    });
  };
  if (document.readyState === 'complete') {
    register();
    return;
  }
  window.addEventListener('load', register, { once: true });
}
