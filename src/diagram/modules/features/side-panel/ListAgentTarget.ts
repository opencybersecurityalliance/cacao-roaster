import PlaybookHandler from '../../model/PlaybookHandler';
import { ComplexInput } from './ComplexInput';
import { PanelButton } from './PanelButton';
import { PropertyLabel } from './PropertyLabel';
import PropertyPanel from './PropertyPanel';
import { valueToDisplay } from '../../model/SchemaTypes';
import { BasicInput } from './BasicInput';
import { SimpleInput } from './SimpleInput';
import { UneditableInput } from './BasicInputs/UneditableInput';

/**
 * Contains a list of inputs. In the PropertyPanel, they can be
 * collapsed and extended. They have a '+' PanelButton to open a table. This
 * can be used to add, edit or clear the current value(s)
 */
export class ListAgentTarget extends ComplexInput {
  _dialogAddDef!: HTMLDialogElement;
  _displayDefDialog!: HTMLDialogElement;
  _playbookHandler: PlaybookHandler;
  //Function to refresh the panel after changes
  _refreshFunction: any;
  _agentTargetPanel!: PropertyPanel;
  _tempValue!: any;

  _list!: HTMLElement;
  _headerExpander!: HTMLElement;
  _elements: Array<SimpleInput> = [];
  _shouldDisplayElements!: boolean;
  //Function to inform the panel if the list is displayed
  _displayFunction: any;
  _isAgent: boolean;
  _listType: string;
  _agentOrTarget: string;
  _bodyListContainer: HTMLDivElement = document.createElement('div');

  constructor(
    propertyName: string,
    propertyType: string,
    container: HTMLElement,
    playbookHandler: PlaybookHandler,
    refreshFunction: any,
    displayFunction: any,
    isAgent: boolean = false,
  ) {
    super(propertyName, propertyType, container);
    this._playbookHandler = playbookHandler;
    this._refreshFunction = refreshFunction;
    this._displayFunction = displayFunction;
    this._isAgent = isAgent;
    this._bodyListContainer.classList.add(
      'section__property',
      'property--complexe',
    );
    if (isAgent) {
      this._listType = 'agents-display';
      this._agentOrTarget = 'agent';
    } else {
      this._listType = 'targets-display';
      this._agentOrTarget = 'targets';
    }
  }

  /**
   * Displays the graphic list.
   */
  expand() {
    this._list.classList.add('list--expanded');
    this._list.classList.remove('list--collapse');
    this._headerExpander.classList.add('expander--close');
    this._headerExpander.classList.remove('expander--open');
    this._bodyListContainer.classList.add('lisContainer--expanded');
  }

  /**
   * Hides the graphic list.
   */
  collapse() {
    this._list.classList.add('list--collapse');
    this._list.classList.remove('list--expanded');
    this._headerExpander.classList.remove('expander--close');
    this._headerExpander.classList.add('expander--open');
    this._bodyListContainer.classList.remove('lisContainer--expanded');
  }

  /**
   * Creates the arrow button to expand/collapse the list.
   */
  createExpanderButton() {
    this._headerExpander = document.createElement('div');
    this._headerExpander.classList.add('label__expander');

    this._headerExpander!.addEventListener('click', () => {
      if (this._list.classList.contains('list--expanded')) {
        this.collapse();
      } else {
        this.expand();
      }
    });
    this.collapse();
  }

  addToContainer() {
    this._list = document.createElement('div');
    this.createExpanderButton();
    this._list.classList.add('property__list');

    this._defaultValues?.forEach((item: any) => {
      this.addElement(item);
    });
    this._shouldDisplayElements = true;

    let labelHeader = document.createElement('div');
    labelHeader.classList.add('label--complexe');

    let label = new PropertyLabel(
      this._propertyName,
      this._required,
      labelHeader,
      this._description,
    );
    label.addToContainer();

    labelHeader.appendChild(this._headerExpander);

    this.setAddFunction();
    this.displayDefs();

    let editButton = new PanelButton('show all', labelHeader, () => {
      this.showDisplayDefPanel();
    });
    editButton.addClass('label__adder');
    editButton.addToContainer();

    labelHeader!.addEventListener('click', () => {
      if (this._list.classList.contains('list--expanded')) {
        this._shouldDisplayElements = true;
      } else {
        this._shouldDisplayElements = false;
      }
      this._displayFunction(this._propertyName, this._shouldDisplayElements);
    });
    if (this._shouldDisplayElements) {
      this.expand();
    } else {
      this.collapse();
    }

    this._bodyListContainer.appendChild(labelHeader);
    this._bodyListContainer.appendChild(this._list);
    this._container.appendChild(this._bodyListContainer);
  }

