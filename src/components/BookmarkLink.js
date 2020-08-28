import { useCSS } from '../hooks/useCSS.js';
import { Placeholder } from './Placeholder.js';

export const BookmarkLink = ({ bookmark }) => {
  useCSS(`
    .BookmarkLink {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      padding: 0.5rem 1rem;
      text-decoration: none;
      color: inherit;
      font-size: 0.875rem;
      transition: background ease var(--transition-duration);
      will-change: background;
      border-radius: 8px;
    }

    .BookmarkLink:hover {
      color: var(--highlight);
      background: var(--highlight-background);
      font-weight: bolder;
    }

    .BookmarkLink_label {
      margin-right: 1ch;
      overflow: hidden;
      white-space: nowrap;
    }
  `);

  return html`
    <${Placeholder} height="calc(16px + 1rem)">
      <a class="BookmarkLink" href=${bookmark.url}>
        <img
          class="BookmarkLink_image"
          src="chrome://favicon/${bookmark.url}"
          alt=""
          width="16"
          height="16"
        />

        <span class="BookmarkLink_label">
          ${bookmark.title}
        </span>
      </a>
    <//>
  `;
};
