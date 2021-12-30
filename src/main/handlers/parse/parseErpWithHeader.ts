import { ErpKeys, IErpItem } from '../../@types/erp_keys';
import { MyError } from '../../@types/errors';
import { ErrorParsingHeaders } from '../../@types/errors/parse';

import { erpKeyMap } from '../../config/configBusiness';

import { ParseErpBase } from './parseErpBase';
import { validateErpItemWithHeader } from './validators';

export class ParseErpWithHeader extends ParseErpBase {
  private keysValid: boolean = false;

  public handle(row: { [key in ErpKeys]: string }): IErpItem {
    if (!this.keysValid) {
      if (
        row[erpKeyMap._id] !== undefined &&
        row[erpKeyMap.weight] !== undefined &&
        row[erpKeyMap.area] !== undefined &&
        row[erpKeyMap.date] !== undefined &&
        row[erpKeyMap.cpName] !== undefined
      ) {
        console.log('passed header validation');
        this.keysValid = true;
      } else {
        throw new MyError(
          ErrorParsingHeaders,
          `字段缺失，请确认包含以下字段：${Object.keys(
            erpKeyMap
          )}, 目标文件中已有字段：${Object.keys(row)}`
        );
      }
    }
    return validateErpItemWithHeader(row);
  }
}
