import { BaseEditorElement } from './BaseEditorElement.js';

export class CheckBoxEditorElement extends BaseEditorElement {
  static name = 'checkbox';
  static regexp = /^\[(x?)\]$/i;

  static getElement(text, getMarker) {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked =
      CheckBoxEditorElement.regexp.exec(text)[1].toLowerCase() === 'x';

    input.addEventListener('change', () => {
      const marker = getMarker();
      const { from, to } = marker.find();

      marker.doc.replaceRange(
        `[${input.checked ? 'x' : ''}]`,
        from,
        to,
        'paste'
      );
    });

    return input;
  }
}
