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

    let newButton = document.createElement('div');
    newButton.className = 'window__button button--new button--big';
    newButton.innerHTML = `
        <div class="button__icon"></div>
        <p class="button__label">Create</p>
        `;
    newButton.onclick = (e: Event) => {
      this.loadEditor();
    };

    let openButton = document.createElement('div');
    openButton.className = 'window__button button--open button--big';
    openButton.innerHTML = `
        <div class="button__icon"></div>
        <p class="button__label">Import</p>
        `;
    openButton.onclick = (e: Event) => {
      try {
        this.openFileExplorer();
      } catch (e: any) {
        cacaoDialog.showAlert('Error when trying to import a file', e.message);
      }
    };

    let settingsButton = document.createElement('div');
    settingsButton.className =
      'window__button button--settings button--small button--wholerow';
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
    this._container.appendChild(primaryButtonContainer);
    this._container.appendChild(settingsButton);
    this._container.className = 'picker-window';
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
                this.loadEditor(
                  new Playbook(jsonFile['playbook']),
                  jsonFile['execution_status'],
                );
              } else {
                throw new Error('The JSON imported is not a CACAO playbook');
              }
            } catch (e: any) {
              cacaoDialog.showAlert(
                'Error when trying to import a file',
                e.message,
              );
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
