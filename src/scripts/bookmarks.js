import { BookmarkService } from '../services/BookmarkService.js';

export const bookmarks = () => {
  BookmarkService.getBookmarkBar().then((bookmarkBar) => {
    const rootParent = document.createElement('ul');
    rootParent.classList.add('bookmark-category__children');

    const bookmarkCategoryTemplate = document.getElementById(
      'bookmarkCategoryTemplate'
    );

    const bookmarkLinkTemplate = document.getElementById(
      'bookmarkLinkTemplate'
    );

    const renderChild = (child, parent) => {
      if (child.url) {
        const link = bookmarkLinkTemplate.content.cloneNode(true);
        link.querySelector('.bookmark-link').href = child.url;
        link.querySelector('.bookmark-link__label').innerText = child.title;
        link.querySelector(
          '.bookmark-link__image'
        ).src = `chrome://favicon/${child.url}`;
        parent.appendChild(link);
      } else {
        const category = bookmarkCategoryTemplate.content.cloneNode(true);
        category.querySelector('.bookmark-category__label').innerText =
          child.title;
        const categoryChildren = category.querySelector(
          '.bookmark-category__children'
        );
        child.children.forEach((grandChild) => {
          renderChild(grandChild, categoryChildren);
        });
        parent.appendChild(category);
      }
    };

    bookmarkBar.children.forEach((child) => {
      renderChild(child, rootParent);
    });

    const bookmarksElement = document.getElementById('bookmarks');

    if (bookmarkBar.children.length) {
      bookmarksElement.appendChild(rootParent);
    } else {
      bookmarksElement.parentElement.removeChild(bookmarksElement);
      document.body.style.setProperty('--bookmarks-width', '0');
    }
  });
};
