import CacaoAutoPlace from './CacaoAutoPlace';
import AutoPlaceModule from 'diagram-js/lib/features/auto-place';

export default {
  __depends__: [AutoPlaceModule],
  __init__: ['cacaoAutoPlace'],
  cacaoAutoPlace: ['type', CacaoAutoPlace],
};
