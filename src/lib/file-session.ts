'use client';

// In-browser global file session store
// Combines in-memory speed with IndexedDB persistence across page reloads and route changes

let sessionFiles: File[] = [];
const listeners = new Set<(files: File[]) => void>();

const DB_NAME = 'imaginex_session_db';
const STORE_NAME = 'files_store';
const KEY = 'active_files';

function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function persistToIndexedDB(files: File[]) {
  openDB().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(files, KEY);
    } catch {
      // Ignored: memory fallback remains active
    }
  });
}

function clearIndexedDB() {
  openDB().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(KEY);
    } catch {
      // Ignored
    }
  });
}

export function setSessionFiles(files: File[]) {
  sessionFiles = [...files];
  listeners.forEach((callback) => callback(sessionFiles));
  persistToIndexedDB(files);
}

export function addSessionFiles(files: File[]) {
  sessionFiles = [...sessionFiles, ...files];
  listeners.forEach((callback) => callback(sessionFiles));
  persistToIndexedDB(sessionFiles);
}

export function getSessionFiles(): File[] {
  return [...sessionFiles];
}

export async function restoreSessionFiles(): Promise<File[]> {
  if (sessionFiles.length > 0) {
    return [...sessionFiles];
  }
  const db = await openDB();
  if (!db) return [];

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY);
      req.onsuccess = () => {
        const res = req.result;
        if (Array.isArray(res) && res.length > 0) {
          sessionFiles = res;
          listeners.forEach((callback) => callback(sessionFiles));
          resolve(res);
        } else {
          resolve([]);
        }
      };
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

export function clearSessionFiles() {
  sessionFiles = [];
  listeners.forEach((callback) => callback(sessionFiles));
  clearIndexedDB();
}

export function subscribeSessionFiles(callback: (files: File[]) => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
