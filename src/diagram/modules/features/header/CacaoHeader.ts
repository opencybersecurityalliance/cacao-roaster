import PlaybookHandler from '../../model/PlaybookHandler';
import EventBus from 'diagram-js/lib/core/EventBus';
import CacaoExporter from '../exporter/CacaoExporter';
import CacaoSidePanel from '../side-panel/CacaoSidePanel';
import CacaoSigning from '../signing/CacaoSigning';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import CacaoUtils from '../../core/CacaoUtils';
import CacaoModeling from '../modeling/CacaoModeling';

type HeaderOptionEntry = {
  action: (event: any) => void;
  className: string;
  title: string;
};

export default class CacaoHeader {
  private _playbookHandler: PlaybookHandler;
  private _cacaoExporter: CacaoExporter;
  private _cacaoSidePanel: CacaoSidePanel;
  private _cacaoSigning: CacaoSigning;
  private _elementRegistry: ElementRegistry;
  private _cacaoModeling: CacaoModeling;

  private _headerContainer!: HTMLElement;
  private _headerName!: HTMLElement;
  private _headerDescription!: HTMLElement;
  private _headerOptions!: HTMLElement;
  private _headerTags!: HTMLElement;
  private _headerLabels!: HTMLElement;
  private _LabelsList!: HTMLElement[];
  private _LabelsMoreIndicator!: HTMLElement;

  private _headerPreviousSize = 0;

  static $inject: string[];

  constructor(
    playbookHandler: PlaybookHandler,
    tabContainer: HTMLElement,
    eventBus: EventBus,
    cacaoExporter: CacaoExporter,
    cacaoSidePanel: CacaoSidePanel,
    cacaoSigning: CacaoSigning,
    elementRegistry: ElementRegistry,
    cacaoModeling: CacaoModeling,
  ) {
    this._cacaoExporter = cacaoExporter;
    this._playbookHandler = playbookHandler;
    this._cacaoSidePanel = cacaoSidePanel;
    this._cacaoSigning = cacaoSigning;
    this._elementRegistry = elementRegistry;
    this._cacaoModeling = cacaoModeling;

    this.initHeader(tabContainer);

    eventBus.on(
      ['elements.changed', 'diagram.init', 'playbook.changed', 'editor.loaded'],
      () => {
        this.updateName();
        this.updateTags();
        this.updateLabels();
        this.loadHeaderOptionEntries();
      },
    );
    this.updateName();
    this.updateTags();
    this.updateLabels();
  }

  /**
   * this method can be trigger to update the displayed title
   */
  private updateName() {
    let playbookName = this._playbookHandler.getPlaybookProperties('name');
    let playbookDescription =
      this._playbookHandler.getPlaybookProperties('description');

    if (!this._headerName || !this._headerDescription) {
      throw new Error(
        'div with these id MUST be defined : header-name, header-description',
      );
    }
    if (playbookName === '') {
      playbookName = '';
    }

    if (playbookDescription === '') {
      playbookDescription = '';
    }
    this._headerName.innerHTML = playbookName;
    this._headerDescription.innerHTML = playbookDescription;
    this._headerDescription.title = playbookDescription;
  }

  /**
   * this method can be trigger to update the tags
   */
  private updateTags() {
    let revoked = this._playbookHandler.playbook.revoked ?? false;
    let cacao2_0 = this._playbookHandler.playbook.spec_version;
    let tlp: string = this._playbookHandler.getTLPMarking();

    this._headerTags.innerHTML = '';

    if (cacao2_0) {
      let cacaoTag = document.createElement('div');
      cacaoTag.className = 'tag cacao-spec-version';
      cacaoTag.innerText = cacao2_0;
      this._headerTags.appendChild(cacaoTag);
    }

    if (revoked) {
      let revokedTag = document.createElement('div');
      revokedTag.className = 'tag revoked-tag';
      revokedTag.innerText = 'revoked';
      this._headerTags.appendChild(revokedTag);
    }

    if (tlp !== '') {
      let tlpTag = document.createElement('div');
      tlpTag.className =
        tlp.replace(/[:+]/g, '-').toLowerCase() + '-tag tlp-tag tag';
      tlpTag.innerText = tlp;
      this._headerTags.appendChild(tlpTag);
    }
  }
  /**
   *
   *  - class::header
   *      - class::header__title
   *          - class::title__name
   *          - class::title__tags
   *          - class::title__description
   *      - class::header__options-container
   *          - class:header-option
   * @param container the HTMLElement that represents the header container
   */
  private initHeader(container: HTMLElement) {
    this._headerContainer = document.createElement('div');
    this._headerContainer.className = 'header';

    let headerLogoContainer = document.createElement('div');
    headerLogoContainer.className = 'header__logo';

    let headerTitleContainer = document.createElement('div');
    headerTitleContainer.className = 'header__title';

    this._headerName = document.createElement('div');
    this._headerName.className = 'title__name';

    this._headerTags = document.createElement('div');
    this._headerTags.className = 'title__tags';

    let linefeed = document.createElement('div');
    linefeed.className = 'expanded';

    this._headerLabels = document.createElement('div');
    this._headerLabels.className = 'title__labels expanded';
    this._LabelsMoreIndicator = document.createElement('div');
    this._LabelsMoreIndicator.className = 'labels__entry labels__moreindicator';

    this._headerDescription = document.createElement('div');
    this._headerDescription.className = 'title__description expanded';

    this._headerOptions = document.createElement('div');
    this._headerOptions.className = 'header__options';

    container.insertBefore(this._headerContainer, container.firstChild);
    this._headerContainer.appendChild(headerLogoContainer);
    this._headerContainer.appendChild(headerTitleContainer);
    headerTitleContainer.appendChild(this._headerName);
    headerTitleContainer.appendChild(this._headerTags);
    headerTitleContainer.appendChild(linefeed);
    headerTitleContainer.appendChild(this._headerDescription);
    headerTitleContainer.appendChild(this._headerLabels);
    this._headerContainer.appendChild(this._headerOptions);
    this.loadHeaderOptionEntries();
  }

