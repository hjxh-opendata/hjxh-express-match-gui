export interface IElectronAPI {
    readErps: () => Promise<void>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
