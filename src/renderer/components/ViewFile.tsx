import { useState, useEffect } from 'react';
import ApiService from 'renderer/services/ApiService';
import { useAppDispatch } from 'renderer/redux/hooks';
import { setData } from 'renderer/redux/slices/data';
import ViewDataset from 'renderer/components/ViewDataset';

const apiService = new ApiService('remote');

const ViewFile = () => {
    const dispatch = useAppDispatch();

    const [fileInfo, setFileInfo] = useState<{
        fileId: string;
        datasetNames: Array<string>;
    }>({ fileId: '', datasetNames: [] });

    useEffect(() => {
        const openDataset = async () => {
            const { fileId, datasetNames } = await apiService.openFile();
            setFileInfo({
                fileId,
                datasetNames,
            });
            dispatch(setData({ name: datasetNames[0], datasetNames }));
        };
        if (fileInfo.fileId === '') {
            openDataset();
        }
        return () => {
            if (fileInfo.fileId !== '') {
                apiService.close(fileInfo.fileId);
                dispatch(setData({ name: null, datasetNames: [] }));
            }
        };
    }, [dispatch, fileInfo.fileId]);

    return <ViewDataset fileId={fileInfo.fileId} />;
};

export default ViewFile;
