import PlaybookHandler from '../../model/PlaybookHandler';
import PropertyPanel from './PropertyPanel';
import { ComplexInput } from './ComplexInput';
import { PropertyLabel } from './PropertyLabel';

/**
 * SingleObjectInput are inputs that contain a single PropertyPanel.
 */
export class SingleObjectInput extends ComplexInput {
  _propertyPanel?: PropertyPanel;
  _playbookHandler: PlaybookHandler;
  _defaultValues: object = {};
  _list!: HTMLElement;
  _headerExpander!: HTMLElement;
  _bodyListContainer: HTMLDivElement = document.createElement('div');

  constructor(
    propertyName: string,
    propertyType: string,
    playbookHandler: PlaybookHandler,
    container: HTMLElement,
  ) {
    super(propertyName, propertyType, container);
    this._playbookHandler = playbookHandler;
    this._bodyListContainer.classList.add(
      'section__property',
      'property--complexe',
    );
  }

  setDefaultValues(defaultValues: any): void {
    if (defaultValues) {
      this._defaultValues = defaultValues;
    }
  }

  /**
   * Expands the graphic property's list
   */
  expand() {
    this._list.classList.add('list--expanded');
    this._list.classList.remove('list--collapse');
    this._headerExpander.classList.add('expander--close');
    this._headerExpander.classList.remove('expander--open');
    this._bodyListContainer.classList.add('lisContainer--expanded');
  }

  /**
   * Collapses the graphic property's list
   */
  collapse() {
    this._list.classList.add('list--collapse');
    this._list.classList.remove('list--expanded');
    this._headerExpander.classList.remove('expander--close');
    this._headerExpander.classList.add('expander--open');
    this._bodyListContainer.classList.remove('lisContainer--expanded');
  }

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

  addToContainer(): void {
    this._list = document.createElement('div');
    this.createExpanderButton();
    this._list.classList.add('property__list');

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

    this._propertyPanel = new PropertyPanel(
      this._playbookHandler,
      this._propertyType,
      this._defaultValues,
      this._list,
    );
    this._propertyPanel.setIsAgentTarget(true);
    this._propertyPanel.addClass('sidepanel--sub');
    this._propertyPanel.showHeader(false);
    this._propertyPanel.showSwitcherJSON(false);
    this._propertyPanel.showActionButtons(false);
    this._propertyPanel.setIsSubPanel(true);

    this._propertyPanel.addAllProperties();

    let labelTag: HTMLElement | null;
    labelTag = labelHeader.firstChild
      ? (labelHeader.firstChild as HTMLElement)
      : null;
    while (labelTag && labelTag.tagName != 'LABEL') {
      labelTag = labelHeader.firstChild
        ? (labelTag.nextSibling as HTMLElement)
        : null;
    }

    this._bodyListContainer.appendChild(labelHeader);
    this._bodyListContainer.appendChild(this._list);
    this._container.appendChild(this._bodyListContainer);
  }

  submit(): object {
    return this._propertyPanel?.confirm();
  }
}
