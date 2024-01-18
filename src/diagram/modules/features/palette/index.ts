import PaletteModule from 'diagram-js/lib/features/palette';
import CreateModule from 'diagram-js/lib/features/create';
import GlobalConnectModule from 'diagram-js/lib/features/global-connect';
import CacaoPaletteProvider from './CacaoPaletteProvider';
import Rules from 'diagram-js/lib/features/rules';

export default {
  __depends__: [PaletteModule, CreateModule, GlobalConnectModule, Rules],
  __init__: ['cacaoPaletteProvider'],
  cacaoPaletteProvider: ['type', CacaoPaletteProvider],
};
