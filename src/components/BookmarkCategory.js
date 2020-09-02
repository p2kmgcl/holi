import { BookmarkChildren } from './BookmarkChildren.js';
import { useCSS } from '../hooks/useCSS.js';

export const BookmarkCategory = ({ bookmark }) => {
  useCSS(`
    .BookmarkCategory_title {
      white-space: nowrap;
      overflow: hidden;
      font-size: 1.5rem;
      font-weight: 300;
      max-width: 1ch;
      margin: 1.5rem 1.125rem 0.25rem auto;
      transition: max-width ease var(--transition-duration);
      will-change: max-width;

    }

    .Bookmarks:hover .BookmarkCategory_title {
      max-width: calc(100% - 4rem);
    }
  `);

  return html`
    <h1 class="BookmarkCategory_title">${bookmark.title}</h1>
    <${BookmarkChildren} bookmark=${bookmark} />
  `;
};
