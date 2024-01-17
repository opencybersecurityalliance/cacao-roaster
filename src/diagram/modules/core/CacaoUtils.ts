import { CacaoConnectionType } from '../../elements/connections/CacaoBaseConnection';
import { CacaoConstructType } from '../../elements/constructs/CacaoBaseConstruct';
import { some } from 'min-dash';

/**
 * Class which provide some utils functions
 */
export default class CacaoUtils {
  /**
   * this is a method to get the type of an element
   * @param element must be a Shape or Connection
   * @returns the type as a CacaoConnectionType or CacaoConstructType. Return undefined if not found
   */
  static getTypeOfElement(
    element: any,
  ): CacaoConnectionType | CacaoConstructType | undefined {
    return element.type;
  }

  /**
   * this is a method to know if the two elements are the same
   * @param first
   * @param second
   * @returns True if they are equals, False otherwise
   */
  static is(first: any, second: any) {
    return first === second;
  }

  /**
   * this is a method to know if the list contains the element provided
   * @param element
   * @param list
   * @returns True if the list contains the element, False otherwise
   */
  static isAny(element: any, list: any[]) {
    return some(list, function (value: any) {
      return CacaoUtils.is(element, value);
    });
  }

  /**
   * this is a method to know if the provided parameter is a CacaoConnectionType
   * @param type
   * @returns True if it is a CacaoConnectionType, False otherwise
   */
  static isConnectionType(type: any) {
    return Object.values(CacaoConnectionType).includes(type);
  }

  /**
   * this is a method to know if the provided parameter is a CacaoConstructType
   * @param type
   * @returns True if it is a CacaoConstructType, False otherwise
   */
  static isConstructType(type: any) {
    return Object.values(CacaoConstructType).includes(type);
  }

  /**
   * replace
   * @param str
   * @returns
   */
  static escapeString(str: string): string {
    return str.replace(/[^0-9a-zA-z]+/g, '_');
  }

  /**
   * this is a method to know if a parameter is undefined or is an empty string
   * @param id
   * @returns true if it is undifined or is an empty string
   */
  static isUndefined(id: string): boolean {
    return id == undefined || id === '';
  }

  /**
   * this is a method to know if a parameter is defined or is not an empty string
   * @param id
   * @returns true if it is not undifined or is not an empty string
   */
  static isDefined(id: string): boolean {
    return (id != undefined && id !== '') as boolean;
  }

  /**
   * Filter/removed all empty or undifined values inside the object
   * @param obj
   * @returns an object without enmpty or undifined values
   */
  static filterEmptyValues(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (Array.isArray(obj)) {
      const filteredArray = obj
        .map(CacaoUtils.filterEmptyValues)
        .filter(value => value !== '' && value !== null && value !== undefined);
      return filteredArray.length > 0 ? filteredArray : undefined;
    }

    const filteredEntries = Object.entries(obj)
      .map(([key, value]) => [key, CacaoUtils.filterEmptyValues(value)])
      .filter(
        ([key, value]) => value !== '' && value !== null && value !== undefined,
      );
    const filteredObject = Object.fromEntries(filteredEntries);
    return Object.keys(filteredObject).length > 0 ? filteredObject : undefined;
  }
}
