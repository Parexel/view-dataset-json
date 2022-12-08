import { useState, useEffect } from 'react';
import {
    IGeneralTableHeaderCell,
    IGeneralTableDataCell,
    DatasetJson,
    ItemGroupData,
} from 'interfaces/common';
import GeneralTable from 'renderer/components/GeneralTable';
import ApiService from 'renderer/services/ApiService';
import { useAppSelector, useAppDispatch } from 'renderer/redux/hooks';
import { setData } from 'renderer/redux/slices/data';

const apiService = new ApiService();

const ViewDataset = () => {
    const dispatch = useAppDispatch();
    const name = useAppSelector((state) => state.data.name);

    const [table, setTable] = useState<{
        data: IGeneralTableDataCell[];
        header: IGeneralTableHeaderCell[];
        metadata: { [name: string]: string };
    }>({ data: [], header: [], metadata: {} });

    useEffect(() => {
        const openDataset = async () => {
            const dataset: ItemGroupData = await apiService.getData();
            if (dataset !== undefined) {
                const newMetadata = {
                    name: dataset.name,
                    label: dataset.label,
                };

                const rawHeader = dataset.items;
                const newData = dataset.itemData.map((item) => {
                    const row: IGeneralTableDataCell = {};
                    item.forEach((value, index) => {
                        row[rawHeader[index].name] = value as number | string;
                    });
                    return row;
                });

                const newHeader: IGeneralTableHeaderCell[] = rawHeader.map(
                    (item) => {
                        let result;
                        if (item.name === 'ITEMGROUPDATASEQ') {
                            result = {
                                id: item.name,
                                label: item.label,
                                hidden: true,
                                key: true,
                            };
                        } else {
                            result = {
                                id: item.name,
                                label: item.label,
                            };
                        }
                        return result;
                    }
                );
                setTable({
                    data: newData,
                    header: newHeader,
                    metadata: newMetadata,
                });
                dispatch(setData({ name: newMetadata.name }));
            }
        };
        if (name === null) {
            openDataset();
        }
        return () => {
            apiService.close();
        };
    }, [name, dispatch]);

    return (
        <GeneralTable
            title={table.metadata.name}
            data={table.data}
            header={table.header}
            pagination
            sorting
            search
            rowsPerPageOptions={[50, 100, 250]}
            initialRowsPerPage={100}
        />
    );
};

export default ViewDataset;
