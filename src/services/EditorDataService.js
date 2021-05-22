import { StorageService } from './StorageService.js';

const EDITOR_STORAGE_KEY = 'EDITOR';

const SELECTED_EDITOR_STORAGE_KEY = 'SELECTED_EDITOR';
const BACKUP_STORAGE_KEY = 'BACKUP';
const HISTORY_STORAGE_KEY = 'HISTORY';

const CLEAN_INTERVAL = 6000; // One minute

let editorId;
let changeTextCallback = [];
let changeEditorCallbacks = [];
let cachedEditorData = {};
let lastCleanDatetime = 0;

export const EditorDataService = {
  async init() {
    cachedEditorData = await StorageService.get(EDITOR_STORAGE_KEY);

    const firstEditorId =
      StorageService.getLocal(SELECTED_EDITOR_STORAGE_KEY) ||
      Object.keys(cachedEditorData)[0];

    if (!firstEditorId || !(firstEditorId in cachedEditorData)) {
      EditorDataService.addEditor();
    } else {
      editorId = firstEditorId;
      EditorDataService.setEditor(firstEditorId);
    }

    StorageService.onChange(EDITOR_STORAGE_KEY, (data) => {
      changeTextCallback.forEach((callback) => {
        callback(data[editorId]);
      });
    });
  },

  setEditor(nextEditorId) {
    if (!nextEditorId || typeof nextEditorId !== 'string') {
      throw new Error('Invalid editor ID');
    }

    if (nextEditorId === editorId) {
      return;
    }

    StorageService.setLocal(SELECTED_EDITOR_STORAGE_KEY, nextEditorId);

    editorId = nextEditorId;
    changeTextCallback = [];

    if (!(editorId in cachedEditorData)) {
      EditorDataService.setText('', {});
    } else {
      EditorDataService.setText(
        cachedEditorData[editorId],
        EditorDataService.getHistory()
      );
    }

    changeEditorCallbacks.forEach((callback) => {
      callback();
    });
  },

  addEditor() {
    EditorDataService.setEditor(Date.now().toString());
  },

  getEditor() {
    return editorId;
  },

  getEditorStorageKey() {
    return `${EDITOR_STORAGE_KEY}`;
  },

  getBackup() {
    return StorageService.getLocal(
      `${EDITOR_STORAGE_KEY}_${editorId}_${BACKUP_STORAGE_KEY}`
    );
  },

  getHistory() {
    return StorageService.getLocal(
      `${EDITOR_STORAGE_KEY}_${editorId}_${HISTORY_STORAGE_KEY}`
    );
  },

  getText() {
    return cachedEditorData[editorId] || '';
  },

  setText(nextText, nextHistory) {
    StorageService.setLocal(
      `${EDITOR_STORAGE_KEY}_${editorId}_${HISTORY_STORAGE_KEY}`,
      nextHistory
    );

    StorageService.setLocal(
      `${EDITOR_STORAGE_KEY}_${editorId}_${BACKUP_STORAGE_KEY}`,
      nextText
    );

    cachedEditorData = { ...cachedEditorData, [editorId]: nextText };

    Object.keys(cachedEditorData).forEach((cachedEditorId) => {
      if (cachedEditorId !== editorId && !cachedEditorData[cachedEditorId]) {
        delete cachedEditorData[cachedEditorId];
      }
    });

    if (Date.now() - lastCleanDatetime > CLEAN_INTERVAL) {
      const editorStoragePrefix =
        StorageService.getLocalKey(EDITOR_STORAGE_KEY);

      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(editorStoragePrefix)) {
          const [, cachedEditorId] =
            new RegExp(
              `${editorStoragePrefix}_([a-zA-Z0-9-_]+)_(${BACKUP_STORAGE_KEY}|${HISTORY_STORAGE_KEY})`
            ).exec(key) || [];

          if (cachedEditorId && !(cachedEditorId in cachedEditorData)) {
            localStorage.removeItem(key);
          }
        }
      });

      lastCleanDatetime = Date.now();
    }

    StorageService.set(EDITOR_STORAGE_KEY, cachedEditorData);
  },

  onChangeEditor(callback) {
    callback();
    changeEditorCallbacks.push(callback);
  },

  onChangeText(callback) {
    callback(EditorDataService.getText());
    changeTextCallback.push(callback);
  },
};
