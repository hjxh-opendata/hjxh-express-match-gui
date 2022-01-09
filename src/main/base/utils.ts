export const isDebugEnabled = () => {
  return process.env.DEBUG !== undefined;
};

export const isDebugDBEnabled = () => {
  return ['*', 'db'].includes(process.env.DEBUG || '');
};

export const isDebugFileEnabled = () => {
  return ['*', 'file'].includes(process.env.DEBUG || '');
};
