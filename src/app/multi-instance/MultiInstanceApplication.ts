import Application from '../Application';
import CacaoWindow from './Window';

export default class MultiInstanceApplication extends Application {
  private _headerTabContainer!: HTMLElement;
  private _body!: HTMLElement;

  private _windows: CacaoWindow[] = [];

  constructor(container: HTMLElement) {
    super(container);
    this.init(this._container);
    this.openWindow(this.newWindow());
  }

  set currentWindow(container: HTMLElement) {
    this._body.firstChild?.remove();
    this._body.appendChild(container);
  }

  closeWindow(window: CacaoWindow) {
    let index = this._windows.indexOf(window);
    if (index == -1) return;
    this._windows.splice(index, 1);

    if (index >= this._windows.length) {
      index = this._windows.length - 1;
    }

    if (index == -1) {
      this.newWindow();
      index = 0;
    }
    this.openWindow(this._windows[index]);
  }

  addHeaderTab(tab: HTMLElement) {
    this._headerTabContainer.appendChild(tab);
  }

  private init(container: HTMLElement) {
    this.initHeader(container);
    this._body = document.createElement('div');
    this._body.id = 'app-body';
    container.appendChild(this._body);
  }

  private initHeader(container: HTMLElement) {
    let header = document.createElement('div');
    header.id = 'app-tab-container';

    this._headerTabContainer = document.createElement('div');
    this._headerTabContainer.id = 'header-tab-container';

    let add = document.createElement('div');
    add.id = 'header-new-tab-button';
    add.onclick = () => {
      this.openWindow(this.newWindow());
    };

    container.appendChild(header);
    header.appendChild(this._headerTabContainer);
    header.appendChild(add);
  }

  private newWindow(): CacaoWindow {
    let window = new CacaoWindow(this);
    this._windows.push(window);
    this.addHeaderTab(window.headerTabEntry);
    return window;
  }

  openWindow(window: CacaoWindow) {
    this._windows.forEach(window => {
      window.hide();
    });
    window.show();
  }
}
