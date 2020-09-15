import { useCSS } from '../hooks/useCSS.js';

export const EditorLink = ({ children, href, closed }) => {
  useCSS(`
    .EditorLink {
      color: var(--highlight);
      white-space: initial;
    }

    .EditorLink:hover {
      background: var(--highlight-background);
    }

    .EditorLink--closed {
      text-decoration: line-through;
    }
  `);

  return html`<a
    class="EditorLink ${closed ? 'EditorLink--closed' : ''}"
    href=${href}
  >
    ${children}
  </a>`;
};
