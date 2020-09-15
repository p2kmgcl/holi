import { useCSS } from '../../hooks/useCSS.js';
import { Placeholder } from '../common/Placeholder.js';

export const BookmarkLink = ({ bookmark }) => {
  useCSS(`
    .BookmarkLink {
      align-items: center;
      border-radius: 4px;
      box-sizing: border-box;
      color: inherit;
      display: flex;
      flex-direction: row-reverse;
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
      text-decoration: none;
      transition: background ease var(--transition-duration);
      width: 100%;
      will-change: background;
    }

    .BookmarkLink:hover {
      background: var(--highlight-background);
      color: var(--highlight);
      font-weight: bolder;
      text-decoration: underline;
    }

    .BookmarkLink_label {
      display: block;
      flex-shrink: 1;
      margin-right: 1ch;
      overflow: hidden;
      white-space: nowrap;
    }
  `);

  return html`
    <${Placeholder} height="calc(16px + 1rem)" width="100%">
      <a className="BookmarkLink" href=${bookmark.url}>
        <img
          className="BookmarkLink_image"
          src="chrome://favicon/${bookmark.url}"
          alt=""
          width="16"
          height="16"
        />

        <span className="BookmarkLink_label">
          ${bookmark.title}
        </span>
      </a>
    <//>
  `;
};
