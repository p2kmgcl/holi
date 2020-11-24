import { STORAGE_KEYS } from '../constants/STORAGE_KEYS.js';

const warnStorageNotAvailable = () => {
  console.warn(
    'Warning: storage data is not available.\n' +
    'Your editor information will not be synchronized and might be lost.\n' +
    'Please add a bug ticket at https://github.com/p2kmgcl/holi/issues/new/choose'
  );
}

const storage = window.browser?.storage?.sync || window.chrome?.storage?.sync || {
  get: (key, handler) => {
    warnStorageNotAvailable()
    handler()
  },

  set: (data) => {
    warnStorageNotAvailable()
    return Promise.resolve();
  },
};

const onStorageChanged = window.browser?.storage?.onChanged || window.chrome?.storage?.onChanged || {
  addListener: (callback) => {
    warnStorageNotAvailable()
  },

  removeListener: (callback) => {
    warnStorageNotAvailable()
  }
}

const currentVersion = 3;

const STORE_KEY = `holi${currentVersion}`;
const STORE_LOCAL_KEY = `${STORE_KEY}local`;
const SYNC_DATE_KEY = 'date';
const SYNC_DELAY = 1000;

let _syncTimeoutId = null;
let _syncData = {};

export const StorageService = {
  async init() {
    window.addEventListener('beforeunload', (event) => {
      if (_syncTimeoutId) {
        event.returnValue = '';
      }
    });

    const store = await new Promise((resolve) =>
      storage.get(STORE_KEY, (data) => resolve(data?.[STORE_KEY]))
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
        storage.get('HOLI_TEXT', (data) => resolve(data?.['HOLI_TEXT']));
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

    onStorageChanged.addListener(callback);
    return () => onStorageChanged.removeListener(callback);
  },

  get(key) {
    return new Promise((resolve) => {
      storage.get(STORE_KEY, (data) => {
        resolve(data?.[STORE_KEY]?.[key]);
      });
    });
  },

  getLocal(key) {
    const value = localStorage.getItem(`${STORE_LOCAL_KEY}${key}`);

    if (value !== null) {
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    }

    return null;
  },

  set(key, value) {
    clearTimeout(_syncTimeoutId);
    _syncData = { ..._syncData, [SYNC_DATE_KEY]: Date.now(), [key]: value };

    // TODO trigger local change before sync

    _syncTimeoutId = setTimeout(() => {
      storage.get(STORE_KEY, (data) => {
        _syncTimeoutId = null;

        if (data?.[STORE_KEY]?.[SYNC_DATE_KEY] < _syncData[SYNC_DATE_KEY]) {
          storage.set({ [STORE_KEY]: _syncData });
        }
      });
    }, SYNC_DELAY);
  },

  setLocal(key, value) {
    localStorage.setItem(`${STORE_LOCAL_KEY}${key}`, JSON.stringify(value));
  },
};
