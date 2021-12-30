import { ErpKeys, ErpPosMap, IErpItem } from '../../@types/erp_keys';
import { MyError } from '../../@types/errors';
import { ErrorParsingHeaders } from '../../@types/errors/parse';

import { erpKeyMap } from '../../config/configBusiness';

import { ParseErpBase } from './parseErpBase';
import { validateErpItemWithoutHeader } from './validators';

export class ParseErpWithoutHeader extends ParseErpBase {
  private erpPosMap = {} as ErpPosMap;

  public handle(row: string[]): IErpItem | void {
    if (this.erpPosMap._id === undefined) {
      // eslint-disable-next-line no-restricted-syntax
      for (const k of Object.keys(ErpKeys)) {
        const pos = row.findIndex((v) => v === erpKeyMap[k]);
        // prettier-ignore
        if (pos < 0) throw new MyError(ErrorParsingHeaders, `not find key of [${k}] --> [${erpKeyMap[k]}]`);
        this.erpPosMap[k] = pos;
      }
    } else {
      return validateErpItemWithoutHeader(row, this.erpPosMap);
    }
  }
}
