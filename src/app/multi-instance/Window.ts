import { Playbook } from '../../../lib/cacao2-js/src/Playbook';
import MultiInstanceApplication from './MultiInstanceApplication';
import CacaoEditor from '../../diagram/CacaoEditor';
import { newPlaybook } from '../Application';
import UserSettingsProps from '../UserSettingsProps';
import cacaoDialog from '../../diagram/modules/core/CacaoDialog';

export default class CacaoWindow {
  private _headerEntry: HTMLElement;
  private _headerEntryTextElement!: HTMLElement;
  private _headerEntryTlpIndicator!: HTMLElement;
  private _app: MultiInstanceApplication;
  private _editor!: CacaoEditor;
  private _container: HTMLElement;
  static $inject: string[];

  constructor(app: MultiInstanceApplication) {
    this._container = document.createElement('div');
    this._container.id = 'cacaoWindow';
    this._app = app;
    this._headerEntry = this.createHeaderEntry();
    this.initPage();
  }

  get headerTabEntry() {
    return this._headerEntry;
  }

  get container() {
    return this._container;
  }

  show() {
    this._headerEntry.classList.add('tab-open');
    this._app.currentWindow = this._container;
  }

  hide() {
    this._headerEntry.classList.remove('tab-open');
  }

  private initPage() {
    let logo = document.createElement('div');
    logo.className = 'window__logo';

    let primaryButtonContainer = document.createElement('div');
    primaryButtonContainer.className = 'window__buttoncontainer';

    // Button for creating a new CACAO playbook.
    let newButton = document.createElement('div');
    newButton.className = 'window__button button--new button--big';
    newButton.innerHTML = `
        <div class="button__icon"></div>
        <p class="button__label">Create</p>
        `;
    newButton.onclick = (e: Event) => {
      this.loadEditor();
    };

    // Button for uploading a CACAO JSON file from local machine.
    let openButton = document.createElement('div');
    openButton.className = 'window__button button--open button--big';
    openButton.innerHTML = `
        <div class="button__icon"></div>
        <p class="button__label">Import File</p>
        `;
    openButton.onclick = (e: Event) => {
      try {
        this.openFileExplorer();
      } catch (e: any) {
        cacaoDialog.showAlert('Error when trying to import a file', e.message);
      }
    };

    // Button for importing CACAO playbook in text format.
    let textImport = document.createElement('div');
    textImport.className = 'window__button button--paste button--big';
    textImport.innerHTML = `
        <div class="button__icon"></div>
        <p class="button__label">Import Text</p>
        `;
    textImport.onclick = (e: Event) => this.openDialogForTextImport();

    let settingsButton = document.createElement('div');
    settingsButton.className = 'window__button button--settings button--small button--wholerow';
    settingsButton.innerHTML = `
        <div class="button__icon"></div>
        <p class="button__label">user settings</p>
        `;
    settingsButton.onclick = (e: Event) => {
      UserSettingsProps.instance.showDialog();
    };

    this._container.appendChild(logo);
    primaryButtonContainer.appendChild(newButton);
    primaryButtonContainer.appendChild(openButton);
    primaryButtonContainer.appendChild(textImport);
    this._container.appendChild(primaryButtonContainer);
    this._container.appendChild(settingsButton);
    this._container.className = 'picker-window';
  }

