import { RawDOM } from '../common/RawDOM.js';
import { useCSS } from '../../hooks/useCSS.js';
import { useStorage } from '../../hooks/useStorage.js';
import { useCodeMirror } from '../../hooks/useCodeMirror.js';
import { STORAGE_KEYS } from '../../constants/STORAGE_KEYS.js';

export const Editor = () => {
  const [value, setValue] = useStorage(STORAGE_KEYS.text, '');
  const [elementRef, portals] = useCodeMirror(value, setValue);

  useCSS(`
    .Editor {
      font-size: 1rem;
      max-width: 90ch;
      width: 100%;
      margin: 0 auto;
      padding: 4rem 2rem;
      box-sizing: border-box;
    }

    .Editor_textarea {
      display: none;
    }

    .Editor_mirror > .CodeMirror {
      color: var(--color);
      background: var(--background);
      font-family: inherit;
      height: 100%;
      overflow: visible;
    }

    .Editor_mirror .CodeMirror-scroll {
      overflow: visible !important;
    }

    .Editor_mirror .CodeMirror-cursor {
      border-left: solid 1ch var(--color);
      opacity: 0.5;
    }

    .Editor_mirror pre.CodeMirror-line  {
      z-index: 0;
    }

    .Editor_mirror pre.CodeMirror-line:hover {
      z-index: 2;
    }

    .Editor_mirror .editor-element-wrapper {
      display: inline-block;
    }

    .Editor_mirror .cm-header-1 {
      display: inline-block;
      border-bottom: solid 4px;
      margin-bottom: 8px;
    }

    .Editor_mirror > .CodeMirror-empty {
      opacity: 0.5;
    }

    .Editor_mirror .CodeMirror-selected {
      background-color: var(--shadow-color);
    }
  `);

  return html`<div className="Editor">
    <div className="Editor_mirror">
      <${RawDOM}
        className="Editor_textarea"
        elementRef=${elementRef}
        tagName="textarea"
        placeholder="Lorem ipsum dolor sit amet."
      />

      ${portals.map((portal) =>
        createPortal(html`<${portal.component} />`, portal.element)
      )}
    </div>
  </div>`;
};
