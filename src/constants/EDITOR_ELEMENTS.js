import { CheckBoxEditorElement } from '../editor-elements/CheckboxEditorElement.js';
import { EmojiEditorElement } from '../editor-elements/EmojiEditorElement.js';
import { GitHubLinkEditorElement } from '../editor-elements/GitHubLinkEditorElement.js';
import { GitHubPullRequestEditorElement } from '../editor-elements/GitHubPullRequestEditorElement.js';
import { HrEditorElement } from '../editor-elements/HrEditorElement.js';
import { JiraIssueEditorElement } from '../editor-elements/JiraIssueEditorElement.js';
import { LinkEditorElement } from '../editor-elements/LinkEditorElement.js';
import { GitHubRepoEditorElement } from '../editor-elements/GitHubRepoEditorElement.js';

export const EDITOR_ELEMENTS = [
  GitHubPullRequestEditorElement,
  GitHubRepoEditorElement,
  GitHubLinkEditorElement,
  JiraIssueEditorElement,
  LinkEditorElement,
  CheckBoxEditorElement,
  EmojiEditorElement,
  HrEditorElement,
];
