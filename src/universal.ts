/**
 * ref: [get file name from path](https://stackoverflow.com/a/423385/9422455)
 * @param filePath
 */
export const getFileNameFromPath = (filePath: string): string => filePath.replace(/^.*[\\/]/, '');

/**
 * there is no standard assert module, except in node.
 * @link [What is “assert” in JavaScript? - Stack Overflow](https://stackoverflow.com/questions/15313418/what-is-assert-in-javascript)
 * @param {boolean} condition
 * @param {string} msg
 */
export const assert = (condition: boolean, msg?: string) => {
  if (!condition) {
    throw new Error(msg);
  }
};
