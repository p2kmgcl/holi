const STORAGE_TEXT_KEY = 'HOLI_TEXT';
const STORAGE_DATE_KEY = 'HOLI_DATE';
const chromeStorage = chrome.storage.sync;

const getValue = (keys) =>
  new Promise((resolve) => {
    chromeStorage.get(keys, resolve);
  });

const setValue = (data) =>
  new Promise((resolve) => {
    chromeStorage.set(data, resolve);
  });

window.StorageService = {
  _subscribers: [],
  _localDate: new Date('1991-01-01').getTime(),
  _localText: '',
  _syncTimeoutId: null,

  async init() {
    // v1.0.1 upgrade
    if (localStorage.getItem('holi_editor')) {
      await StorageService.setValue(localStorage.getItem('holi_editor'));
      localStorage.removeItem('holi_editor');
    }

    window.addEventListener('beforeunload', (event) => {
      if (this._syncTimeoutId) {
        event.returnValue = ' ';
      }
    });

    chromeStorage.onChanged.addListener((changes) => {
      const date = changes[STORAGE_DATE_KEY]?.newValue;
      const text = changes[STORAGE_TEXT_KEY]?.newValue;

      if (date !== null) {
        this._sync(
          Number(date),
          typeof text === 'undefined' || text === null ? this._localText : text
        );
      }
    });

    await this._sync(...(await this._getRemoteValue()));
  },

  async onChange(fn) {
    this._subscribers.push(fn);
  },

  async getValue() {
    return this._localText;
  },

  async setValue(text) {
    this._localDate = Date.now();
    this._localText = text;
    await this._queueSync();
  },

  async _getRemoteValue() {
    const {
      [STORAGE_DATE_KEY]: date,
      [STORAGE_TEXT_KEY]: text,
    } = await getValue([STORAGE_DATE_KEY, STORAGE_TEXT_KEY]);

    return [Number(date), text];
  },

  async _queueSync() {
    clearTimeout(this._syncTimeoutId);

    this._syncTimeoutId = setTimeout(async () => {
      this._syncTimeoutId = null;
      await this._sync(...(await this._getRemoteValue()));
    }, 1000);
  },

  async _sync(remoteDate, remoteText) {
    if (remoteText !== this._localText) {
      if (remoteDate > this._localDate) {
        this._localDate = remoteDate;
        this._localText = remoteText;
        this._subscribers.forEach((fn) => fn(this._localText));
      } else {
        await setValue({
          [STORAGE_DATE_KEY]: this._localDate,
          [STORAGE_TEXT_KEY]: this._localText,
        });
      }
    } else if (remoteDate < this._localDate) {
      await setValue({
        [STORAGE_DATE_KEY]: this._localDate,
      });
    }
  },
};