  /**
   * this method update the list of label display as a list in the header
   * @returns
   */
  updateLabels() {
    this._headerLabels.innerHTML = '';
    this._LabelsList = [];

    let createEntry = (name: string): HTMLElement => {
      let label = document.createElement('div');
      label.innerText = name;
      label.className = 'labels__entry';
      return label;
    };

    let labelList = this._playbookHandler?.playbook?.labels;

    if (!labelList) {
      return;
    }

    for (let label of labelList) {
      let entry = createEntry(label);
      this._LabelsList.push(entry);
      this._headerLabels.appendChild(entry);
    }

    let update = () => {
      let hideNext: undefined | HTMLElement = undefined;
      let countHide = 0;
      for (let label of this._LabelsList) {
        if (
          label.offsetLeft + label.offsetWidth >
          this._headerLabels.offsetWidth - 70
        ) {
          label.style.visibility = 'hidden';
          if (!hideNext) {
            hideNext = label;
          }
          countHide++;
        } else {
          label.style.visibility = 'visible';
        }
        this._LabelsMoreIndicator.innerHTML = countHide + ' more';
        if (hideNext) {
          this._LabelsMoreIndicator.classList.remove('moreindicator--hide');
          this._LabelsMoreIndicator.classList.add('moreindicator--show');
          this._LabelsMoreIndicator.remove();
          this._headerLabels.insertBefore(this._LabelsMoreIndicator, hideNext);
        } else {
          this._LabelsMoreIndicator.classList.remove('moreindicator--show');
          this._LabelsMoreIndicator.classList.add('moreindicator--hide');
          this._LabelsMoreIndicator.remove();
        }
      }
    };

    window.onresize = update;
    update();
  }

  /**
   * this method load all the action entries of the header
   */
  private loadHeaderOptionEntries() {
    let entries: HeaderOptionEntry[] = [
      {
        title: 'EXPANDED MODE',
        className: this._cacaoModeling.isExpandedMode()
          ? 'expander expanded'
          : 'expander',
        action: (event: any) => {
          for (let element of this._elementRegistry.getAll()) {
            if (CacaoUtils.isConstructType(element?.type)) {
              this._cacaoModeling.toggleCollapse(element as any);
            }
          }
          if (this._cacaoModeling.isExpandedMode()) {
            this._headerOptions
              .getElementsByClassName('expander')[0]
              ?.classList.add('expanded');
          } else {
            this._headerOptions
              .getElementsByClassName('expander')[0]
              ?.classList.remove('expanded');
          }
        },
      },
      {
        title: 'VERIFY',
        className: 'verify',
        action: (event: any) => {
          this._cacaoSigning.showSignatureCheckDialog();
        },
      },
      {
        title:
          this._cacaoSigning.canUserSignOrCounterSignPlaybook() == 'sign'
            ? 'SIGN'
            : 'COUNTER- SIGN',
        className:
          this._cacaoSigning.canUserSignOrCounterSignPlaybook() == 'sign'
            ? 'sign'
            : 'sign countersign',
        action: async (event: any) => {
          this._cacaoSigning.signOrCountersignPlaybook();
        },
      },
      {
        title: 'JSON',
        className: 'export',
        action: async (event: any) => {
          this._cacaoExporter.openExportPreferencesDialog();
        },
      },
      {
        title: 'SVG',
        className: 'export',
        action: (event: any) => {
          this._cacaoExporter.exportToSVG();
        },
      },
      {
        title: 'METADATA',
        className: 'metadata',
        action: (event: any) => {
          this._cacaoSidePanel.openMetadataPanel();
        },
      },
    ];
    this._headerOptions.innerHTML = '';
    for (let entry of entries) {
      this.createEntry(entry, this._headerOptions);
    }
  }

  /**
   * create the html corresponding to an entry of the header
   * @param entry
   * @param container
   */
  private createEntry(entry: HeaderOptionEntry, container: HTMLElement) {
    let button = document.createElement('div') as HTMLDivElement;
    button.className = entry.className;
    button.classList.add('options__entry');
    button.innerHTML = `
        <div class="entry__icon"></div>
        <p class="entry__label">${entry.title}</p>
        `;
    button.onclick = (event: any) => {
      this._cacaoSidePanel.confirmAndClosePanel();
      entry.action(event);
    };
    container.appendChild(button);
  }
}

CacaoHeader.$inject = [
  'playbookHandler',
  'config.container',
  'eventBus',
  'cacaoExporter',
  'cacaoSidePanel',
  'cacaoSigning',
  'elementRegistry',
  'modeling',
];
