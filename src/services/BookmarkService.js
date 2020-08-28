export const BookmarkService = {
  getBookmarkBar() {
    return new Promise((resolve) => {
      chrome.bookmarks.getTree((bookmarks) => {
        const [root] = bookmarks;
        const [bookmarkBar] = root.children;

        resolve(bookmarkBar);
      });
    });
  },
};
