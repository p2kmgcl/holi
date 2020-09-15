import { EmojiService } from '../../services/EmojiService.js';
import { useCSS } from '../../hooks/useCSS.js';

export const EmojiEditorElement = ({ marker, matches }) => {
  const [keyword] = matches;
  const [emoji, setEmoji] = useState('');

  useEffect(() => {
    EmojiService.getFromText(keyword).then((emoji) => {
      setEmoji(emoji || '');
    });
  }, [keyword]);

  useCSS(`
    .EmojiEditorElement {
      display: inline-block;
      max-height: 1rem;
    }
  `);

  return html`<span class="EmojiEditorElement"
    >${emoji || `:${keyword}:`}</span
  >`;
};

EmojiEditorElement.regexp = /^:([a-z0-9\-+_]+):$/i;