  private openDialogForTextImport(): void {
    let dialog = document.createElement('dialog') as HTMLDialogElement;
    dialog.className = 'dialog';
    dialog.addEventListener('keydown', function (event) {
      if (event.code.toLowerCase() === 'escape') {
        // remove the 'blurred' class from the body
        document.body.classList.remove('blurred');
      }
    });
    document.body.appendChild(dialog);

    // Create the title of the dialog
    let titleDialog = document.createElement('div') as HTMLDivElement;
    titleDialog.innerHTML = 'Import CACAO Playbook';
    titleDialog.className = 'dialog__title';
    dialog.appendChild(titleDialog);

    // Adding blur effect for the rest of the app, besides the dialog
    document.body.classList.add('blurred');

    // Creates the text area for the user to input the CACAO playbook
    let textArea = document.createElement('textarea') as HTMLTextAreaElement;
    textArea.classList.add('property__input', 'cacaoImportTextarea');
    textArea.placeholder = 'Paste the CACAO JSON here.';

    // Creates radio-buttons input with 3 options: 'Import text', 'import base64 encoded', 'import STIX 2.1 COA Playbook json'
    let radioButtonContainer = document.createElement('div') as HTMLDivElement;
    radioButtonContainer.className = 'dialog__radioButtonContainer';

    // Radio button for importing text
    let placeholderImportText = 'Paste the CACAO JSON here.';
    this.createImportRadioButton(
      radioButtonContainer,
      'CACAO JSON',
      placeholderImportText,
      textArea,
    );
    dialog.appendChild(radioButtonContainer);

    // Radio button for importing base64 encoded playbook
    let placeholderImportEncodedPlaybook = 'Paste the base64 encoded CACAO Playbook here.';
    this.createImportRadioButton(
      radioButtonContainer,
      'base64 encoded CACAO Playbook',
      placeholderImportEncodedPlaybook,
      textArea,
    );
    dialog.appendChild(radioButtonContainer);

    // Adds the text area to the dialog
    let textAreaContainer = document.createElement('div') as HTMLDivElement;
    textAreaContainer.className = 'dialog__property';
    textAreaContainer.appendChild(textArea);
    dialog.appendChild(textAreaContainer);

    // Creates the button for importing the playbook
    let importButton = document.createElement('button') as HTMLButtonElement;
    importButton.classList.add('dialog__buttonList', 'button--primary');
    importButton.innerHTML = 'Import';
    importButton.onclick = () => this.importPlaybookFromTextButtonHandler(textArea, dialog);

    // Creates the cancel button for the dialog
    let cancelButton = document.createElement('button');
    cancelButton.classList.add('dialog__buttonList', 'button--secondary');
    cancelButton.innerText = 'Cancel';
    cancelButton.onclick = () => {
      dialog.close();
      dialog.remove();
      document.body.classList.remove('blurred');
    };

    // Adds the import button to the dialog
    let buttonContainer = document.createElement('div') as HTMLDivElement;
    buttonContainer.className = 'dialog__buttonList';
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(importButton);
    dialog.appendChild(buttonContainer);

    // Show the dialog
    dialog.showModal();
  }

  // Handler for the import button in the dialog for importing a CACAO playbook from text
  private importPlaybookFromTextButtonHandler(
    textArea: HTMLTextAreaElement,
    dialog: HTMLDialogElement,
  ): void {
    try {
      let playbook = textArea.value;
      if (playbook === '') {
        throw new Error('The text area is empty.');
      }

      // Check the value of the radio button
      let importOption = document.querySelector(
        'input[name="importOption"]:checked',
      ) as HTMLInputElement;
      if (importOption === null) {
        throw new Error('Please select an import option.');
      }

      let importOptionValue = importOption.value;
      if (importOptionValue.includes('base64')) {
        // Checks if the playbook is base64 encoded
        const base64Matcher = new RegExp(
          '^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$',
        );
        if (!base64Matcher.test(playbook)) throw new Error('The playbook is not base64 encoded.');
        // Decodes the base64 encoded playbook to plaintext
        playbook = Buffer.from(playbook, 'base64').toString('utf-8');
      }

      // Parses the plaintext to JSON format
      let playbookJson = JSON.parse(playbook);
      // Checks if the JSON is a CACAO playbook and loads the editor
      if (isCacaoPlaybook(playbookJson)) {
        this.loadEditor(new Playbook(playbookJson));
        document.body.classList.remove('blurred');
        dialog.close();
      } else {
        throw new Error('The JSON imported is not a CACAO playbook');
      }
    } catch (e: any) {
      cacaoDialog.showAlert('Error when trying to import the playbook', e.message);
    }
  }

