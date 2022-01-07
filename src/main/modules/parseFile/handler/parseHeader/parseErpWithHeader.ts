import { GenericError } from '../../../base/GenericError';
import { ErrorParsingHeader } from '../../error_types';
import { erpKeyMap } from '../const';
import { validateErpItemWithHeader } from '../parseValidate/validators';
import { Row } from '../parse_base';
import { IErpItem } from '../parse_success';

import { ParseErpBase } from './parseErpBase';

export class ParseErpWithHeader extends ParseErpBase {
  private keysValid: boolean = false;

  public handle(row: Row): IErpItem {
    if (!this.keysValid) {
      if (
        row[erpKeyMap.id] !== undefined &&
        row[erpKeyMap.weight] !== undefined &&
        row[erpKeyMap.area] !== undefined &&
        row[erpKeyMap.date] !== undefined &&
        row[erpKeyMap.cpName] !== undefined
      ) {
        console.log('passed header validation');
        this.keysValid = true;
      } else {
        throw new GenericError<ErrorParsingHeader>(
          ErrorParsingHeader,
          `字段缺失，请确认包含以下字段：${Object.keys(erpKeyMap)}, 目标文件中已有字段：${Object.keys(row)}`
        );
      }
    }
    return validateErpItemWithHeader(row);
  }
}
