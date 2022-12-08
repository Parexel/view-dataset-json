import { ItemGroupData } from 'interfaces/datasetJson';
import { Channels } from 'main/preload';

declare global {
    interface Window {
        electron: {
            openFile: () => Promise<string>;
            getMetadata: (fileId: string) => Promise<ItemGroupData>;
            ipcRenderer: {
                sendMessage(channel: Channels, args: unknown[]): void;
                on(
                    channel: string,
                    func: (...args: unknown[]) => void
                ): (() => void) | undefined;
                once(channel: string, func: (...args: unknown[]) => void): void;
            };
        };
    }
}

export {};
