document.head.querySelector('title').innerText = chrome.i18n.getMessage(
  'newTab'
);

StorageService.init()
  .then(() => createEditor())
  .then(() => createBookmarks());
