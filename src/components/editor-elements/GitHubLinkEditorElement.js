import { EditorLink } from '../editor/EditorLink.js';

export const GitHubLinkEditorElement = ({ matches, text }) =>
  html`<${EditorLink} href=${text}>${matches[0]}<//>`;

GitHubLinkEditorElement.regexp = /^https:\/\/github\.com\/([^\s]+)/i;
