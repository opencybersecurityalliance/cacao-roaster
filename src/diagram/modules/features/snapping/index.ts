import Snapping from 'diagram-js/lib/features/snapping';
import CacaoConnectSnapping from './CacaoConnectSnapping';

export default {
  __depends__: [Snapping],
  __init__: ['cacaoConnectSnapping'],
  cacaoConnectSnapping: ['type', CacaoConnectSnapping],
};
