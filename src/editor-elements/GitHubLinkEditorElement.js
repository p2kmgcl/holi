import { BaseEditorElement } from './BaseEditorElement.js';

export class GitHubLinkEditorElement extends BaseEditorElement {
  static name = 'github-link';
  static regexp = /^https:\/\/github\.com\//i;

  static getElement(text) {
    const anchor = document.createElement('a');
    anchor.href = text;
    anchor.innerText = text.replace(GitHubLinkEditorElement.regexp, '');
    return anchor;
  }
}
