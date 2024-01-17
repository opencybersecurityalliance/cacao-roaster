import PlaybookHandler from '../../model/PlaybookHandler';
import PropertyPanel from './PropertyPanel';
import { PanelButton } from './PanelButton';
import { valueToDisplay } from '../../model/SchemaTypes';
import { BasicInput } from './BasicInput';

/**
 * Creates a counter signature inside another signature.
 */

export class CounterSignatureInput extends BasicInput {
  _doesExist: boolean = false;
  _itemButton?: PanelButton;
  _propertyPanel?: PropertyPanel;
  _playbookHandler: PlaybookHandler;
  _defaultValues: object = {};
  _displayDefDialog: HTMLDialogElement = document.createElement('dialog');
  _propertyType = 'signature';

  constructor(
    propertyName: string,
    propertyType: string,
    playbookHandler: PlaybookHandler,
    defaultValue: any,
  ) {
    super(propertyName, propertyType);
    this._playbookHandler = playbookHandler;
    this._displayDefDialog.classList.add('list-dialog');
    this._defaultValues = defaultValue;
  }

  addToContainer(): void {
    if (
      this._defaultValues != undefined &&
      Object.keys(this._defaultValues).length != 0
    ) {
      let displayedValue = '';
      if (Object.keys(valueToDisplay).includes('signature')) {
        valueToDisplay['signature'].some(field => {
          if (
            (this._defaultValues as any)[field] != undefined &&
            (this._defaultValues as any)[field] != ''
          ) {
            displayedValue = (this._defaultValues as any)[field];
            return true;
          }
        });
      }

      let signatureButton = new PanelButton(
        displayedValue,
        this._container,
        () => {
          this.showPanel();
        },
      );
      signatureButton.addClass('property__container');
      signatureButton.addClass('container--simple');
      signatureButton.addClass('container--disabled');
      signatureButton.addToContainer();

      this._container.appendChild(this._displayDefDialog);
      this._propertyPanel = new PropertyPanel(
        this._playbookHandler,
        this._propertyType,
        this._defaultValues,
        this._displayDefDialog,
      );
      this._propertyPanel.setIsAgentTarget(false);
      this._propertyPanel.setIsSubPanel(true);

      //Creates the "close" button to go back
      this._propertyPanel.addButton('Close', () => {
        this._displayDefDialog.close();
      });

      this._propertyPanel.addAllProperties();
    }
  }

  //show the definition object panel.
  showPanel() {
    this._displayDefDialog.showModal();
  }

  submit(): any {
    return this._propertyPanel?.confirm();
  }
}
