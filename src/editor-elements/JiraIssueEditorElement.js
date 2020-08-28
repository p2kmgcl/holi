import { BaseEditorElement } from './BaseEditorElement.js';

export class JiraIssueEditorElement extends BaseEditorElement {
  static name = 'jira-issue';
  static regexp = /^https:\/\/issues\.liferay\.com\/browse\//i;

  static getElement(text) {
    const anchor = document.createElement('a');
    anchor.href = text;
    anchor.innerText = text.replace(JiraIssueEditorElement.regexp, '');
    return anchor;
  }
}
