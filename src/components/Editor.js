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
    }

    .Editor_mirror .CodeMirror-cursor {
      border-left: solid 1ch var(--color);
      opacity: 0.5;
    }

    .Editor_mirror a {
      color: var(--highlight);
      white-space: nowrap;
    }

    .Editor_mirror a:hover {
      background: var(--highlight-background);
    }

    .Editor_mirror .editor-element_checkbox {
      background: var(--shadow-color);
      width: 0.8rem;
      height: 0.8rem;
      margin: 0;
      appearance: none;
      vertical-align: baseline;
      border: solid thin var(--border-color);
      cursor: pointer;
      border-radius: 2px;
      transition: background ease var(--transition-duration);
      will-change: transition;
      outline: none;
    }

    .Editor_mirror .editor-element_checkbox:checked {
      background: var(--highlight);
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
