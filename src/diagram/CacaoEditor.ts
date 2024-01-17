import Diagram from 'diagram-js';

import PlaybookHandler from './modules/model/PlaybookHandler';

import ModelingModule from 'diagram-js/lib/features/modeling';
import MoveModule from 'diagram-js/lib/features/move';
import SelectionModule from 'diagram-js/lib/features/selection';
import ConnectionPreviewModule from 'diagram-js/lib/features/connection-preview';
import GlobalConnectModule from 'diagram-js/lib/features/global-connect';
import Canvas from 'diagram-js/lib/core/Canvas';
import ElementFactory from 'diagram-js/lib/core/ElementFactory';
import OverlaysModule from 'diagram-js/lib/features/overlays';
import GridSnappingModule from 'diagram-js/lib/features/grid-snapping';
import ResizeModule from 'diagram-js/lib/features/resize';

import AutoScrollModule from 'diagram-js/lib/features/auto-scroll';
import BendpointsModule from 'diagram-js/lib/features/bendpoints';
import CreateModule from 'diagram-js/lib/features/create';
import KeyboardMoveSelectionModule from 'diagram-js/lib/features/keyboard-move-selection';

import KeyboardMoveModule from 'diagram-js/lib/navigation/keyboard-move';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import TouchModule from 'diagram-js/lib/navigation/touch';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import HandToolModule from 'diagram-js/lib/features/hand-tool';
import SpaceToolModule from 'diagram-js/lib/features/space-tool';
import LassoToolModule from 'diagram-js/lib/features/lasso-tool';

import CacaoRenderer from './modules/draw';
import CacaoPaletteProvider from './modules/features/palette';
import CacaoModeler from './modules/features/modeling';
import CacaoConnectSnapping from './modules/features/snapping';
import CacaoSidePanel from './modules/features/side-panel';

import CacaoContextPad from './modules/features/context-pad';
import CacaoAutoPlace from './modules/features/auto-place';
import CacaoRules from './modules/features/rules';
import { Root } from 'diagram-js/lib/model/Types';
import CacaoConnect from './modules/features/connect';
import CacaoPlaybookHandler from './modules/model';
import CacaoExporter from './modules/features/exporter';
import CacaoValidator from './modules/features/validator';
import CacaoImporter from './modules/features/importer';
import CacaoHeader from './modules/features/header';
import EventBus from 'diagram-js/lib/core/EventBus';
import { Playbook } from 'lib/cacao2-js/src/Playbook';

import gridModule from 'diagram-js-grid';
import minimapModule from 'diagram-js-minimap';
import CommandStack from 'diagram-js/lib/command/CommandStack';
import CacaoSigning from './modules/features/signing';
import CacaoDialog from './modules/core/CacaoDialog';

export default class CacaoEditor {
  container: HTMLElement;
  canvasContainer: HTMLElement;
  diagram: Diagram;
  canvas: Canvas;
  elementFactory: ElementFactory;
  root: Root;
  eventBus: EventBus;
  playbookHandler: PlaybookHandler;
  commandStack: CommandStack;

  constructor(
    container: HTMLElement,
    playbook: Playbook,
    executionStatus: any = {},
  ) {
    this.container = container;
    this.canvasContainer = document.createElement('div');
    this.canvasContainer.className = 'canvas';
    container.appendChild(this.canvasContainer);

    this.diagram = new Diagram({
      canvas: {
        container: this.canvasContainer,
      },
      minimap: { open: true },
      executionStatus: {
        json: executionStatus,
      },
      container: this.container,
      playbook: playbook,
      modules: [...this.builtinModules, ...this.customModules],
    });

    this.canvas = this.diagram.get('canvas');
    this.eventBus = this.diagram.get('eventBus');
    this.elementFactory = this.diagram.get('elementFactory');
    this.root = this.elementFactory.createRoot();
    this.canvas.setRootElement(this.root);

    this.playbookHandler = this.diagram.get('playbookHandler');
    this.commandStack = this.diagram.get('commandStack');
    this.eventBus.fire('editor.loaded');
  }

  get playbook() {
    return this.playbookHandler.playbook;
  }

  addListener(listener: () => void) {
    this.eventBus.on('playbook.changed', listener);
  }

  async canLeave(): Promise<boolean> {
    if (
      await CacaoDialog.showConfirm(
        'Are you sure you want to leave this tab?',
        'You will not be able to recover the current playbook. <br>You can save it first using the EXPORT button before leaving.',
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  // default modules provided by the toolbox
  builtinModules = [
    ModelingModule,
    MoveModule,
    SelectionModule,
    ConnectionPreviewModule,
    GlobalConnectModule,
    OverlaysModule,
    AutoScrollModule,
    BendpointsModule,
    CreateModule,
    KeyboardMoveSelectionModule,
    GridSnappingModule,
    ResizeModule,

    KeyboardMoveModule,
    MoveCanvasModule,
    TouchModule,
    ZoomScrollModule,
    HandToolModule,
    SpaceToolModule,
    LassoToolModule,
    gridModule,
    minimapModule,
  ];

  customModules = [
    CacaoRenderer,
    CacaoImporter,
    CacaoPaletteProvider,
    CacaoRules,
    CacaoModeler,
    CacaoConnectSnapping,
    CacaoContextPad,
    CacaoSidePanel,
    CacaoPlaybookHandler,
    CacaoContextPad,
    CacaoAutoPlace,
    CacaoConnect,
    CacaoExporter,
    CacaoValidator,
    CacaoHeader,
    CacaoSigning,
  ];
}
