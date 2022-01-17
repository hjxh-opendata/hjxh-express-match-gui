import { ErpModel } from './erp';
import { TrdModel } from './trd';

/**
 * the `dataModels` cannot use `as const` keywords, when put into `createConnections`
 */
export const dataModels = [ErpModel, TrdModel];
export type DataModel = typeof dataModels[number];
