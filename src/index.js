import { StorageService } from './services/StorageService.js';
import { I18NService } from './services/I18NService.js';
import { FetchService } from './services/FetchService.js';
import { bookmarks } from './scripts/bookmarks.js';
import { editor } from './scripts/editor.js';
import { EmojiService } from './services/EmojiService.js';
import { EditorDataService } from './services/EditorDataService.js';
import { keyBindings } from './scripts/key-bindings.js';
import { editorTabs } from './scripts/editor-tabs.js';

const resolveInOrder = (getPromiseList) =>
  getPromiseList.reduce(
    (acc, getPromise) => acc.then(() => Promise.resolve(getPromise())),
    Promise.resolve()
  );

resolveInOrder([
  () => I18NService.init(),
  () => StorageService.init(),
  () => FetchService.init(),
  () => EmojiService.init(),
  () => EditorDataService.init(),
])
  .then(() => {
    const app = document.getElementById('app');
    app.classList.remove('loading');

    bookmarks();
    editor();
    keyBindings();
    editorTabs();
  })
  .catch((error) => {
    console.log(error);
  });
