import { BaseEditorElement } from './BaseEditorElement.js';

export class LinkEditorElement extends BaseEditorElement {
  static name = 'link';
  static regexp = /^https?:\/\//i;

  static getElement(text) {
    const anchor = document.createElement('a');
    anchor.href = text;
    anchor.innerText = text.replace(LinkEditorElement.regexp, '');
    return anchor;
  }
}
