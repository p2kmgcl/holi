import { BookmarkLink } from './BookmarkLink.js';
import { BookmarkCategory } from './BookmarkCategory.js';

export const BookmarkChildren = ({ bookmark }) => {
  return bookmark.children.map(
    (child) =>
      html`<${getBookmarkComponent(child)}
        bookmark=${child}
        key="${child.parentId}-${child.id}"
      />`
  );
};

const getBookmarkComponent = (bookmark) =>
  bookmark.url ? BookmarkLink : BookmarkCategory;
