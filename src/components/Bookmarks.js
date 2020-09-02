import { BookmarkService } from '../services/BookmarkService.js';
import { useCSS } from '../hooks/useCSS.js';
import { BookmarkChildren } from './BookmarkChildren.js';

export const Bookmarks = () => {
  const [bookmarkBar, setBookmarkBar] = useState({
    children: [],
  });

  useEffect(() => {
    BookmarkService.getBookmarkBar().then((bookmarkBar) => {
      setBookmarkBar(bookmarkBar);
    });
  }, []);

  useCSS(`
    .Bookmarks {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      background: var(--background);
      overflow-y: scroll;
      height: 100%;
      width: var(--bookmarks-width);
      border-left: solid thin transparent;
      padding: 1rem;
      box-sizing: border-box;
      transition: border-left-color ease var(--transition-duration),
        box-shadow ease var(--transition-duration),
        width ease var(--transition-duration),
        opacity ease var(--transition-duration) var(--transition-duration);
      opacity: 0.5;
      will-change: border-left-color, box-shadow, width, opacity;
    }

    .Bookmarks:hover {
      box-shadow: 0 0 50px var(--shadow-color);
      border-left-color: var(--border-color);
      transition: border-left-color ease var(--transition-duration) calc(var(--transition-duration) / 3),
        box-shadow ease var(--transition-duration) calc(var(--transition-duration) / 3),
        width ease var(--transition-duration) calc(var(--transition-duration) / 3),
        opacity ease calc(var(--transition-duration) / 3);
      width: 40ch;
      opacity: 1;
    }
  `);

  return html`
    <div class="Bookmarks">
      <${BookmarkChildren} bookmark=${bookmarkBar} />
    </div>
  `;
};
