export const ENABLE_DB_UPSERT_MODE = 'ENABLE_DB_UPSERT_MODE';
export const ENABLE_PARSE_WITH_HEADER = 'ENABLE_PARSE_WITH_HEADER';
export const ENABLE_DATABASE = 'ENABLE_DATABASE';

export const booleanSettings = {
  [ENABLE_DATABASE]: true,
  [ENABLE_DB_UPSERT_MODE]: false,
  [ENABLE_PARSE_WITH_HEADER]: true,
};

export type BooleanKeys = keyof typeof booleanSettings;
