export class BaseEditorElement {
  static name = 'editor-element';
  static regexp = /^$/i;

  static getEditorTooltipHTMLElement(emoji, tooltip) {
    const element = document.createElement('span');
    element.classList.add('editor-tooltip');
    element.dataset.title = tooltip;
    element.innerText = `${emoji} `;

    return element;
  }

  static getElement(text, getMarker) {
    return document.createElement('div');
  }
}
