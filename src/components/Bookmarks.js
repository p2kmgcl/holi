import { BookmarkService } from '../services/BookmarkService.js';
import { BookmarkLink } from './BookmarkLink.js';
import { BookmarkCategory } from './BookmarkCategory.js';
import { useCSS } from '../hooks/useCSS.js';

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
      background: var(--background);
      overflow-y: auto;
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
      box-shadow: 0 0 100px var(--shadow-color);
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
      ${bookmarkBar.children.map(
        (bookmark) =>
          html`<${getBookmarkComponent(bookmark)}
            bookmark=${bookmark}
            key=${bookmark.id}
          />`
      )}
    </div>
  `;
};

const getBookmarkComponent = (bookmark) =>
  bookmark.url ? BookmarkLink : BookmarkCategory;
