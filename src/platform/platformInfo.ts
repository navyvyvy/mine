export type PlatformInfo = {
  runtime: 'web';
  canInstallPwa: boolean;
  supportsLocalStorage: boolean;
  supportsServiceWorker: boolean;
};

export function getPlatformInfo(): PlatformInfo {
  return {
    runtime: 'web',
    canInstallPwa: typeof window !== 'undefined' && 'BeforeInstallPromptEvent' in window,
    supportsLocalStorage: typeof window !== 'undefined' && 'localStorage' in window,
    supportsServiceWorker: typeof navigator !== 'undefined' && 'serviceWorker' in navigator
  };
}
