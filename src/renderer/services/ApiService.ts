import { DatasetJson, ItemGroupData } from 'interfaces/common';

class ApiService {
    private datasetId: string | null;

    constructor() {
        this.datasetId = null;
    }

    // Open file
    public getData = async (): Promise<ItemGroupData> => {
        const fileId: string = await window.electron.openFile();
        const metadata = this.getMetadata(fileId);
        return metadata;

        /*
        const itemGroupData = (rawJson.clinicalData || rawJson.referenceData)
            ?.itemGroupData;
        if (itemGroupData !== undefined) {
            this.datasetId = Object.keys(itemGroupData)[0];
        }
        return rawJson;
        */
    };

    // Open file
    public getMetadata = async (fileId: string): Promise<ItemGroupData> => {
        const rawMetadata = await window.electron.getMetadata(fileId);
        return rawMetadata;
    };

    // Close file
    public close = () => {
        if (this.datasetId !== null) {
            this.datasetId = null;
        }
    };
}

export default ApiService;
