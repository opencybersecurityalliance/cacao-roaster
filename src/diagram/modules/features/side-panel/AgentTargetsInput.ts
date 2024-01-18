import PlaybookHandler from '../../model/PlaybookHandler';
import { identifierReferences } from '../../model/SchemaTypes';
import { BasicInput } from './BasicInput';
import { ComplexInput } from './ComplexInput';
import { PanelButton } from './PanelButton';
import PropertyPanel from './PropertyPanel';
import { SimpleInput } from './SimpleInput';
import { SingleInput } from './SingleInput';
import { SortableTable } from './SortableTable';
import { v4 as uuidv4 } from 'uuid';

/**
 * Displays a list of element within a table. It allows to select an
 * element, add it inside definition properties and edit it.
 */

export abstract class AgentTargetsInput extends ComplexInput {
  _defaultValues: Array<any> = [];
  _elements: Array<SingleInput> = [];
  _list!: HTMLElement;
  _addFunction!: any;
  _possibleValues: any;
  _playbookHandler!: PlaybookHandler;
  // Refresh function after changing values
  _reloadCallback: any = () => {};
  _clearFunction: any = () => {};

  constructor(
    propertyName: string,
    propertyType: string,
    possibleValues: any,
    container: HTMLElement,
  ) {
    super(propertyName, propertyType, container);
    this._possibleValues = possibleValues;
  }

  addToContainer(): void {
    let globalDiv = document.createElement('table');
    globalDiv.classList.add('sortable');

    let thead = this.createTHead();
    this._list = document.createElement('tbody');

    for (let item in this._possibleValues) {
      this.addElement({ [item]: this._possibleValues[item] });
    }

    globalDiv.appendChild(thead);
    globalDiv.appendChild(this._list);
    this._container.appendChild(globalDiv);

    new SortableTable(globalDiv);
  }

  /**
   * Adds the first row of the table. It represents the
   * title of each colomn
   * @returns HTMLTableSectionElement: the html row with titles
   */
  createTHead(): HTMLTableSectionElement {
    let thead = document.createElement('thead');
    let row = document.createElement('tr');

    let vadilationLine = document.createElement('th');
    let clearButton = new PanelButton('x', vadilationLine, () => {
      this._clearFunction();
    });
    clearButton.addClass('label__removeselection');
    clearButton.addToContainer();

    row.appendChild(vadilationLine);

    let typeLine = this.addRowWithButton('Type');
    row.appendChild(typeLine);

    let nameLine = this.addRowWithButton('Name');
    row.appendChild(nameLine);

    let descLine = this.addRowWithButton('Description');
    row.appendChild(descLine);

    let buttonLine = document.createElement('th');

    let dialog = document.createElement('dialog');
    dialog.classList.add('list-dialog');

    let propertyPanel = new PropertyPanel(
      this._playbookHandler,
      'agent-target',
      {},
      dialog,
    );
    propertyPanel.setIsAgentTarget(true);
    propertyPanel.setIsSubPanel(true);
    // Creates the "Close" to create the definition property and close the panel
    propertyPanel.addButton('OK', () => {
      let obj = (this._playbookHandler.playbook as any)[
        identifierReferences[this._propertyType]
      ];
      let value = propertyPanel.confirm();
      obj[value['type'] + '--' + uuidv4()] = value;
      this._playbookHandler.setPlaybookProperties(obj);
      propertyPanel.reloadClearedProperties('agent-target');
      this._reloadCallback();
    });

    propertyPanel.addAllProperties();

    let addButton = new PanelButton('+', buttonLine, () => {
      this._container.appendChild(dialog);
      dialog.showModal();
    });
    addButton.addClass('label__adder');
    addButton.addToContainer();

    row.appendChild(buttonLine);

    thead.appendChild(row);

    return thead;
  }

  /**
   * Creates a table cell which be used to sort a column inside
   * the table.
   * @param name string
   * @returns HTMLTableCellElement: a table cell which is a table header
   */
  addRowWithButton(name: string): HTMLTableCellElement {
    let row = document.createElement('th');
    let button = document.createElement('button');
    button.classList.add('sortable__header');
    button.textContent = name;
    let span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    button.appendChild(span);
    row.appendChild(button);
    return row;
  }

  addElement(item: any) {
    let itemInput = new SimpleInput(
      '',
      this._list,
      document.createElement('tr'),
    );
    itemInput.setBasicInput(this.createBasicInput(this._propertyName, item));
    this._elements.push(itemInput);
    itemInput.addToContainer();
  }

  setReloadCallback(callback: () => void) {
    this._reloadCallback = callback;
  }

  setClearFunction(callback: () => void) {
    this._clearFunction = callback;
  }

  abstract createBasicInput(name: string, value: any): BasicInput;

  setDefaultValues(defaultValues: any): void {
    this._defaultValues = defaultValues;
  }

  /**
   * Sets a function to be used when clicking the PanelButton.
   */
  setAddFunction(): void {
    this._addFunction = () => {
      this.addElement({});
    };
  }
}
