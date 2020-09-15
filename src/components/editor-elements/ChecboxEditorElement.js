import { useCSS } from '../../hooks/useCSS.js';

export const CheckBoxEditorElement = ({ marker, matches }) => {
  const checked = matches[0].toLowerCase() === 'x';

  const handleChange = (event) => {
    const { from, to } = marker.find();

    marker.doc.replaceRange(
      `[${event.target.checked ? 'x' : ''}]`,
      from,
      to,
      'paste'
    );
  };

  useCSS(`
    .CheckboxEditorElement {
      background: var(--background-color);
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

    .CheckboxEditorElement:checked {
      background: var(--highlight);
    }
  `);

  return html`<input
    className="CheckboxEditorElement"
    checked=${checked}
    onChange=${handleChange}
    type="checkbox"
  />`;
};

CheckBoxEditorElement.regexp = /^\[(x?)\]$/i;
