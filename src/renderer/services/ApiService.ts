import { ItemGroupData, ItemDataArray } from 'interfaces/common';

class ApiService {
    private mode: 'local' | 'remote';

    constructor(mode: 'local' | 'remote') {
        this.mode = mode;
    }

    // Open file
    public openFile = async (): Promise<{
        fileId: string;
        datasetNames: string[];
    }> => {
        let result = { fileId: '', datasetNames: [] };
        try {
            // Get the file path
            let fileId = '';
            let datasetNames = [];
            const filePath: string = await window.electron.openFile();
            // Request to open the file
            if (filePath !== undefined) {
                // Check if the dataset is already open
                let openFiles: {
                    [name: string]: { name: string; path: string };
                } = {};
                const openFilesResp = await fetch(
                    'http://localhost:8000/jsons'
                );
                if ([200, 204].includes(openFilesResp.status)) {
                    openFiles = (await openFilesResp.json()) as unknown as {
                        [name: string]: { name: string; path: string };
                    };
                }

                const isOpened = Object.keys(openFiles).some((id) => {
                    const file = openFiles[id];
                    if (file.path === filePath) {
                        fileId = id;
                        return true;
                    }
                    return false;
                });

                if (!isOpened) {
                    const requestOptions = {
                        method: 'POST',
                        body: JSON.stringify({ path: filePath }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    };
                    const requestResponse = await fetch(
                        'http://localhost:8000/jsons',
                        requestOptions
                    );
                    if ([200, 204].includes(requestResponse.status)) {
                        fileId = await requestResponse.text();
                    }
                }
                if (fileId !== '') {
                    // Get the list of datasets
                    const requestResponseGet = await fetch(
                        `http://localhost:8000/jsons/${fileId}/datasets`,
                        { method: 'GET' }
                    );
                    if ([200, 204].includes(requestResponseGet.status)) {
                        datasetNames = await requestResponseGet.json();
                    }
                    result = { fileId, datasetNames };
                }
            }
        } catch {
            // Handle exception
        }
        return result;
    };

    // Get dataset metadata
    public getMetadata = async (
        fileId: string,
        datasetName: string
    ): Promise<ItemGroupData | undefined> => {
        let result;
        try {
            const requestResponse = await fetch(
                `http://localhost:8000/jsons/${fileId}/datasets/${datasetName}/metadata`,
                { method: 'GET' }
            );
            if ([200, 204].includes(requestResponse.status)) {
                result =
                    (await requestResponse.json()) as unknown as ItemGroupData;
            }
        } catch {
            // Handle exception
        }
        return result;
    };

    // Get dataset data
    public getObservations = async (
        fileId: string,
        datasetName: string,
        page: number,
        pageSize: number,
        query = ''
    ): Promise<Array<ItemDataArray> | undefined> => {
        let result;
        try {
            const requestOptions = {
                method: 'GET',
            };
            const requestResponse = await fetch(
                `http://localhost:8000/jsons/${fileId}/datasets/${datasetName}/observations?page=${page}&page_size=${pageSize}&query=${query}`,
                requestOptions
            );
            if ([200, 204].includes(requestResponse.status)) {
                result =
                    (await requestResponse.json()) as unknown as Array<ItemDataArray>;
            }
        } catch (error) {
            // Handle exception
        }
        return result;
    };

    // Close file
    public close = async (fileId: string) => {
        try {
            const requestOptions = {
                method: 'DELETE',
            };
            const requestResponse = await fetch(
                `http://localhost:8000/jsons/${fileId}`,
                requestOptions
            );
            if ([200, 204].includes(requestResponse.status)) {
                // Closed succussfully
            }
        } catch (error) {
            // Handle exception
        }
        //
    };
}

export default ApiService;