  // Creates a radio button for importing a CACAO playbook in different formats
  private createImportRadioButton(
    radioButtonWrapper: HTMLDivElement,
    textContent: string,
    placeholderText: string,
    textArea: HTMLTextAreaElement,
  ) {
    // Div for wrapping the label and the radio button
    let radioButtonAndLabel = document.createElement('div') as HTMLDivElement;
    radioButtonAndLabel.classList.add('dialog__property', 'radioButtonLabelContainer');

    // Creates the radio button
    let importTextRadio = document.createElement('input') as HTMLInputElement;
    importTextRadio.id = textContent.trim();
    importTextRadio.type = 'radio';
    importTextRadio.name = 'importOption';
    importTextRadio.value = textContent.trim();
    importTextRadio.textContent = textContent;
    importTextRadio.classList.add('radioButton');
    if (textContent === 'CACAO JSON') {
      importTextRadio.checked = true;
      // remove focus from the radio button
      importTextRadio.blur();
    }
    radioButtonAndLabel.appendChild(importTextRadio);

    // Creates the label for the radio button
    let importTextRadioLabel = document.createElement('label') as HTMLLabelElement;
    importTextRadioLabel.textContent = textContent;
    importTextRadioLabel.htmlFor = importTextRadio.id;
    radioButtonAndLabel.appendChild(importTextRadioLabel);

    // Adds the wrapping div to the radioButtonWrapper
    radioButtonWrapper.appendChild(radioButtonAndLabel);

    // Adds the event listener for the radio button to change the placeholder of the text area
    importTextRadio.addEventListener('change', function () {
      textArea.placeholder = placeholderText;
    });
  }

  private openFileExplorer(): void {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = false;
    fileInput.accept = 'application/json';
    fileInput.addEventListener(
      'change',
      (event: Event) => {
        const input = event.target as HTMLInputElement;

        if (!input.files) {
          throw new Error('input.files undefined');
        }

        const file = input.files[0]; // Gets the first file selected

        if (!file) {
          throw new Error('file undefined');
        }

        if (fileIsJSON(file)) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            try {
              const fileContent = e.target.result as string;
              let jsonFile = JSON.parse(fileContent);
              if (isCacaoPlaybook(jsonFile)) {
                this.loadEditor(new Playbook(jsonFile));
              } else if (
                jsonFile['playbook'] != undefined &&
                isCacaoPlaybook(jsonFile['playbook'])
              ) {
                this.loadEditor(new Playbook(jsonFile['playbook']), jsonFile['execution_status']);
              } else {
                throw new Error('The JSON imported is not a CACAO playbook');
              }
            } catch (e: any) {
              cacaoDialog.showAlert('Error when trying to import a file', e.message);
            }
          };
          reader.readAsText(file);
        }
      },
      false,
    );
    fileInput.click();
  }

  private loadEditor(playbook: Playbook | undefined = undefined, status?: any) {
    if (!playbook) {
      playbook = newPlaybook();
    }
    this._container.className = '';
    this._container.textContent = '';
    this._editor = new CacaoEditor(this._container, playbook, status);
    this._editor.addListener(() => {
      this.updateWindowTab(this._editor.playbook.name ?? '');
    });
    this.updateWindowTab(this._editor.playbook.name ?? '');
  }

  private updateWindowTab(name: string) {
    this._headerEntryTextElement.innerText = name;
    this._headerEntryTlpIndicator.className = '';

    let className = this._editor.playbookHandler
      .getTLPMarking()
      .replace(/[:+]/g, '-')
      .toLowerCase();
    if (className !== '') {
      this._headerEntryTlpIndicator.classList.add('tlp-icon');
      this._headerEntryTlpIndicator.classList.add(className);
    }
  }

  private createHeaderEntry(): HTMLElement {
    let entry = document.createElement('div');
    entry.className = 'header-tab-entry';
    entry.onclick = () => {
      this._app.openWindow(this);
    };

    this._headerEntryTlpIndicator = document.createElement('div');

    let removeButton = document.createElement('div');
    removeButton.className = 'header-tab-entry-remove-button';
    removeButton.onclick = async (event: Event) => {
      if (!this._editor || (await this._editor.canLeave())) {
        event.stopPropagation();
        entry.remove();
        this._app.closeWindow(this);
      }
    };

    this._headerEntryTextElement = document.createElement('div');
    this._headerEntryTextElement.className = 'header-tab-entry-title';
    this._headerEntryTextElement.innerText = 'New playbook';

    entry.appendChild(this._headerEntryTlpIndicator);
    entry.appendChild(this._headerEntryTextElement);
    entry.appendChild(removeButton);

    return entry;
  }
}

function fileIsJSON(file: File): boolean {
  return file.type == 'application/json';
}

function isCacaoPlaybook(jsonFile: any): boolean {
  if (jsonFile.spec_version) {
    let spec_version: string = jsonFile.spec_version;
    return spec_version.toLowerCase().includes('cacao');
  }
  return false;
}
