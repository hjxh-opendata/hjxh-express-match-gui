export const ENABLE_DB_UPSERT_MODE = 'ENABLE_DB_UPSERT_MODE';
export const ENABLE_PARSE_WITH_HEADER = 'ENABLE_PARSE_WITH_HEADER';
export const ENABLE_DATABASE = 'ENABLE_DATABASE';
export const ENABLE_UPLOAD_DUPLICATED_FILE = 'ENABLE_UPLOAD_DUPLICATED_FILE';
export const ENABLE_DB_LOG = 'ENABLE_DB_LOG';

export const booleanSettings = {
  [ENABLE_DB_UPSERT_MODE]: false,
  [ENABLE_UPLOAD_DUPLICATED_FILE]: true,
  [ENABLE_DB_LOG]: true,
};

export type BooleanKeys = keyof typeof booleanSettings;