  /**
   * Adds a SimpleInput to the elements list.
   * @param item
   */
  addElement(item: any) {
    let itemInput = new SimpleInput(
      this._propertyName + this._elements.length,
      this._list,
      document.createElement('div'),
    );
    itemInput.setBasicInput(
      this.createBasicInput(this._propertyName + this._elements.length, item),
    );
    this._elements.push(itemInput);
    itemInput.addToContainer();
    this.expand();
    this._shouldDisplayElements = true;
  }

  /**
   * Creates a basic input of the specific type of the list
   * to be used in other functions.
   * @param name HTML attribute field 'name' of the input field
   * @param value default value of the input field
   */
  createBasicInput(name: string, value: string): BasicInput {
    if (Object.entries(value).length != 0) {
      let val: any;
      if (this._isAgent) {
        val = this._playbookHandler.getAgent(value);
      } else {
        val = this._playbookHandler.getTarget(value);
      }
      let displayedValue = '';
      if (Object.keys(valueToDisplay).includes('agent-target')) {
        valueToDisplay['agent-target'].some(field => {
          if ((val as any)[field] != undefined && (val as any)[field] != '') {
            displayedValue = (val as any)[field];
            return true;
          }
        });
      }
      return new UneditableInput(name, displayedValue);
    }
    return new UneditableInput(name, '');
  }

  /**
   * Creates and displays the dialog with the table, displaying all agents/targets.
   */
  displayDefs() {
    this._displayDefDialog = document.createElement('dialog');
    this._displayDefDialog.classList.add('agent-dialog');

    this._container.appendChild(this._displayDefDialog);
    this._agentTargetPanel = new PropertyPanel(
      this._playbookHandler,
      this._listType,
      this._defaultValues,
      this._displayDefDialog,
    );
    this._agentTargetPanel.setIsAgentTarget(true);
    this._agentTargetPanel.setIsSubPanel(true);

    //Creates the "cancel" button to go back
    this._agentTargetPanel.addButton('Cancel', () => {
      this._agentTargetPanel.reloadClearedDifferentProperties(
        this._listType,
        this._tempValue,
      );
      this._displayDefDialog.close();
      this._refreshFunction(this._tempValue);
    });

    //Creates the "ok" button to submit selected values
    this._agentTargetPanel.addButton('Confirm', () => {
      let sumitedValue = this._agentTargetPanel.submit();
      this._tempValue =
        Object.keys(sumitedValue).length != 0
          ? Object.values(sumitedValue)[0]
          : undefined;
      this._displayDefDialog.close();
      this._refreshFunction(this._tempValue);
    });

    this._agentTargetPanel.addDifferentProperties();
  }

  /**
   * Displays the panel to add a definition property
   */
  showAddDefPanel() {
    this._dialogAddDef.showModal();
  }
  /**
   *Displays the table with all defintion property
   */
  showDisplayDefPanel() {
    this._displayDefDialog.showModal();
  }

  setDisplayed(isDisplayedList: boolean): void {
    this._shouldDisplayElements = isDisplayedList;
  }

  setDefaultValues(defaultValues: any): void {
    if (Array.isArray(defaultValues)) {
      this._defaultValues = defaultValues;
    } else {
      this._defaultValues = defaultValues ? [defaultValues] : [];
    }
    this._tempValue = this._defaultValues;
  }

  setAddFunction(): void {}

  submit(): any {
    return Object.values(this._agentTargetPanel.submit())[0];
  }
}
