import { dialog } from 'electron';
import fs from 'fs';

const openFile = async (): Promise<
    { path: string; stream: fs.ReadStream } | undefined
> => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: 'Open Dataset-JSON file',
    });
    if (!canceled) {
        const stream = fs.createReadStream(filePaths[0], { encoding: 'utf8' });
        return { path: filePaths[0], stream };
    }
    return undefined;
};

export default openFile;
