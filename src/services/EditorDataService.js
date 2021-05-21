import { StorageService } from './StorageService.js';

const EDITOR_STORAGE_KEY = 'EDITOR';

const BACKUP_STORAGE_KEY = 'BACKUP';
const HISTORY_STORAGE_KEY = 'HISTORY';

let editorId;
let changeCallbacks = [];
let changeEditorCallbacks = [];
let cachedEditorData = {};

const assertEditorId = () => {
  if (!editorId) {
    throw new Error('No editor id');
  }
};

export const EditorDataService = {
  async init() {
    cachedEditorData = await StorageService.get(EDITOR_STORAGE_KEY);

    const [firstEditorId] = Object.keys(cachedEditorData);

    if (!firstEditorId) {
      EditorDataService.addEditor();
    } else {
      EditorDataService.setEditor(firstEditorId);
    }

    StorageService.onChange(EDITOR_STORAGE_KEY, (data) => {
      changeCallbacks.forEach((callback) => {
        callback(data[editorId]);
      });
    });
  },

  setEditor(nextEditorId) {
    if (!nextEditorId || typeof nextEditorId !== 'string') {
      throw new Error('Invalid editor ID');
    }

    editorId = nextEditorId;
    changeCallbacks = [];

    if (!(editorId in cachedEditorData)) {
      EditorDataService.setText('');
    } else {
      EditorDataService.setText(cachedEditorData[editorId]);
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

  onChangeEditor(callback) {
    changeEditorCallbacks.push(callback);
    callback();
  },

  getEditorStorageKey() {
    return `${EDITOR_STORAGE_KEY}`;
  },

  getBackup() {
    assertEditorId();
    return StorageService.getLocal(
      `${EDITOR_STORAGE_KEY}_${editorId}_${BACKUP_STORAGE_KEY}`
    );
  },

  getHistory() {
    assertEditorId();
    return StorageService.getLocal(
      `${EDITOR_STORAGE_KEY}_${editorId}_${HISTORY_STORAGE_KEY}`
    );
  },

  setHistory(history) {
    assertEditorId();
    return StorageService.setLocal(
      `${EDITOR_STORAGE_KEY}_${editorId}_${HISTORY_STORAGE_KEY}`,
      history
    );
  },

  getText() {
    assertEditorId();
    return cachedEditorData[editorId] || '';
  },

  setText(nextText) {
    assertEditorId();

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

    StorageService.set(EDITOR_STORAGE_KEY, cachedEditorData);
  },

  onChangeText(callback) {
    assertEditorId();
    changeCallbacks.push(callback);
    callback(EditorDataService.getText());
  },
};
