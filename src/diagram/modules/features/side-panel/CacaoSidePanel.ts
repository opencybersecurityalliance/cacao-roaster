import EventBus from 'diagram-js/lib/core/EventBus';
import CacaoUtils from '../../core/CacaoUtils';
import PlaybookHandler, {
  ContextPlaybookAttrs,
} from '../../model/PlaybookHandler';
import CacaoRules from '../rules/CacaoRules';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import SelectionTool from 'diagram-js/lib/features/selection/Selection';
import { WorkflowStep } from 'cacao2-js';
import PropertyPanel from './PropertyPanel';
import CacaoModeling from '../modeling/CacaoModeling';
import { Shape } from 'diagram-js/lib/model';
import isEqual from 'lodash.isequal';

/**
 * type to consider the config module
 */
export type Config = {
  parent: HTMLElement;
};

/**
 * This class generate the side panel when there is a click event on a shape
 */
export default class CacaoSidePanel {
  _eventBus: EventBus;
  _container: HTMLElement;
  _playbookHandler: PlaybookHandler;
  _cacaoRules: CacaoRules;
  _cacaoModeling: CacaoModeling;
  _selection: SelectionTool;
  _stepId: string = '';
  _propertyPanel!: PropertyPanel;
  _onConfirm: any = () => {};
  _elementRegistry: ElementRegistry;
  _shape!: Shape;
  _objectOpened: 'metadata' | 'step' | undefined;

  static $inject: string[];

  /**
   * create a CacaoSidePanel
   * connect the click bus to generate the side panel
   *
   * @param eventBus a module which contains the events
   * @param config a module which contains the container where set up the side panel
   * @param  playbook a module which represents the controller to commincate with the cacao model
   */
  constructor(
    eventBus: EventBus,
    parent: HTMLElement,
    playbookHandler: PlaybookHandler,
    cacaoRules: CacaoRules,
    elementRegistry: ElementRegistry,
    modeling: CacaoModeling,
    selection: SelectionTool,
  ) {
    this._eventBus = eventBus;
    this._container = document.createElement('div');
    this._container.classList.add('sidepanel');
    parent.appendChild(this._container);
    this._playbookHandler = playbookHandler;
    this._cacaoRules = cacaoRules;
    this._cacaoModeling = modeling;
    this._selection = selection;
    this._elementRegistry = elementRegistry;

    eventBus.on('editor.loaded', () => {
      this.openMetadataPanel();
      this.confirmAndClosePanel();
      this._playbookHandler.initialPlaybook = this._playbookHandler.playbook;
    });

    this._eventBus.on('selection.changed', (event: any) => {
      let selection = event.newSelection;

      //do not leave the sidepanel if we stay with the same shape selected
      if (
        selection != undefined &&
        selection.length == 1 &&
        selection[0]?.id == this?._shape?.id
      ) {
        return;
      }

      if (this._propertyPanel) {
        if (
          this._objectOpened == 'step' &&
          this._shape &&
          this._elementRegistry.getAll().includes(this._shape)
        ) {
          this.confirmAndClosePanel();
        } else if (this._objectOpened == 'metadata') {
          this.confirmAndClosePanel();
        }
      }

      this.closeSidePanel();

      if (selection != undefined || selection.length == 1) {
        let element = selection[0];
        if (element && element.type) {
          if (CacaoUtils.isConstructType(element.type)) {
            this.openSidepanel(element);
          }
        }
      }
    });

    // Remove the side panel if the shape is removed
    this._eventBus.on('playbook.changed', (context: ContextPlaybookAttrs) => {
      if (
        context.action == 'remove.shape' &&
        context?.element?.id == this._stepId
      ) {
        this.closeSidePanel();
      } else if (
        ['add.connection', 'update.connection', 'remove.connection'].includes(
          context.action,
        )
      ) {
        if (this._propertyPanel) {
          // The first parameter is true as we are sure that this is not a command, as they don't have step_ids.
          this._propertyPanel.reloadProperties(
            true,
            this._propertyPanel._propertyType,
            true,
            this._playbookHandler.getStep(this._stepId),
          );
        }
      }
    });

    this.hide();
  }

