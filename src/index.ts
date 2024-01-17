import 'bpmn-font/dist/css/bpmn.css';

import 'diagram-js/assets/diagram-js.css';
import 'diagram-js-minimap/assets/diagram-js-minimap.css';

import './style/main.css';
import MultiInstanceApplication from './app/multi-instance/MultiInstanceApplication';

window.addEventListener('load', () => {
  let container = document.getElementById('container');
  if (!container) {
    return;
  }
  new MultiInstanceApplication(container);
});
