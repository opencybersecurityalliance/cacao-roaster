import CacaoConnect from '../connect/';
import CacaoContextPad from './CacaoContextPad';
import ContextPadModule from 'diagram-js/lib/features/context-pad';

export default {
  __depends__: [ContextPadModule, CacaoConnect],
  __init__: ['cacaoContextPad'],
  cacaoContextPad: ['type', CacaoContextPad],
};
