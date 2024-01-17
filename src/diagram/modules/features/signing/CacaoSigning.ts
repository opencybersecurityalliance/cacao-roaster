import canonicalize from 'canonicalize';
import PlaybookHandler from '../../model/PlaybookHandler';
import { Signature } from '../../../../../lib/cacao2-js/src/data-types/Signature';
import PropertyPanel from '../side-panel/PropertyPanel';
import crypto from 'crypto';
import UserSettingsProps from '../../../../app/UserSettingsProps';
import {
  extractSchemaTypes,
  schemaDictWithoutAgentTarget,
} from '../../model/SchemaTypes';
import CacaoRules from '../rules/CacaoRules';
import CacaoUtils from '../../core/CacaoUtils';
import CacaoDialog from '../../core/CacaoDialog';

type PrivateKey = string;

/**
 * list of the hash algorithms supported by the application
 */
let hashAlgorithmList = ['sha256', 'sha224', 'sha384', 'sha512'];

/**
 * list of the sign algorithms supported by the application
 */
let signAlgorithmList = ['RSA-SHA256', 'RSA-SHA384', 'RSA-SHA512'];

/**
 * This class is a module
 * - module's entry points:
 *    - signPlaybook(..) : add a new signature to the playbook
 *    - showSignatureCheckDialog(...): show a dialog to see all signature: failed, correct, etc...
 */
export default class CacaoSigning {
  private _playbookHandler: PlaybookHandler;
  private _cacaoRules: CacaoRules;
  static $inject: string[];

  constructor(playbookHandler: PlaybookHandler, cacaoRules: CacaoRules) {
    this._playbookHandler = playbookHandler;
    this._cacaoRules = cacaoRules;
  }

