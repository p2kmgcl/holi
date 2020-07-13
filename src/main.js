document.head.querySelector('title').innerText = chrome.i18n.getMessage(
  'newTab'
);

StorageService.init()
  .then(() => createBookmarks())
  .then(() => createEditor())
  .then(() => document.body.classList.remove('loading'));
