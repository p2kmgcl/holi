export class BaseEditorElement {
  static name = 'editor-element';
  static regexp = /^$/i;

  static getElement() {
    return document.createElement('div');
  }
}
