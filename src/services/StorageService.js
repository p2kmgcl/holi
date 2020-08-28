import { STORAGE_KEYS } from '../constants/STORAGE_KEYS.js';

const storage = chrome.storage.sync;
const currentVersion = 3;

const STORE_KEY = `holi${currentVersion}`;
const SYNC_DATE_KEY = 'date';
const SYNC_DELAY = 1000;

let _syncTimeoutId = null;
let _syncData = {};

export const StorageService = {
  async init() {
    const store = await new Promise((resolve) =>
      storage.get(STORE_KEY, (data) => resolve(data[STORE_KEY]))
    );

    if (!store) {
      // Upgrade from v1

      let value = localStorage.getItem('holi_editor');

      if (value) {
        localStorage.removeItem('holi_editor');

        return await storage.set({
          [STORE_KEY]: {
            [SYNC_DATE_KEY]: Date.now(),
            [STORAGE_KEYS.text]: value,
          },
        });
      }

      // Upgrade from v2

      value = await new Promise((resolve) => {
        storage.get('HOLI_TEXT', (data) => resolve(data['HOLI_TEXT']));
      });

      if (value) {
        await new Promise((resolve) => {
          storage.clear(resolve);
        });

        return storage.set({
          [STORE_KEY]: {
            [SYNC_DATE_KEY]: Date.now(),
            [STORAGE_KEYS.text]: value,
          },
        });
      }

      // Store init

      return storage.set({
        [STORE_KEY]: {
          [SYNC_DATE_KEY]: new Date('1991-1-1').getTime(),
        },
      });
    }

    _syncData = store;
  },

  onChange(key, fn) {
    const callback = (data, origin) => {
      const nextStore = data?.[STORE_KEY]?.newValue;
      if (nextStore && origin === 'sync') fn(nextStore[key]);
    };

    chrome.storage.onChanged.addListener(callback);
    return () => chrome.storage.onChanged.removeListener(callback);
  },

  get(key) {
    return new Promise((resolve) => {
      storage.get(STORE_KEY, (data) => {
        resolve(data[STORE_KEY]?.[key]);
      });
    });
  },

  set(key, value) {
    clearTimeout(_syncTimeoutId);
    _syncData = { ..._syncData, [SYNC_DATE_KEY]: Date.now(), [key]: value };

    // TODO trigger local change before sync

    _syncTimeoutId = setTimeout(() => {
      storage.get(STORE_KEY, (data) => {
        if (data?.[STORE_KEY]?.[SYNC_DATE_KEY] < _syncData[SYNC_DATE_KEY]) {
          storage.set({ [STORE_KEY]: _syncData });
        }
      });
    }, SYNC_DELAY);
  },
};
