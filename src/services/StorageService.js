import { EditorDataService } from './EditorDataService.js';

const warnStorageNotAvailable = () => {
  console.warn(
    'Warning: storage data is not available.\n' +
      'Your editor information will not be synchronized and might be lost.\n' +
      'Please add a bug ticket at https://github.com/p2kmgcl/holi/issues/new/choose'
  );
};

const storage = window.browser?.storage?.sync ||
  window.chrome?.storage?.sync || {
    get: (key, handler) => {
      warnStorageNotAvailable();
      handler();
    },

    set: (data) => {
      warnStorageNotAvailable();
      return Promise.resolve();
    },
  };

const onStorageChanged = window.browser?.storage?.onChanged ||
  window.chrome?.storage?.onChanged || {
    addListener: (callback) => {
      warnStorageNotAvailable();
    },

    removeListener: (callback) => {
      warnStorageNotAvailable();
    },
  };

const currentVersion = 4;

const STORE_KEY = `holi${currentVersion}`;
const STORE_LOCAL_KEY = `${STORE_KEY}_LOCAL`;
const SYNC_DATE_KEY = 'DATE';
const SYNC_DELAY = 1000;

let _localChangeCallbacks = {};
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
      const editorId = 'migration-editor-' + Date.now().toString();

      /*

      Upgrade from v1

      local: {
        holi_editor: string
      }

      */

      let value = localStorage.getItem('holi_editor');

      if (value) {
        localStorage.removeItem('holi_editor');

        return await storage.set({
          [STORE_KEY]: {
            [SYNC_DATE_KEY]: Date.now(),
            [EditorDataService.getEditorStorageKey()]: {
              [editorId]: value,
            },
          },
        });
      }

      /*

      Upgrade from v2

      sync: {
        data: {
          HOLI_TEXT: string
        }
      }

      */

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
            [EditorDataService.getEditorStorageKey()]: {
              [editorId]: value,
            },
          },
        });
      }

      /*

      Upgrade from v3

      local: {
        holi3localeditorBackup: {date: number, text: string}
        holi3localeditorHistory: Object
        holi3localfetchServiceRequests: {expirationDate: number, data: Object, url: string}
      }

      sync: {
        data: {
          holi3: {
            date: number
            text: string
          }
        }
      }

      */

      value = await new Promise((resolve) => {
        storage.get('holi3', (data) => resolve(data?.holi3));
      });

      if (value?.text) {
        localStorage.clear();

        await new Promise((resolve) => {
          storage.clear(resolve);
        });

        return storage.set({
          [STORE_KEY]: {
            [SYNC_DATE_KEY]: Date.now(),
            [EditorDataService.getEditorStorageKey()]: {
              [editorId]: value?.text,
            },
          },
        });
      }

      /*

      v4

      local: {
        holi4_LOCAL_EDITOR_[EDITOR_ID]_HISTORY: Object
        holi4_LOCAL_EDITOR_[EDITOR_ID]_BACKUP: string
        holi4_LOCAL_FETCH_SERVICE_REQUESTS: {expirationDate: number, data: Object, url: string}
      }

      sync: {
        data: {
          holi4: {
            DATE: number
            EDITOR: { [EDITOR_ID]: string }
          }
        }
      }

       */

      return storage.set({
        [STORE_KEY]: {
          [SYNC_DATE_KEY]: new Date('1991-1-1').getTime(),
          [EditorDataService.getEditorStorageKey()]: {},
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

    if (_syncData?.[key]) {
      fn(_syncData[key]);
    }

    const callbackList = _localChangeCallbacks[key] || [];
    callbackList.push(fn);
    _localChangeCallbacks[key] = callbackList;

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
    const value = localStorage.getItem(`${STORE_LOCAL_KEY}_${key}`);

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

    _syncData = {
      ..._syncData,
      [SYNC_DATE_KEY]: Date.now(),
      [key]: value,
    };

    _localChangeCallbacks[key]?.forEach((callback) => {
      callback(value);
    });

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
    localStorage.setItem(`${STORE_LOCAL_KEY}_${key}`, JSON.stringify(value));
  },
};
