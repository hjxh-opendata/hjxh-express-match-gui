import { GenericError } from '../../../base/GenericError';
import { ErrorMismatchingHeaders, ErrorParsingHeaders } from '../../error_types';
import { ErpKeys, erpKeyMap } from '../const';
import { validateErpItemWithoutHeader } from '../parseValidate/validators';
import { ErpPosMap, Row } from '../parse_base';
import { IErpItem } from '../parse_success';

import { ParseErpBase } from './parseErpBase';

export class ParseErpWithoutHeader extends ParseErpBase {
  private header: string[] = [];

  private N = 0;

  private erpPosMap = {} as ErpPosMap;

  public handle(row: string[]): IErpItem | void {
    if (this.erpPosMap.id === undefined) {
      this.header = row;
      this.N = this.header.length;
      // eslint-disable-next-line no-restricted-syntax
      for (const k of Object.keys(ErpKeys)) {
        const pos = row.findIndex((v) => v === erpKeyMap[k]);
        // prettier-ignore
        if (pos < 0) throw new GenericError(ErrorParsingHeaders, `not find key of [${k}] --> [${erpKeyMap[k]}]`);
        this.erpPosMap[k] = pos;
      }
    } else {
      return validateErpItemWithoutHeader(row, this.erpPosMap);
    }
  }

  public arr2row(arr: string[]): Row {
    if (arr.length !== this.N) {
      throw new GenericError<ErrorMismatchingHeaders>(ErrorMismatchingHeaders, `header: ${this.header}, arr: ${arr}`);
    }
    const item: Row = {};
    for (let i = 0; i < this.N; i += 1) {
      item[this.header[i]] = arr[i];
    }
    return item;
  }
}
