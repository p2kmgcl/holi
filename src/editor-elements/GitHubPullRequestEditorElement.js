import { BaseEditorElement } from './BaseEditorElement.js';

export class GitHubPullRequestEditorElement extends BaseEditorElement {
  static name = 'github-pull-request';
  static regexp = /^https:\/\/github\.com\//i;

  static getElement(text) {
    const anchor = document.createElement('a');
    anchor.href = text;
    anchor.innerText = text.replace(GitHubPullRequestEditorElement.regexp, '');
    return anchor;
  }
}