  /**
   * show a dialog with a list of all the signature of the playbook and an indicator to say if they are correct or not
   */
  showSignatureCheckDialog() {
    let createSignatureTile = (signature: Signature): HTMLDivElement => {
      let createCountersignTile = (
        countersignature: Signature,
      ): HTMLDivElement => {
        let container = document.createElement('div');
        container.className = 'signatureContainer';

        let title = document.createElement('div');
        title.innerHTML = CacaoUtils.isDefined(countersignature.signee)
          ? countersignature.signee
          : 'no signee defined';
        title.className = 'signatureContainer__title';
        container.appendChild(title);

        let indicator = document.createElement('div');
        indicator.className = 'signatureContainer__indicator';
        switch (this.verifySignature(countersignature)) {
          case 'failed':
            container.classList.add('indicator--failed');
            container.title =
              'the verification of the signature can not be completed due to an error during the process';
            break;
          case 'incorrect':
            container.classList.add('indicator--incorrect');
            container.title =
              'the signature does not correspond to this version of the playbook';
            break;
          case 'not-implemented':
            container.classList.add('indicator--notimplemented');
            container.title =
              'the hash or sign algorithm is not implemented in this application';
            break;
          case 'passed':
            container.classList.add('indicator--passed');
            container.title =
              'this signature correspond to this version of the playbook';
            break;
        }
        container.appendChild(indicator);

        container.onclick = e => {
          let dialog = document.createElement('dialog');
          dialog.classList.add('list-dialog');
          document.body.appendChild(dialog);

          let propertyPanel = new PropertyPanel(
            this._playbookHandler,
            'signature',
            countersignature,
            dialog,
          );
          propertyPanel.setIsSubPanel(false);
          propertyPanel.setIsSubPanel(true);
          propertyPanel.addButton('Cancel', () => {
            propertyPanel.close();
            dialog.remove();
          });
          propertyPanel.addAllProperties();
          dialog.classList.add('property--disable');
          dialog.showModal();
          e.stopPropagation();
        };

        return container;
      };

      let container = document.createElement('div');
      container.className = 'signatureContainer';

      let title = document.createElement('div');
      title.innerHTML = CacaoUtils.isDefined(signature.signee)
        ? signature.signee
        : 'no signee defined';
      title.className = 'signatureContainer__title';
      container.appendChild(title);

      let indicator = document.createElement('div');
      indicator.className = 'signatureContainer__indicator';
      switch (this.verifySignature(signature)) {
        case 'failed':
          container.classList.add('indicator--failed');
          container.title =
            'the verification of the signature can not be completed due to an error during the process';
          break;
        case 'incorrect':
          container.classList.add('indicator--incorrect');
          container.title =
            'the signature does not correspond to this version of the playbook';
          break;
        case 'not-implemented':
          container.classList.add('indicator--notimplemented');
          container.title =
            'the hash or sign algorithm is not implemented in this application';
          break;
        case 'passed':
          container.classList.add('indicator--passed');
          container.title =
            'this signature correspond to this version of the playbook';
          break;
      }
      container.appendChild(indicator);

      let countersignature = signature.signature;
      while (countersignature) {
        container.appendChild(createCountersignTile(countersignature));
        countersignature = countersignature.signature;
      }

      container.onclick = () => {
        let dialog = document.createElement('dialog');
        dialog.classList.add('list-dialog');
        document.body.appendChild(dialog);

        let propertyPanel = new PropertyPanel(
          this._playbookHandler,
          'signature',
          signature,
          dialog,
        );
        propertyPanel.setIsAgentTarget(false);
        propertyPanel.setIsSubPanel(true);
        propertyPanel.addButton('Cancel', () => {
          propertyPanel.close();
          dialog.remove();
        });
        propertyPanel.addAllProperties();
        dialog.classList.add('property--disable');
        dialog.showModal();
      };

      return container;
    };

    let dialog = document.createElement('dialog') as HTMLDialogElement;
    dialog.className = 'cacaoDialog';
    document.body.appendChild(dialog);

    let titleDialog = document.createElement('div') as HTMLDivElement;
    titleDialog.innerHTML = 'Signatures';
    titleDialog.className = 'cacaoDialog__title';
    dialog.appendChild(titleDialog);

    let signatureList = this._playbookHandler.playbook.signatures;
    for (let signature of signatureList) {
      dialog.appendChild(createSignatureTile(signature));
      //text += signature.created + ") " + this.verifySignature(signature);
    }

    if (signatureList.length == 0) {
      let emptyMessage = document.createElement('div');
      emptyMessage.innerHTML = 'This playbook does not contain any signature';
      emptyMessage.className = 'cacaoDialog__message';
      dialog.appendChild(emptyMessage);
    }

    let buttonContainer = document.createElement('div') as HTMLDivElement;
    buttonContainer.className = 'cacaoDialog__buttonList';
    dialog.appendChild(buttonContainer);

    let okButton = document.createElement('button') as HTMLElement;
    okButton.innerText = 'cancel';
    okButton.className = 'buttonList__button button--primary';
    buttonContainer.appendChild(okButton);

    dialog.showModal();

    return new Promise<boolean>(resolve => {
      okButton.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
        resolve(false);
      });
    });
  }

  /**
   * show a dialog to fulfil a signature object and sign the playbook
   */
  async signOrCountersignPlaybook() {
    let action = this.canUserSignOrCounterSignPlaybook();

    if (action == 'sign') {
      await this.createSignatureObject(
        async (
          counterSignature: Signature,
          privateKey: string,
        ): Promise<void> => {
          await this.sign(counterSignature, privateKey);
        },
      );
    } else if (action == 'countersign') {
      let validSignature: Signature | undefined;
      for (let signature of this._playbookHandler.playbook.signatures) {
        if (this.signatureCanBeCountersigned(signature)) {
          if (
            !validSignature ||
            new Date(validSignature.modified).getTime() >
              new Date(signature.modified).getTime()
          ) {
            validSignature = signature;
          }
        }
      }
      if (!validSignature) {
        await CacaoDialog.showAlert(
          'You can not countersign this playbook',
          'You are not the creator of the playbook and this playbook does not contain any signature that pass the validation',
        );
        return;
      }

      await this.createSignatureObject(
        async (
          counterSignature: Signature,
          privateKey: string,
        ): Promise<void> => {
          await this.countersign(
            validSignature as any,
            counterSignature,
            privateKey,
          );
        },
      );
    } else {
      await CacaoDialog.showAlert(
        'You can not countersign this playbook',
        'You are not the creator of the playbook and this playbook does not contain any signature that pass the validation',
      );
    }
  }

  canUserSignOrCounterSignPlaybook(): 'sign' | 'countersign' | 'none' {
    if (
      this._playbookHandler.playbook.created_by ==
      UserSettingsProps.instance.identifier
    ) {
      //if you are the owner of the playbook
      return 'sign';
    } else {
      for (let signature of this._playbookHandler.playbook.signatures) {
        if (this.signatureCanBeCountersigned(signature)) {
          return 'countersign';
        }
      }
      return 'none';
    }
  }

  /**
   * create dialog to fulfil a signature object, on the click of the confirm button, we try to sign the playbook using the signature object, if it fails, it will show an error message in the dialog
   * @returns
   */
  private createSignatureObject(
    signingMethod: (signature: Signature, privateKey: string) => Promise<void>,
  ): Promise<boolean> {
    let dialog = document.createElement('dialog') as HTMLDialogElement;
    dialog.className = 'cacaoDialog';
    document.body.appendChild(dialog);

    let titleDialog = document.createElement('div') as HTMLDivElement;
    titleDialog.innerHTML = 'Sign the playbook';
    titleDialog.className = 'cacaoDialog__title';
    dialog.appendChild(titleDialog);

    let formContainer = document.createElement('div');
    formContainer.className = 'cacaoDialog__body';
    dialog.appendChild(formContainer);

    let propertyPanel = new PropertyPanel(
      this._playbookHandler,
      'signature',
      {},
      formContainer,
    );
    propertyPanel.setIsAgentTarget(false);

    let aa = extractSchemaTypes(
      schemaDictWithoutAgentTarget['signature'],
      schemaDictWithoutAgentTarget,
    );
    (schema as any).descriptions = aa.descriptions;
    propertyPanel.setSchemaData(schema);
    propertyPanel.showHeader(false);
    propertyPanel.showSwitcherJSON(false);
    propertyPanel.addAllProperties();

    let buttonContainer = document.createElement('div') as HTMLDivElement;
    buttonContainer.className = 'cacaoDialog__buttonList';
    dialog.appendChild(buttonContainer);

    let errorMessage = document.createElement('div') as HTMLElement;
    errorMessage.innerText = '';
    errorMessage.className = 'cacaoDialog__errormessage';
    buttonContainer.appendChild(errorMessage);

    let cancelButton = document.createElement('button') as HTMLElement;
    cancelButton.innerText = 'cancel';
    cancelButton.className = 'buttonList__button button--secondary';
    buttonContainer.appendChild(cancelButton);

    let confirmButton = document.createElement('button') as HTMLElement;
    confirmButton.innerText = 'sign';
    confirmButton.className = 'buttonList__button button--primary';
    buttonContainer.appendChild(confirmButton);

    dialog.showModal();

    return new Promise<boolean>(resolve => {
      confirmButton.addEventListener('click', async () => {
        let signature: Signature = new Signature(propertyPanel.submit());
        if (!signature.hash_algorithm || !signature.algorithm) {
          errorMessage.innerHTML =
            'In order to sign the playbook, we need the following fields to be filled correctly : hash_algorithm, algorithm';
          return;
        }

        if (!UserSettingsProps.instance.isFulfil) {
          errorMessage.innerHTML = 'you need to fulfil the settings properties';
          return;
        }

        try {
          signature.public_key = UserSettingsProps.instance.publicKey;
          await signingMethod(signature, UserSettingsProps.instance.secretKey);
        } catch (e) {
          errorMessage.innerHTML = 'issue in the signing process';
          return;
        }
        dialog.close();
        dialog.remove();
        resolve(true);
      });
      cancelButton.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
        resolve(false);
      });
    });
  }

  /**
   * countersign a signature
   * @param signature the signature to countersign
   * @param counterSignature the countersign signature
   * @param privateKey the private key use during the signature
   */
  private countersign(
    signature: Signature,
    counterSignature: Signature,
    privateKey: string,
  ) {
    // Step 1: Create or parse the playbook to be signed

    this._playbookHandler.setPlaybookDates();
    let currentDate = new Date().toISOString();
    counterSignature.created = currentDate;
    counterSignature.modified = currentDate;
    counterSignature.created_by = UserSettingsProps.instance.identifier;
    counterSignature.related_to = this._playbookHandler.playbook.id;
    counterSignature.related_version = this._playbookHandler.playbook.modified;
    counterSignature.value = '';
    counterSignature.revoked = false;
    counterSignature.signature = undefined!;

    // Step 2: Temporarily remove existing signature from the playbook
    let oldSignatures = this._playbookHandler.playbook.signatures;
    this._playbookHandler.playbook.signatures = [];

    // Step 3: Create and add signature object to the playbook from step 2
    let parentSignature = signature;
    while (signature?.signature != undefined) signature = signature.signature;
    signature.signature = counterSignature;
    this._playbookHandler.playbook.signatures.push(parentSignature);

    // Step 4: Create a JCS [RFC8785] canonical version of entire playbook from step 3
    let jsc_canonical = canonicalize(
      CacaoUtils.filterEmptyValues(this._playbookHandler.playbook),
    );
    if (jsc_canonical == undefined) {
      this._playbookHandler.playbook.signatures = oldSignatures;
      throw Error('error during canonicalization of the playbook');
    }

    // Step 5: Create a hash based on the hash algorithm defined in the signature object (e.g., sha-256 in hex) of the JCS version of the entire playbook from step 4
    let hashValue = hash(counterSignature.hash_algorithm, jsc_canonical);
    if (hashValue == undefined) {
      this._playbookHandler.playbook.signatures = oldSignatures;
      throw Error('error during hashing of the playbook');
    }

    // Step 6: Sign the hash from step 5 using the algorithm (e.g., RS256) defined in the signature object and base64URL.encode it
    let signValue = sign(
      counterSignature.algorithm,
      privateKey,
      Buffer.from(hashValue),
    );
    // Step 7: Append the new b64 digital signature from step 6 to the signatures value property (also include any existing signatures, that were removed in step 2)
    counterSignature.value = signValue.toString('hex');

    this._playbookHandler.playbook.signatures = oldSignatures;
  }

  /**
   * this method sign the playbook following the steps described in the specification
   */
  private async sign(signature: Signature, privateKey: PrivateKey) {
    // Step 1: Create or parse the playbook to be signed

    this._playbookHandler.setPlaybookDates();
    let currentDate = new Date().toISOString();
    signature.created = currentDate;
    signature.modified = currentDate;
    signature.created_by = UserSettingsProps.instance.identifier;
    signature.related_to = this._playbookHandler.playbook.id;
    signature.related_version = this._playbookHandler.playbook.modified;
    signature.value = '';
    signature.revoked = false;
    signature.signature = undefined!;

    // Step 2: Temporarily remove existing signature from the playbook
    let oldSignatures = this._playbookHandler.playbook.signatures;
    this._playbookHandler.playbook.signatures = [];

    // Step 3: Create and add signature object to the playbook from step 2
    this._playbookHandler.playbook.signatures.push(signature);

    // Step 4: Create a JCS [RFC8785] canonical version of entire playbook from step 3
    let jsc_canonical = canonicalize(
      CacaoUtils.filterEmptyValues(this._playbookHandler.playbook),
    );
    if (jsc_canonical == undefined) {
      this._playbookHandler.playbook.signatures = oldSignatures;
      throw Error('error during canonicalization of the playbook');
    }

    // Step 5: Create a hash based on the hash algorithm defined in the signature object (e.g., sha-256 in hex) of the JCS version of the entire playbook from step 4
    let hashValue = hash(signature.hash_algorithm, jsc_canonical);
    if (hashValue == undefined) {
      this._playbookHandler.playbook.signatures = oldSignatures;
      throw Error('error during hashing of the playbook');
    }

    // Step 6: Sign the hash from step 5 using the algorithm (e.g., RS256) defined in the signature object and base64URL.encode it
    let signValue = sign(
      signature.algorithm,
      privateKey,
      Buffer.from(hashValue),
    );
    // Step 7: Append the new b64 digital signature from step 6 to the signatures value property (also include any existing signatures, that were removed in step 2)
    signature.value = signValue.toString('hex');
    this._playbookHandler.playbook.signatures.push(...oldSignatures);
  }

  private verifySignature(
    signature: Signature,
  ): 'passed' | 'failed' | 'incorrect' | 'not-implemented' {
    if (
      !hashAlgorithmList.includes(signature.hash_algorithm) ||
      !signAlgorithmList.includes(signature.algorithm)
    ) {
      return 'not-implemented';
    }
    // Step 1: Parse the signed playbook to verify

    // Step 2: Capture and remove the digital signature from the value property of the signature you want to verify (also remove any other signatures that may be included in the playbook)
    let playbookSignatures = this._playbookHandler.playbook.signatures;

    //in the case where the signature is a counter signature, this variable will contains the ancestor/parent signature that is directly inside the playbook
    let initialSignature = undefined;
    for (let playbookSignature of this._playbookHandler.playbook.signatures) {
      playbookSignature = new Signature(playbookSignature);
      let countersign = playbookSignature;

      while (countersign) {
        if (countersign.id == signature.id) {
          initialSignature = playbookSignature;

          signature = countersign;
          break;
        }
        let temp = new Signature(countersign.signature);
        countersign.signature = temp;
        countersign = temp;
      }
      if (initialSignature) break;
    }

    if (initialSignature == undefined) {
      throw Error('cant find the signature in the playbook');
    }

    let valueSignature = signature.value;
    signature.value = '';
    signature.signature = undefined!;
    this._playbookHandler.playbook.signatures = [initialSignature];

    // Step 3: Parse or fetch the public key from step 2
    let publicKey = signature.public_key;

    // Step 4: Create a JCS [RFC8785] canonical version of entire playbook from step 2
    let jsc_canonical = canonicalize(
      CacaoUtils.filterEmptyValues(this._playbookHandler.playbook),
    );
    if (jsc_canonical == undefined) {
      this._playbookHandler.playbook.signatures = playbookSignatures;
      return 'failed';
    }

    // Step 5: Create a hash based on the hash algorithm defined in the signature object (e.g., sha-256 in hex) of the JCS version of the entire playbook from step 4
    let hashValue = hash(signature.hash_algorithm, jsc_canonical);
    if (hashValue == undefined) {
      this._playbookHandler.playbook.signatures = playbookSignatures;
      return 'failed';
    }

    // Step 6: Verify the signature received using the public key and algorithm that is defined in the signature object
    try {
      let verified = verify(
        signature.algorithm,
        publicKey,
        Buffer.from(hashValue),
        Buffer.from(valueSignature, 'hex'),
      );

      this._playbookHandler.playbook.signatures = playbookSignatures;
      return verified ? 'passed' : 'incorrect';
    } catch (_) {
      this._playbookHandler.playbook.signatures = playbookSignatures;
      return 'failed';
    }
  }

  /**
   * say if we can countersign the signature or not
   * @param signature
   * @returns a boolean: True if we can countersign, False otherwise
   */
  signatureCanBeCountersigned(signature: Signature): boolean {
    if (this.verifySignature(signature) != 'passed') {
      return false;
    }
    if (this._playbookHandler.playbook.revoked) {
      return false;
    }
    let validityDate = new Date(this._playbookHandler.playbook.valid_until);
    if (
      !isNaN(validityDate.getTime()) &&
      validityDate.getTime() < new Date().getTime()
    ) {
      return false;
    }

    validityDate = new Date(this._playbookHandler.playbook.valid_from);
    if (
      !isNaN(validityDate.getTime()) &&
      validityDate.getTime() > new Date().getTime()
    ) {
      return false;
    }
    return true;
  }
}

