export default class cacaoDialog {
  private static _container: HTMLElement =
    document.getElementsByTagName('body')[0];

  static $inject: string[];

  /**
   * this method will pop up an alert dialog with just a "ok" button
   * @param title
   * @param description
   * @returns
   */
  static showAlert(title: string, description: string = ''): Promise<boolean> {
    let dialog = document.createElement('dialog') as HTMLDialogElement;
    dialog.className = 'cacaoDialog';
    this._container.appendChild(dialog);

    dialog.addEventListener('keydown', function (event) {
      if (event.code.toLowerCase() === 'escape') {
        event.preventDefault();  // Prevents the window from closing with the Escape key
      }
    });

    let titleDialog = document.createElement('div') as HTMLDivElement;
    titleDialog.innerHTML = title;
    titleDialog.className = 'cacaoDialog__title ';
    dialog.appendChild(titleDialog);

    let descriptionDialog = document.createElement('div') as HTMLDivElement;
    descriptionDialog.innerHTML = description;
    descriptionDialog.className = 'cacaoDialog__description';
    dialog.appendChild(descriptionDialog);

    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'cacaoDialog__buttonList';

    let buttonPrimary = document.createElement('button');
    buttonPrimary.innerText = 'Ok';
    buttonPrimary.className = 'buttonList__button button--primary';

    buttonContainer.appendChild(buttonPrimary);

    dialog.appendChild(buttonContainer);
    dialog.showModal();

    return new Promise<boolean>(resolve => {
      buttonPrimary.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
        resolve(true);
      });
    });
  }

  /**
   * this method will pop up a confirm dialog with two button to confirm or not
   * @param title
   * @param description
   * @returns Boolean True if the "confirm" button was hit, false otherwise
   */
  static showConfirm(
    title: string,
    description: string = '',
  ): Promise<boolean> {
    let dialog = document.createElement('dialog') as HTMLDialogElement;
    dialog.className = 'cacaoDialog';
    this._container.appendChild(dialog);

    dialog.addEventListener('keydown', function (event) {
      if (event.code.toLowerCase() === 'escape') {
        event.preventDefault(); /// Prevents the window from closing with the Escape key
      }
    });

    let titleDialog = document.createElement('div') as HTMLDivElement;
    titleDialog.innerHTML = title;
    titleDialog.className = 'cacaoDialog__title ';
    dialog.appendChild(titleDialog);

    let descriptionDialog = document.createElement('div') as HTMLDivElement;
    descriptionDialog.innerHTML = description;
    descriptionDialog.className = 'cacaoDialog__description';
    dialog.appendChild(descriptionDialog);

    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'cacaoDialog__buttonList';

    let buttonPrimary = document.createElement('button');
    buttonPrimary.innerText = 'Confirm';
    buttonPrimary.className = 'buttonList__button button--primary';

    let buttonSecondary = document.createElement('button');
    buttonSecondary.innerText = 'Cancel';
    buttonSecondary.className = 'buttonList__button button--secondary';

    buttonContainer.appendChild(buttonSecondary);
    buttonContainer.appendChild(buttonPrimary);

    dialog.appendChild(buttonContainer);
    dialog.showModal();

    return new Promise<boolean>(resolve => {
      buttonPrimary.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
        resolve(true);
      });

      buttonSecondary.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
        resolve(false);
      });
    });
  }

  /**
   * this method will pop up a dialog with a custom content, this dialog have just one button to leave: "Close"
   * @param container
   * @returns
   */
  static showDialog(title: string, container: HTMLElement) {
    let dialog = document.createElement('dialog') as HTMLDialogElement;
    dialog.className = 'cacaoDialog';
    this._container.appendChild(dialog);

    let titleDialog = document.createElement('div') as HTMLDivElement;
    titleDialog.innerHTML = title;
    titleDialog.className = 'cacaoDialog__title ';
    dialog.appendChild(titleDialog);

    dialog.addEventListener('keydown', function (event) {
      if (event.code.toLowerCase() === 'escape') {
        event.preventDefault(); // Prevents the window from closing with the Escape key
      }
    });

    container.classList.add('cacaoDialog--scrollable');
    dialog.appendChild(container);

    let confirmButton = `
        <div class="cacaoDialog__buttonList">
            <button class="buttonList__button button--primary">Close</button>
        </div>
        `;

    dialog.innerHTML += confirmButton;
    this._container.classList.add('blurred');
    dialog.showModal();

    return new Promise<boolean>(resolve => {
      const btnYes = document.getElementsByClassName(
        'buttonList__button button--primary',
      )[0] as HTMLButtonElement;

      btnYes.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
        this._container.classList.remove('blurred');
        resolve(true);
      });
    });
  }
}
