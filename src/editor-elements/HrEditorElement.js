import { BaseEditorElement } from './BaseEditorElement.js';

export class HrEditorElement extends BaseEditorElement {
  static name = 'hr';
  static regexp = /^---$/;

  static getElement() {
    return document.createElement('hr');
  }
}
