export const ENABLE_DB_UPSERT_MODE = 'ENABLE_DB_UPSERT_MODE';
export const ENABLE_PARSE_WITH_HEADER = 'ENABLE_PARSE_WITH_HEADER';
export const ENABLE_DATABASE = 'ENABLE_DATABASE';
export const ENABLE_UPLOAD_DUPLICATED_FILE = 'ENABLE_UPLOAD_DUPLICATED_FILE';

export const booleanSettings = {
  [ENABLE_DB_UPSERT_MODE]: false,
  [ENABLE_UPLOAD_DUPLICATED_FILE]: true,
};

export type BooleanKeys = keyof typeof booleanSettings;
