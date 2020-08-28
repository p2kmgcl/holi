import { App } from './components/App.js';
import { CSSContextProvider } from './hooks/useCSS.js';
import { StorageService } from './services/StorageService.js';
import { I18NService } from './services/I18NService.js';

document.head.querySelector('title').innerText = I18NService.get('newTab');

StorageService.init().then(() => {
  preact.render(
    html`<${CSSContextProvider}><${App} /><//>`,
    document.getElementById('app')
  );
});
