import * as csv from '@fast-csv/parse';
import * as fs from 'fs';
import iconv from 'iconv-lite';
import { getConnection } from 'typeorm';

import { DataModel } from '../../base/db/models';
import { ErpModel } from '../../base/db/models/erp';
import { TrdModel } from '../../base/db/models/trd';
import { GenericError, Status } from '../../base/interface/errors';
import { mainGetSetting } from '../../base/settings';
import { ENABLE_DB_UPSERT_MODE } from '../../base/settings/boolean_settings';
import { msgParseHeaderError } from '../../base/settings/string_settings';
import { isDebugFileEnabled } from '../../base/utils';

import { SizeTransformer } from './handler/SizeTransformer';
import { SIGNAL_ID, preParsing } from './handler/checkCsvEncoding';
import { validateErpItem } from './handler/validators';
import { COL_ID, ErpCols, erpCols, trdCols } from './interface/cols';
import { IContentEnd, IContentSuccess } from './interface/content';
import {
  ErrorDecodingRow,
  ErrorParsingRows,
  errorDecodingRow,
} from './interface/errors/parsingRows';
import { ErrorPreParsingRows } from './interface/errors/preParsingRows';
import { ErrorValidators } from './interface/errors/validatingRoes';
import { IErpItem } from './interface/item';
import { ParsingProgress } from './interface/rows';

export const storeIntoDb = async (item, model: DataModel): Promise<boolean> => {
  // item.foreign = item.id;
  const builder = getConnection().createQueryBuilder();
  if (mainGetSetting('boolean', ENABLE_DB_UPSERT_MODE)) {
    const res = await builder.update(model).where('id = :id', { id: item.id }).set(item).execute();
    return res.affected === 1;
  }
  return builder
    .insert()
    .into(model)
    .values(item)
    .execute()
    .then(() => true)
    .catch((e) => {
      console.error(e);
      return false;
    });
};

export const parsingRow = async (
  item: IErpItem,
  progress: ParsingProgress,
  isErp: boolean,
  onParsingRowsError?
) => {
  /**
   * step 2.1: validate item
   */
  await validateErpItem(item).catch((err) => {
    // prettier-ignore
    console.error({ 'validate error': (err as unknown as GenericError<ErrorValidators>).message, 'raw input': item, });
    progress.updateRowFailedForValidation();
    if (onParsingRowsError) onParsingRowsError(err as unknown as GenericError<ErrorParsingRows>);
    return;
  });

  /**
   * step 2.2: storing db
   */
  const isDbOk = await storeIntoDb(item, isErp ? ErpModel : TrdModel);
  if (isDbOk) progress.updateRowParsed();
  else progress.updateRowFailedForStoringIntoDB();
};

export interface ReqParseFile {
  fp: string;
  isErp: boolean;
  onPreParseRowsError?: (error: GenericError<ErrorPreParsingRows>) => void;
  onParsingRowsError?: (error: GenericError<ErrorParsingRows>) => void;
  onParsingException?: (error: GenericError<ErrorDecodingRow>) => void;
  onData?: (content: IContentSuccess) => void;
  onEnd?: (content: IContentEnd) => void;
}

export const handleParseFileCenter = async (req: ReqParseFile) => {
  const { fp, isErp, onData, onEnd, onPreParseRowsError, onParsingRowsError, onParsingException } =
    req;
  console.log(`reading file, name: ${fp}`);

  /**
   * encoding
   */
  let useIconv;
  try {
    useIconv = await preParsing(fp, isErp);
  } catch (e) {
    console.error((e as Error).message);
    if (onPreParseRowsError) onPreParseRowsError(e as unknown as GenericError<ErrorPreParsingRows>);
    return;
  }
  console.log('start parsing rows');

  /**
   * create stream
   */
  const s = fs.createReadStream(fp);
  const s2 = useIconv ? s.pipe(iconv.decodeStream('gbk')).pipe(iconv.encodeStream('utf-8')) : s;

  const cols = isErp ? erpCols : trdCols;
  const progress = new ParsingProgress();
  const headers = (headers) => headers.map((header) => (header === SIGNAL_ID ? COL_ID : header));

  s2
    /**
     * calculate the read file progress
     */
    .pipe(new SizeTransformer(fs.statSync(fp).size, (pct) => progress.updateSizePct(pct)))

    /**
     * parsing from file block to rows
     */
    .pipe(csv.parse({ headers })) // IMPROVE: header true/false; ref: https://stackoverflow.com/a/22809513/9422455

    /**
     * listening data pipe
     */
    .on('data', async (item: IErpItem) => {
      /**
       * step 1: convert row into item
       * 1. nTotalRows ++
       * 2. key of id transform
       * 3. drop other unrelated keys
       */
      progress.updatePreparingRow();
      // prettier-ignore
      Object.keys(item).forEach((k) => {if (!cols.includes(k as ErpCols)) delete item[k];}); // drop unwanted cols

      /**
       * step 2: parsing row
       * 1. validate row
       * 2. store row
       */
      await parsingRow(item, progress, isErp, onParsingRowsError);

      /**
       * step 3: timely onData callback
       * no matter parsing error or right, this would be executed, since providing a different view from the `parsingRow`
       */
      if (onData) onData({ parsedItem: item, progress: progress.export(), status: Status.OK });

      /**
       * step 4: finish callback
       */
      if (progress.isFinishedStoring()) {
        console.log(progress.export());
        if (onEnd) onEnd({ status: Status.OVER, progress: progress.export() });
      }
    })

    /**
     * [error] triggered when fast-csv failed to parse
     */
    .on('error', (err) => {
      // TODO: test for parsing error, since the api has changed
      console.error(err);
      // prettier-ignore
      if (onParsingException) onParsingException(new GenericError(errorDecodingRow,  msgParseHeaderError));
      if (onEnd) onEnd({ status: Status.OVER, progress: progress.export() });
    })

    /**
     * [end] when files read finished
     */
    .on('end', () => {
      if (isDebugFileEnabled()) console.log('parsing file finished', progress.export());
      progress.updateFileParsingFinished();
    });
};
