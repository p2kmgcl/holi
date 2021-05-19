import { StorageService } from './services/StorageService.js';
import { I18NService } from './services/I18NService.js';
import { FetchService } from './services/FetchService.js';
import { bookmarks } from './scripts/bookmarks.js';
import { editor } from './scripts/editor.js';
import { EmojiService } from './services/EmojiService.js';
import { EditorDataService } from './services/EditorDataService.js';

document.head.querySelector('title').innerText = I18NService.get('newTab');

const resolveInOrder = (getPromiseList) =>
  getPromiseList.reduce(
    (acc, getPromise) => acc.then(() => Promise.resolve(getPromise())),
    Promise.resolve()
  );

resolveInOrder([
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
  })
  .catch((error) => {
    console.log(error);
  });
