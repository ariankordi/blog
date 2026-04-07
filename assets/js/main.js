import './light_dark.js';
import './tabs.js';
import './turbo.es2017-esm.js';
import zoomListener from './zoom-vanilla.js';
import './toc.js';
import './codeblock.js';


// Turbolinks.start();
const turboInitHandler = () => {
  Turbo.setProgressBarDelay(250);
  document.removeEventListener('turbo:load', turboInitHandler);
}
document.addEventListener('turbo:load', turboInitHandler);

const loadZoomListener = () => { zoomListener().listen(); };
document.addEventListener('turbo:load', loadZoomListener);
