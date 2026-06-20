export type SaveStorageAdapter = {
  read(key: string): string | null;
  write(key: string, value: string): void;
  remove(key: string): void;
};

export const webSaveStorage: SaveStorageAdapter = {
  read(key) {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  },
  write(key, value) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  },
  remove(key) {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  }
};
