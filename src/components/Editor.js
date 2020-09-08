import { RawDOM } from './RawDOM.js';
import { useCSS } from '../hooks/useCSS.js';
import { useStorage } from '../hooks/useStorage.js';
import { useCodeMirror } from '../hooks/useCodeMirror.js';
import { STORAGE_KEYS } from '../constants/STORAGE_KEYS.js';
import { EDITOR_ELEMENTS } from '../constants/EDITOR_ELEMENTS.js';

export const Editor = () => {
  const [value, setValue] = useStorage(STORAGE_KEYS.text, '');
  const elementRef = useCodeMirror(value, setValue, getElementForText);

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

    .Editor_mirror a {
      color: var(--highlight);
      white-space: initial;
    }

    .Editor_mirror a:hover {
      background: var(--highlight-background);
    }

    .Editor_mirror .editor-element_checkbox {
      background: var(--shadow-color);
      width: 1rem;
      height: 1rem;
      margin: 0;
      appearance: none;
      vertical-align: middle;
      border: solid 2px var(--border-color);
      box-sizing: border-box;
      font-size: 1rem;
      cursor: pointer;
      border-radius: 2px;
      transition: background ease var(--transition-duration);
      will-change: transition;
      outline: none;
    }

    .Editor_mirror .editor-element_checkbox:checked {
      background: var(--highlight);
    }

    .Editor_mirror .editor-element_emoji {
      display: inline-block;
      max-height: 1rem;
    }

    .Editor_mirror .editor-element_github-pull-request .status-description {
      display: inline-block;
      position: relative;
      transform: translateZ(0);
    }

    .Editor_mirror .editor-element_github-pull-request .status-description:hover::after {
      content: attr(data-status-description);
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

    .Editor_mirror .cm-header-1 {
      display: inline-block;
      border-bottom: solid 4px;
      margin-bottom: 8px;
    }

    .Editor_mirror > .CodeMirror-empty {
      opacity: 0.5;
    }

    .Editor_mirror .CodeMirror-selected {
      background-color: var(--highlight-background);
    }
  `);

  return html`<div class="Editor">
    <div class="Editor_mirror">
      <${RawDOM}
        className="Editor_textarea"
        elementRef=${elementRef}
        tagName="textarea"
        placeholder="Lorem ipsum dolor sit amet."
      />
    </div>
  </div>`;
};

function getElementForText(text, updateMark) {
  for (const EditorElement of EDITOR_ELEMENTS) {
    if (EditorElement.regexp.test(text)) {
      const element = EditorElement.getElement(text, updateMark);
      element.classList.add('editor-element');
      element.classList.add(`editor-element_${EditorElement.name}`);
      return element;
    }
  }
}
