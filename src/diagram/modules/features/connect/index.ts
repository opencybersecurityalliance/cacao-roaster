import CacaoConnect from './CacaoConnect';
import CacaoConnectPreview from './CacaoConnectPreview';

export default {
  __depends__: [],
  __init__: ['cacaoConnect', 'cacaoConnectPreview'],
  cacaoConnect: ['type', CacaoConnect],
  cacaoConnectPreview: ['type', CacaoConnectPreview],
};
