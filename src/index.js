import { App } from './components/App.js';
import { CSSContextProvider } from './hooks/useCSS.js';
import { StorageService } from './services/StorageService.js';
import { I18NService } from './services/I18NService.js';
import { FetchService } from './services/FetchService.js';

document.head.querySelector('title').innerText = I18NService.get('newTab');

Promise.all([StorageService.init(), FetchService.init()]).then(() => {
  const app = document.getElementById('app');
  app.classList.remove('loading');
  ReactDOM.render(html`<${CSSContextProvider}><${App} /><//>`, app);
});
