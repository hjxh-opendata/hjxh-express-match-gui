import { IResBase, genResBase } from '../../../base/response';
import { COL_WEIGHT, ErpCols } from '../const';

import { IContentWithResult, IContentWithRow } from './parse_base';

// omit the `weight` key since the type of all other is string, whereas we wanna it to be a number
// inspired by: https://stackoverflow.com/a/67896916/9422455
type ErpItemFields = Omit<Record<ErpCols, string>, COL_WEIGHT>;

export interface IErpItem extends ErpItemFields {
  weight: number;
}

export interface IContentParseSuccess extends IContentWithRow, IContentWithResult {
  item: IErpItem;
}

export interface IResParseSuccess extends IResBase {
  content: IContentParseSuccess;
}

export const genResParseSuccess = (content: IContentParseSuccess): IResParseSuccess => ({
  ...genResBase(),
  ...{
    content,
  },
});

export const sampleErpItem: IErpItem = {
  id: 'test--' + new Date(),
  weight: 1,
  area: '上海',
  date: '2022-01-01',
  cp: '顺丰快递',
};
