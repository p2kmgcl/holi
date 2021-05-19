import { CheckBoxEditorElement } from './CheckboxEditorElement.js';
import { EmojiEditorElement } from './EmojiEditorElement.js';
import { GitHubLinkEditorElement } from './GitHubLinkEditorElement.js';
import { GitHubPullRequestEditorElement } from './GitHubPullRequestEditorElement.js';
import { HrEditorElement } from './HrEditorElement.js';
import { JiraIssueEditorElement } from './JiraIssueEditorElement.js';
import { LinkEditorElement } from './LinkEditorElement.js';
import { GitHubRepoEditorElement } from './GitHubRepoEditorElement.js';

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
