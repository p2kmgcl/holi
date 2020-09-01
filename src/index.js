import { App } from './components/App.js';
import { CSSContextProvider } from './hooks/useCSS.js';
import { StorageService } from './services/StorageService.js';
import { I18NService } from './services/I18NService.js';

document.head.querySelector('title').innerText = I18NService.get('newTab');

StorageService.init().then(() => {
  const app = document.getElementById('app');
  app.classList.remove('loading');
  preact.render(html`<${CSSContextProvider}><${App} /><//>`, app);
});
