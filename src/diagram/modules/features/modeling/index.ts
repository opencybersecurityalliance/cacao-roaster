import CacaoLayouter from './CacaoLayouter';
import CacaoModeling from './CacaoModeling';
import CacaoUpdater from './CacaoUpdater';
import CroppingConnectionDocking from 'diagram-js/lib/layout/CroppingConnectionDocking';

export default {
  __init__: ['layouter', 'updater', 'modeling'],
  layouter: ['type', CacaoLayouter],
  updater: ['type', CacaoUpdater],
  modeling: ['type', CacaoModeling],
  connectionDocking: ['type', CroppingConnectionDocking],
};
