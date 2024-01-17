/**
 * A class to sort elements inside a table.
 */
export class SortableTable {
  private tableNode: HTMLElement;
  private columnHeaders: NodeListOf<HTMLTableHeaderCellElement>;
  private sortColumns: number[];
  private optionCheckbox: HTMLInputElement | null;

  constructor(tableNode: HTMLElement) {
    this.tableNode = tableNode;
    this.columnHeaders = tableNode.querySelectorAll('thead th');
    this.sortColumns = [];

    for (let i = 0; i < this.columnHeaders.length; i++) {
      const ch = this.columnHeaders[i];
      const buttonNode = ch.querySelector('button');
      if (buttonNode) {
        this.sortColumns.push(i);
        buttonNode.setAttribute('data-column-index', i.toString());
        buttonNode.addEventListener('click', this.handleClick.bind(this));
      }
    }

    this.optionCheckbox = document.querySelector(
      'input[type="checkbox"][value="show-unsorted-icon"]',
    );

    if (this.optionCheckbox) {
      this.optionCheckbox.addEventListener(
        'change',
        this.handleOptionChange.bind(this),
      );
      if (this.optionCheckbox.checked) {
        this.tableNode.classList.add('show-unsorted-icon');
      }
    }
  }

  private setColumnHeaderSort(columnIndex: string | number): void {
    if (typeof columnIndex === 'string') {
      columnIndex = parseInt(columnIndex);
    }

    for (let i = 0; i < this.columnHeaders.length; i++) {
      const ch = this.columnHeaders[i];
      const buttonNode = ch.querySelector('button');
      if (i === columnIndex) {
        const value = ch.getAttribute('aria-sort');
        if (value === 'descending') {
          ch.setAttribute('aria-sort', 'ascending');
          this.sortColumn(
            columnIndex,
            'ascending',
            ch.classList.contains('num'),
          );
        } else {
          ch.setAttribute('aria-sort', 'descending');
          this.sortColumn(
            columnIndex,
            'descending',
            ch.classList.contains('num'),
          );
        }
      } else {
        if (ch.hasAttribute('aria-sort') && buttonNode) {
          ch.removeAttribute('aria-sort');
        }
      }
    }
  }

  private sortColumn(
    columnIndex: number,
    sortValue: string,
    isNumber: boolean,
  ): void {
    function compareValues(
      a: { value: string | number },
      b: { value: string | number },
    ): number {
      if (sortValue === 'ascending') {
        if (a.value === b.value) {
          return 0;
        } else {
          if (isNumber) {
            return Number(a.value) - Number(b.value);
          } else {
            return a.value < b.value ? -1 : 1;
          }
        }
      } else {
        if (a.value === b.value) {
          return 0;
        } else {
          if (isNumber) {
            return Number(b.value) - Number(a.value);
          } else {
            return a.value > b.value ? -1 : 1;
          }
        }
      }
    }

    if (typeof isNumber !== 'boolean') {
      isNumber = false;
    }

    const tbodyNode = this.tableNode.querySelector('tbody');
    const rowNodes: HTMLElement[] = [];
    const dataCells: { index: number; value: string | number }[] = [];

    let rowNode = tbodyNode?.firstElementChild as HTMLElement | null;
    let index = 0;

    while (rowNode) {
      rowNodes.push(rowNode);
      const rowCells = rowNode.querySelectorAll('th, td');
      const dataCell = rowCells[columnIndex];
      const data: { index: number; value: string | number } = {
        index: index,
        value: dataCell.textContent?.toLowerCase().trim() ?? '',
      };

      if (isNumber) {
        data.value = parseFloat(data.value as string);
      }

      dataCells.push(data);
      rowNode = rowNode.nextElementSibling as HTMLElement | null;
      index += 1;
    }

    dataCells.sort(compareValues);

    // Remove rows
    while (tbodyNode?.firstChild) {
      tbodyNode.removeChild(tbodyNode.lastChild as Node);
    }

    // Add sorted rows
    for (let i = 0; i < dataCells.length; i += 1) {
      tbodyNode?.appendChild(rowNodes[dataCells[i].index]);
    }
  }

  /* EVENT HANDLERS */

  private handleClick(event: Event): void {
    const tgt = event.currentTarget as HTMLElement;
    this.setColumnHeaderSort(tgt.getAttribute('data-column-index') ?? '');
  }

  private handleOptionChange(event: Event): void {
    const tgt = event.currentTarget as HTMLInputElement;

    if (tgt.checked) {
      this.tableNode.classList.add('show-unsorted-icon');
    } else {
      this.tableNode.classList.remove('show-unsorted-icon');
    }
  }
}
