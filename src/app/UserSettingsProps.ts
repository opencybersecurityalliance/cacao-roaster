import { Identifier } from 'lib/cacao2-js/src/data-types/Identifier';
import { v4 as uuidv4 } from 'uuid';

export default class UserSettingsProps {
  static instance: UserSettingsProps = new UserSettingsProps();

  identifier: Identifier = 'identity--' + uuidv4();
  private identifierPattern =
    '^[a-z][a-z0-9-]+[a-z0-9]--[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$';
  secretKey: string = '';
  publicKey: string = '';

  get isFulfil(): boolean {
    return this.identifier != '' && this.secretKey != '' && this.publicKey != '';
  }

  showDialog() {
    let dialog = document.createElement('dialog') as HTMLDialogElement;
    dialog.className = 'usersettings__dialog';
    dialog.addEventListener('keydown', function (event) {
      if (event.code.toLowerCase() === 'escape') {
        event.preventDefault(); // Prevents the window from closing when pressing Escape
      }
    });
    document.body.appendChild(dialog);

    dialog.appendChild(getTitleHTMLElement());

    let identifierContainer = getPropertyHTMLElement(
      'User identifier',
      'identifier',
      'input',
      this.identifier,
    );
    dialog.appendChild(identifierContainer);
    let secretKeyContainer = getPropertyHTMLElement(
      'Secret key (beta - for experimental purposes only)',
      'secretKey',
      'textarea',
      this.secretKey,
    );
    dialog.appendChild(secretKeyContainer);
    let publicKeyContainer = getPropertyHTMLElement(
      'Public key (beta - for experimental purposes only)',
      'publicKey',
      'textarea',
      this.publicKey,
    );
    dialog.appendChild(publicKeyContainer);

    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'dialog__buttonList';

    let confirm = getButtonHTMLElement('Confirm', true);
    let cancel = getButtonHTMLElement('Cancel', false);

    buttonContainer.appendChild(cancel);
    buttonContainer.appendChild(confirm);
    dialog.appendChild(buttonContainer);

    document.body.classList.add('blurred');
    dialog.showModal();

    return new Promise<boolean>(resolve => {
      confirm.addEventListener('click', () => {
        let identifier = identifierContainer.getElementsByClassName('property__input')[0] as
          | HTMLInputElement
          | HTMLTextAreaElement;
        let publicKey = publicKeyContainer.getElementsByClassName('property__input')[0] as
          | HTMLInputElement
          | HTMLTextAreaElement;
        let secretKey = secretKeyContainer.getElementsByClassName('property__input')[0] as
          | HTMLInputElement
          | HTMLTextAreaElement;

        let correct = true;
        if (!passRegex(identifier.value, this.identifierPattern)) {
          correct = false;
          identifier.classList.add('input--incorrect');
        } else {
          identifier.classList.remove('input--incorrect');
        }
        if (correct) {
          this.identifier = identifier.value;
          this.publicKey = publicKey.value;
          this.secretKey = secretKey.value;
          dialog.close();
          dialog.remove();
          document.body.classList.remove('blurred');
          resolve(true);
        }
      });

      cancel.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
        document.body.classList.remove('blurred');
        resolve(false);
      });
    });
  }
}

function passRegex(value: string, regex: string): boolean {
  let reg = RegExp(regex);
  return value == '' || reg.test(value);
}

function getTitleHTMLElement(): HTMLElement {
  let titleDialog = document.createElement('div') as HTMLDivElement;
  titleDialog.innerHTML = 'Settings';
  titleDialog.className = 'dialog__title';
  return titleDialog;
}

function getPropertyHTMLElement(
  label: string,
  id: string,
  type: 'textarea' | 'input',
  value: string = '',
): HTMLElement {
  let propertyContainer = document.createElement('div');
  propertyContainer.className = 'dialog__property';
  propertyContainer.id = id;

  let labelElement = document.createElement('div');
  labelElement.innerHTML = label;
  labelElement.className = 'property__label';

  let inputElement = document.createElement(type);
  inputElement.className = 'property__input';
  inputElement.value = value;

  propertyContainer.appendChild(labelElement);
  propertyContainer.appendChild(inputElement);
  return propertyContainer;
}

function getButtonHTMLElement(label: string, isPrimary = true): HTMLElement {
  let button = document.createElement('button');
  button.className = 'dialog__button';
  button.innerText = label;

  if (isPrimary) {
    button.classList.add('button--primary');
  } else {
    button.classList.add('button--secondary');
  }

  return button;
}
