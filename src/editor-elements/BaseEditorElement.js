export class BaseEditorElement {
  static name = 'editor-element';
  static regexp = /^$/i;

  static getElement(text, getMarker) {
    return document.createElement('div');
  }
}
