import API from '../../main/preload';

declare global {
  interface Window {
    electron: typeof API;
  }
}
