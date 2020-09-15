import { useCSS } from '../hooks/useCSS.js';

export const EditorTooltip = ({ label, tooltip }) => {
  useCSS(`
    .EditorTooltip {
      display: inline-block;
      position: relative;
      transform: translateZ(0);
      text-decoration: inherit;
      white-space: pre;
    }

    .EditorTooltip:hover::after {
      content: attr(data-title);
      display: block;
      position: absolute;
      bottom: 1rem;
      left: 0;
      white-space: pre;
      padding: 0.5rem;
      background: var(--highlight-background);
      color: var(--highlight);
      border: solid thin var(--border-color);
      box-shadow: 0 0 1rem var(--shadow-color);
      border-radius: 4px;
      pointer-events: none;
      font-size: 0.875rem;
      z-index: 1000;
    }
  `);

  return html`<span class="EditorTooltip" data-title=${tooltip}>
    ${label}${' '}
  </span>`;
};
