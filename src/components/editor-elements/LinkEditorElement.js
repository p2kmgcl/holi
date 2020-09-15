import { EditorLink } from '../editor/EditorLink.js';

export const LinkEditorElement = ({ text, matches }) =>
  html`<${EditorLink} href=${text}>${matches[0]}<//>`;

LinkEditorElement.regexp = /^https?:\/\/([^\s]+)/i;
