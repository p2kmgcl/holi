import { BaseEditorElement } from './BaseEditorElement.js';
import { EmojiService } from '../services/EmojiService.js';

export class EmojiEditorElement extends BaseEditorElement {
  static name = 'emoji';
  static regexp = /^:([a-z0-9\-+_]+):?$/i;

  static getElement(text, getMarker) {
    const [, keyword] = EmojiEditorElement.regexp.exec(text);
    const span = document.createElement('span');

    span.innerText = text;

    EmojiService.getFromText(keyword).then((emoji) => {
      const marker = getMarker();

      if (emoji) {
        span.innerText = emoji;
        marker.changed();
      } else {
        marker.clear();
      }
    });

    return span;
  }
}
