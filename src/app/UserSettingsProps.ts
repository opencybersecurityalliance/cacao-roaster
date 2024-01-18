import { Identifier } from 'lib/cacao2-js/src/data-types/Identifier';
import { v4 as uuidv4 } from 'uuid';

export default class UserSettingsProps {
  static instance: UserSettingsProps = new UserSettingsProps();

  identifier: Identifier = 'identity--' + uuidv4();
  private identifierPattern =
    '^[a-z][a-z0-9-]+[a-z0-9]--[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$';
  secretKey: string =
    '-----BEGIN RSA PRIVATE KEY-----MIICWwIBAAKBgQDRhGF7X4A0ZVlEg594WmODVVUIiiPQs04aLmvfg8SborHss5gQXu0aIdUT6nb5rTh5hD2yfpF2WIW6M8z0WxRhwicgXwi80H1aLPf6lEPPLvN29EhQNjBpkFkAJUbS8uuhJEeKw0cE49g80eBBF4BCqSL6PFQbP9/rByxdxEoAIQIDAQABAoGAA9/q3Zk6ib2GFRpKDLO/O2KMnAfR+b4XJ6zMGeoZ7Lbpi3MW0Nawk9ckVaX0ZVGqxbSIX5Cvp/yjHHpww+QbUFrw/gCjLiiYjM9E8C3uAF5AKJ0r4GBPl4u8K4bpbXeSxSB60/wPQFiQAJVcA5xhZVzqNuF3EjuKdHsw+dk+dPECQQDubX/lVGFgD/xYuchz56Yc7VHX+58BUkNSewSzwJRbcueqknXRWwj97SXqpnYfKqZq78dnEF10SWsr/NMKi+7XAkEA4PVqDv/OZAbWr4syXZNv/Mpl4r5suzYMMUD9U8B2JIRnrhmGZPzLx23N9J4hEJ+Xh8tSKVc80jOkrvGlSv+BxwJAaTOtjA3YTV+gU7Hdza53sCnSw/8FYLrgc6NOJtYhX9xqdevbyn1lkU0zPr8mPYg/F84m6MXixm2iuSz8HZoyzwJARi2paYZ5/5B2lwroqnKdZBJMGKFpUDn7Mb5hiSgocxnvMkv6NjT66Xsi3iYakJII9q8CMa1qZvT/cigmdbAh7wJAQNXyoizuGEltiSaBXx4H29EdXNYWDJ9SS5f070BRbAIldqRh3rcNvpY6BKJqFapda1DjdcncZECMizT/GMrc1w==-----END RSA PRIVATE KEY-----';
  private secretKeyPattern =
    '^-----BEGIN PRIVATE KEY-----(.*)-----END PRIVATE KEY-----$';
  publicKey: string =
    '-----BEGIN CERTIFICATE-----MIIBvTCCASYCCQD55fNzc0WF7TANBgkqhkiG9w0BAQUFADAjMQswCQYDVQQGEwJKUDEUMBIGA1UEChMLMDAtVEVTVC1SU0EwHhcNMTAwNTI4MDIwODUxWhcNMjAwNTI1MDIwODUxWjAjMQswCQYDVQQGEwJKUDEUMBIGA1UEChMLMDAtVEVTVC1SU0EwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBANGEYXtfgDRlWUSDn3haY4NVVQiKI9CzThoua9+DxJuiseyzmBBe7Roh1RPqdvmtOHmEPbJ+kXZYhbozzPRbFGHCJyBfCLzQfVos9/qUQ88u83b0SFA2MGmQWQAlRtLy66EkR4rDRwTj2DzR4EEXgEKpIvo8VBs/3+sHLF3ESgAhAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAEZ6mXFFq3AzfaqWHmCy1ARjlauYAa8ZmUFnLm0emg9dkVBJ63aEqARhtok6bDQDzSJxiLpCEF6G4b/Nv/M/MLyhP+OoOTmETMegAVQMq71choVJyOFE5BtQa6M/lCHEOya5QUfoRF2HF9EjRF44K3OK+u3ivTSj3zwjtpudY5Xo=-----END CERTIFICATE-----';
  private publicKeyPattern =
    '^-----BEGIN PUBLIC KEY-----(.*)-----END PUBLIC KEY-----$';

  private UserSettingsProps() {}

  get isFulfil(): boolean {
    return (
      this.identifier != '' && this.secretKey != '' && this.publicKey != ''
    );
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
      'Secret key (Beta)',
      'secretKey',
      'textarea',
      this.secretKey,
    );
    dialog.appendChild(secretKeyContainer);
    let publicKeyContainer = getPropertyHTMLElement(
      'Public key (Beta)',
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
        let identifier = identifierContainer.getElementsByClassName(
          'property__input',
        )[0] as HTMLInputElement | HTMLTextAreaElement;
        let publicKey = publicKeyContainer.getElementsByClassName(
          'property__input',
        )[0] as HTMLInputElement | HTMLTextAreaElement;
        let secretKey = secretKeyContainer.getElementsByClassName(
          'property__input',
        )[0] as HTMLInputElement | HTMLTextAreaElement;

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