  get isOpen(): boolean {
    return this._container.classList.contains('sidepanel--open');
  }

  closeSidePanel() {
    this.hide();
    this._stepId = '';
    this._shape = undefined!;
    this._objectOpened = undefined;
    this._propertyPanel = undefined!;
  }

  confirmAndClosePanel() {
    if (this._propertyPanel) {
      if (this._propertyPanel?.confirm) {
        this._propertyPanel.confirm();
      }
      this._onConfirm();
    }
    this.closeSidePanel();
  }

  cancelAndClosePanel() {
    if (this._propertyPanel) {
      if (this._propertyPanel?.cancel) {
        this._propertyPanel.cancel();
      }
    }
    this.closeSidePanel();
  }

  private hide() {
    this._container.classList.remove('sidepanel--open');
    this._container.classList.add('sidepanel--close');
    document
      .getElementsByClassName('djs-minimap')[0]
      ?.classList.remove('minimap--move');
  }

  private show() {
    this._container.classList.remove('sidepanel--close');
    this._container.classList.add('sidepanel--open');
    document
      .getElementsByClassName('djs-minimap')[0]
      ?.classList.add('minimap--move');
  }

  openSidepanel(element: Shape) {
    this.show();
    this._shape = element;
    this._objectOpened = 'step';

    this._onConfirm = () => {
      if (
        !isEqual(
          this._propertyPanel._previousPanel,
          this._propertyPanel.submit(),
        )
      ) {
        this._cacaoModeling.updateShape(element);
      } else {
        this._cacaoModeling.updateGraphicalShapeOnCanvas(element);
      }
    };

    this._stepId = element.id;
    const step: WorkflowStep = this._playbookHandler.getStep(element.id);
    this._propertyPanel = new PropertyPanel(
      this._playbookHandler,
      step.type,
      this._playbookHandler.playbook.workflow[element.id],
      this._container,
      element.id,
    );
    if (this._stepId) {
      this._propertyPanel.setIsAgentTarget(true);
    }

    this._propertyPanel.addButton('Cancel', () => {
      this.cancelAndClosePanel();
      this._selection.deselect(this._selection.get()[0]);
    });
    this._propertyPanel.setNotifyFunction(this._onConfirm);
    this._propertyPanel.addButton('Confirm', () => {
      this.confirmAndClosePanel();
      this._selection.deselect(this._selection.get()[0]);
    });

    this._container.innerHTML = '';
    this._propertyPanel.addAllProperties();
    this._propertyPanel.setPreviousPanel(this._propertyPanel.submit());
    this._propertyPanel.setPreviousStatus(
      this._playbookHandler._executionStatus,
    );
  }

  openMetadataPanel() {
    if (this._selection.get()[0]) {
      this._selection.deselect(this._selection.get()[0]);
    }
    this.show();
    this._objectOpened = 'metadata';

    this._onConfirm = () => {
      if (
        !isEqual(
          this._propertyPanel._previousPanel,
          this._propertyPanel.submit(),
        )
      ) {
        let context: ContextPlaybookAttrs = {
          action: 'update.metadata',
          element: undefined as any,
        };
        this._eventBus.fire('playbook.changed', context);
      }
    };

    this._stepId = '';
    this._propertyPanel = new PropertyPanel(
      this._playbookHandler,
      'playbook',
      this._playbookHandler.playbook,
      this._container,
    );
    // Metadata contains AgentTargets.
    this._propertyPanel.setIsAgentTarget(true);

    this._propertyPanel.addButton('Cancel', () => {
      this.cancelAndClosePanel();
    });
    this._propertyPanel.setNotifyFunction(this._onConfirm);
    this._propertyPanel.addButton('Confirm', () => {
      this.confirmAndClosePanel();
    });

    this._container.innerHTML = '';
    this._propertyPanel.addAllProperties();
    this._propertyPanel.setPreviousPanel(this._propertyPanel.submit());
  }
}

CacaoSidePanel.$inject = [
  'eventBus',
  'config.canvas.container',
  'playbookHandler',
  'cacaoRules',
  'elementRegistry',
  'modeling',
  'selection',
];
