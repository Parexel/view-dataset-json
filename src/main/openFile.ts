import { dialog } from 'electron';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

const openFile = async (): Promise<object | undefined> => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: 'Open Dataset-JSON file',
    });
    if (!canceled) {
        const data = await readFile(filePaths[0], { encoding: 'utf8' });
        return JSON.parse(data);
    }
    return undefined;
};

export default openFile;