/**
 * this function hash the provided value using the hash_algorithm
 * @param hash_algorithm algorithm use to hash the value
 * @param value value to hash
 * @returns the hash
 */
function hash(hash_algorithm: string, value: string): string {
  if (!hashAlgorithmList.includes(hash_algorithm)) {
    throw Error(
      'hash algorithm not handle by the application: ' + hash_algorithm,
    );
  }
  return crypto.createHash(hash_algorithm).update(value).digest('hex');
}

/**
 * this function sign the value using the algorithm with the private key provided
 * @param algorithm algorithm use to sign the value
 * @param private_key the private key of the user use to sign the value
 * @param value the value to sign
 * @returns a Buffer which contains the signature
 */
function sign(algorithm: string, private_key: string, value: Buffer): Buffer {
  if (!signAlgorithmList.includes(algorithm)) {
    throw Error('sign algorithm not handle by the application: ' + algorithm);
  }
  let signature = crypto.createSign(algorithm);
  signature = signature.update(value);
  let buffer = signature.sign(private_key);
  return buffer;
}

/**
 * this function verify if the signature match the value using the algorithm and public key provided
 * @param algorithm the sign algorithm use to verify the signature
 * @param public_key the public key use to verify the signature
 * @param value the value that should match the signature
 * @param signature the sqignature that should match the value
 * @returns a boolean, True if the signature is correct, False otherwise
 */
function verify(
  algorithm: string,
  public_key: string,
  value: Buffer,
  signature: Buffer,
): boolean {
  if (!signAlgorithmList.includes(algorithm)) {
    throw Error('sign algorithm not handle by the application: ' + algorithm);
  }
  let verif = crypto.createVerify(algorithm);
  verif = verif.update(value);
  return verif.verify(public_key, signature);
}

let schema = {
  properties: {
    type: 'jss',
    id: 'identifier',
    signee: 'string',
    valid_from: 'timestamp',
    valid_until: 'timestamp',
    hash_algorithm: 'hash-algorithm-type-enum',
    algorithm: 'signature-algorithm-type-enum',
    public_cert_chain: 'string[]',
    cert_url: 'string',
    thumbprint: 'string',
  },
  enums: {
    'hash-algorithm-type-enum': hashAlgorithmList,
    'signature-algorithm-type-enum': signAlgorithmList,
  },
  required: [
    'type',
    'id',
    'created',
    'modified',
    'signee',
    'related_to',
    'related_version',
    'hash_algorithm',
    'algorithm',
    'public_key',
    'private_key',
  ],
  commonProperties: {},
};

CacaoSigning.$inject = ['playbookHandler', 'cacaoRules'];
