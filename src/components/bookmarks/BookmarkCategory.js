import { BookmarkChildren } from './BookmarkChildren.js';
import { useCSS } from '../../hooks/useCSS.js';

export const BookmarkCategory = ({ bookmark }) => {
  useCSS(`
    .BookmarkCategory {
      overflow: hidden;
      margin: 1.5rem 0.75rem 0.25rem auto;
      max-width: 3ch;
      text-align: right;
      transition: max-width ease var(--transition-duration);
      will-change: max-width;
    }

    .BookmarkCategory_title {
      white-space: nowrap;
      overflow: hidden;
      font-size: 1.5rem;
      font-weight: 300;
      margin: 0 0 0 auto;
      text-overflow: clip;
    }

    .Bookmarks:hover .BookmarkCategory {
      max-width: 80%;
    }

    .Bookmarks:hover .BookmarkCategory_title {
      text-overflow: ellipsis;
    }
  `);

  return html`<div>
    <div className="BookmarkCategory">
      <h1 className="BookmarkCategory_title">${bookmark.title}</h1>
    </div>

    <${BookmarkChildren} bookmark=${bookmark} />
  </div>`;
};
