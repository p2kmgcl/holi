import { Bookmarks } from './bookmarks/Bookmarks.js';
import { useCSS } from '../hooks/useCSS.js';
import { Editor } from './editor/Editor.js';

export const App = () => {
  useCSS(`
    .App {
      display: flex;
      height: 100vh;
      position: relative;
    }

    .App_editor,
    .App_bookmarks {
      height: 100%;
    }

    .App_editor {
      flex-grow: 1;
      margin-right: var(--bookmarks-width);
      width: 100vw;
      box-sizing: border-box;
      overflow: auto;
    }

    .App_bookmarks {
      position: fixed;
      right: 0;
      top: 0;
      z-index: 10;
    }
  `);

  return html`
    <div class="App">
      <div class="App_editor">
        <${Editor} />
      </div>

      <div class="App_bookmarks">
        <${Bookmarks} />
      </div>
    </div>
  `;
};
