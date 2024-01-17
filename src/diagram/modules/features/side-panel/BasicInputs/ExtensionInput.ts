import PlaybookHandler from 'src/diagram/modules/model/PlaybookHandler';
import { BasicInput } from '../BasicInput';
import { PanelButton } from '../PanelButton';
import PropertyPanel from '../PropertyPanel';
import { DropDownInput } from './DropDownInput';
import {
  extractSchemaTypes,
  schemaDictWithoutCommands,
} from '../../../model/SchemaTypes';

/**
 * The input to display and edit definition properties.
 */
export class ExtensionInput extends BasicInput {
  _key: string;
  _value: any;
  _propertyPanel!: PropertyPanel;
  _playbookHandler: PlaybookHandler;
  _propertyType: string;
  _dialog!: HTMLDialogElement;
  _opendropdown!: DropDownInput;
  _options: any;
  _usesSchema: boolean = false;
  _props: any = {};

  constructor(
    inputName: string,
    initialValue: any,
    playbookHandler: PlaybookHandler,
    propertyType: string,
    options: any,
  ) {
    super(inputName, initialValue);
    if (Object.keys(initialValue).length === 0) {
      this._key = '';
      this._value = '';
    } else {
      [[this._key, this._value]] = Object.entries(initialValue) as [
        [string, string],
      ];
      try {
        if (this._key != '' && typeof this._value !== 'string') {
          let stringified = JSON.stringify(this._value, null, 2);
          this._value = stringified;
        }
      } catch (error) {}
    }
    this._playbookHandler = playbookHandler;
    this._propertyType = propertyType;
    this._options = options;
  }

  loadProps() {
    let props = {};
    if (
      this._key != '' &&
      (this._playbookHandler.playbook['extension_definitions'] as any)[
        this._key
      ]
    ) {
      //Try parsing the schema field inside the extension_definition as a JSON, if it doesn't work, try as a url, otherwise, default to TextArea
      let schemaField = (
        this._playbookHandler.playbook['extension_definitions'] as any
      )[this._key]['schema'];
      var schema: any;
      if (schemaField) {
        try {
          schema = JSON.parse(
            (this._playbookHandler.playbook['extension_definitions'] as any)[
              this._key
            ]['schema'],
          );
        } catch (error) {
          try {
            fetch(schemaField)
              .then(function (response) {
                try {
                  return response.text().then(function (
                    this: ExtensionInput,
                    text,
                  ) {
                    return JSON.parse(text);
                  });
                } catch (error) {
                  return '';
                }
              })
              .then(data => {
                if (data == '') {
                  return;
                }
                props = extractSchemaTypes(
                  data as any,
                  schemaDictWithoutCommands,
                );

                this._propertyPanel._elements = [];
                this._propertyPanel._container.innerHTML = '';
                this._propertyPanel.setSchemaData(props);

                this._propertyPanel.addButton('Close', () => {
                  this._propertyPanel.confirm();
                });
                this._propertyPanel.addAllProperties();
                this._usesSchema = true;
              })
              .catch(error => {
                return;
              });
          } catch (error) {
            props = {
              commonProperties: { extension: 'any' },
              required: [],
              properties: {},
            };
          }
        }
      }

      try {
        let schemaData = extractSchemaTypes(schema, schemaDictWithoutCommands);
        props = schemaData;
        this._usesSchema = true;
      } catch (error) {
        props = {
          commonProperties: { extension: 'any' },
          required: [],
          properties: {},
        };
      }
    } else {
      props = {
        commonProperties: { extension: 'any' },
        required: [],
        properties: {},
      };
    }
    this._props = props;
  }

  addToContainer(): void {
    this._dialog = document.createElement('dialog');
    this._dialog.className = 'list-dialog';

    this._container.appendChild(this._dialog);

    let tempValues = this._value;
    this._propertyPanel = new PropertyPanel(
      this._playbookHandler,
      this._propertyType,
      this._value,
      this._dialog,
    );
    // AgentTargets can be extended.
    this._propertyPanel.setIsAgentTarget(true);

    this.loadProps();

    let confirm = () => {
      tempValues = JSON.stringify(Object.values(this.submit())[0], null, 2);
      this._propertyPanel.close();
      this._updateFunction();
      this._initialValue = this.submit();
    };

    let cancel = () => {
      this._propertyPanel = new PropertyPanel(
        this._playbookHandler,
        this._propertyType,
        tempValues,
        this._dialog,
      );
      // AgentTargets can be extended.
      this._propertyPanel.setIsAgentTarget(true);
      this._propertyPanel._container.innerHTML = '';
      this._propertyPanel.setSchemaData(this._props);
      this._propertyPanel.setIsSubPanel(true);
      this._propertyPanel.addButton('Cancel', cancel);
      this._propertyPanel.addButton('Confirm', confirm);
      this._propertyPanel.addAllProperties();
      this._propertyPanel.close();
      this._updateFunction();
    };

    this._propertyPanel.setSchemaData(this._props);
    this._propertyPanel.setIsSubPanel(true);
    this._propertyPanel.setIsExtension(true);

    this._propertyPanel.addButton('Cancel', cancel);
    this._propertyPanel.addButton('Confirm', confirm);

    this._propertyPanel.addAllProperties();

    this._opendropdown = new DropDownInput(
      this._inputName,
      this._key,
      this._options,
    );
    this._opendropdown.setContainer(this._container);
    let editButton = new PanelButton('Edit', this._container, () => {
      this._key = this._opendropdown.submit();
      this.loadProps();
      this.showPanel();
    });
    editButton.addClass('edit-item');

    this._opendropdown.addToContainer();
    editButton.addToContainer();
  }

  showPanel() {
    this._dialog.showModal();
  }

  submit(): any {
    if (this._usesSchema) {
      return [
        [this._opendropdown.submit() as string],
        this._propertyPanel?.confirm(),
      ];
    }
    let temp = this._propertyPanel?.confirm()['extension'];
    let parsed = temp;
    try {
      parsed = JSON.parse(temp);
    } catch (error) {}
    return { [this._opendropdown.submit() as string]: parsed };
  }
}
