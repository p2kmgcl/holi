import { useCSS } from '../../hooks/useCSS.js';

export const HrEditorElement = () => {
  useCSS(`
    .editor-element-wrapper--HrEditorElement {
      width: 100%;
    }
  `);

  return html`<hr className="HrEditorElement" />`;
};

HrEditorElement.regexp = /^---$/;
