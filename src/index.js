import { StorageService } from './services/StorageService.js';
import { I18NService } from './services/I18NService.js';
import { FetchService } from './services/FetchService.js';
import { bookmarks } from './scripts/bookmarks.js';
import { editor } from './scripts/editor.js';
import { EmojiService } from './services/EmojiService.js';

document.head.querySelector('title').innerText = I18NService.get('newTab');

Promise.all([
  StorageService.init(),
  FetchService.init(),
  EmojiService.init(),
]).then(() => {
  const app = document.getElementById('app');
  app.classList.remove('loading');

  bookmarks();
  editor();
});
