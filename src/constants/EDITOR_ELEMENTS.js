import { HrEditorElement } from '../components/editor-elements/HrEditorElement.js';
import { CheckBoxEditorElement } from '../components/editor-elements/ChecboxEditorElement.js';
import { LinkEditorElement } from '../components/editor-elements/LinkEditorElement.js';
import { EmojiEditorElement } from '../components/editor-elements/EmojiEditorElement.js';
import { GitHubLinkEditorElement } from '../components/editor-elements/GitHubLinkEditorElement.js';
import { JiraIssueEditorElement } from '../components/editor-elements/JiraIssueEditorElement.js';
import { GitHubPullRequestEditorElement } from '../components/editor-elements/GitHubPullRequestEditorElement.js';

export const EDITOR_ELEMENTS = [
  HrEditorElement,
  CheckBoxEditorElement,
  EmojiEditorElement,
  GitHubPullRequestEditorElement,
  GitHubLinkEditorElement,
  JiraIssueEditorElement,
  LinkEditorElement,
];
