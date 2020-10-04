import { EmojiService } from '../services/EmojiService.js';

export const EmojiEditorElement = ({ matches, onRender }) => {
  const element = document.createElement('span');
  const [keyword] = matches;

  element.innerText = `:${keyword}:`;

  EmojiService.getFromText(keyword).then((emoji) => {
    element.innerText = emoji || `:${keyword}:`;
    onRender();
  });

  return element;
};

EmojiEditorElement.regexp = /^:([a-z0-9\-+_]+):$/i;
