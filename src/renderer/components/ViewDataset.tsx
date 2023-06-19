import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import {
    IGeneralTableHeaderCell,
    IGeneralTableDataCell,
    ItemDescription,
    ItemType,
} from 'interfaces/common';
import GeneralTable from 'renderer/components/GeneralTable';
import ApiService from 'renderer/services/ApiService';
import { useAppSelector, useAppDispatch } from 'renderer/redux/hooks';

const BUFFER_SIZE = 10000;
const PAGE_SIZE = 1000;
const PAGE_BUFFER = 4;

const styles = {
    main: {
        display: 'flex',
        flex: '1 1 auto',
    },
    table: {
        display: 'flex',
        flex: '1 1 auto',
        height: '20vh',
    },
    pagination: {
        display: 'flex',
        flex: '0 1 1%',
        justifyContent: 'flex-start',
    },
};

interface IData {
    // Array with actual observations
    observations: IGeneralTableDataCell[];
    // The minimal row which is stored in the memory
    startRow: number;
    // The maximum row which is stored in the memory
    endRow: number;
}

const apiService = new ApiService('remote');

const readAdditionalData = async ({
    currentPage,
    rowsPerPage,
    data,
    setData,
    header,
    fileId,
    name,
}: {
    currentPage: number;
    rowsPerPage: number;
    data: IData;
    setData: React.Dispatch<React.SetStateAction<IData>>;
    header: IGeneralTableHeaderCell[];
    fileId: string;
    name: string;
}) => {
    // Check if is is needed to read the next or the previous records or no records at all;
    let type: 'next' | 'prev';
    if (Math.max(0, currentPage - PAGE_BUFFER) * rowsPerPage < data.startRow) {
        // Case when it is needed to read the previous records
        type = 'prev';
    } else if (
        Math.max(0, currentPage + PAGE_BUFFER) * rowsPerPage >
        data.endRow
    ) {
        // Case when it is needed to read the following records
        type = 'next';
    } else {
        return;
    }

    // The page which will be requested
    const startPage =
        Math.floor(
            ((currentPage + (type === 'prev' ? -PAGE_BUFFER : PAGE_BUFFER)) *
                rowsPerPage) /
                PAGE_SIZE
        ) + 1;

    const newDataRaw = await apiService.getObservations(
        fileId,
        name as string,
        startPage,
        PAGE_SIZE
    );

    if (newDataRaw === undefined) {
        return;
    }

    let newObservations = newDataRaw.map((item) => {
        const row: IGeneralTableDataCell = {};
        item.forEach((value, index) => {
            row[header[index].id] = value as number | string;
        });
        return row;
    });

    let oldObservations = data.observations;

    let newStartRow = 0;
    let newEndRow = 0;
    if (type === 'prev') {
        newStartRow = (startPage - 1) * rowsPerPage;
        // Determine if new records overlap with already loaded records
        if ((startPage - 1) * PAGE_SIZE >= data.startRow) {
            // Overlap
            if (newStartRow + BUFFER_SIZE < data.endRow) {
                // Remove some observations from the old data
                newEndRow = newStartRow + BUFFER_SIZE;
                oldObservations = oldObservations.slice(
                    0,
                    newStartRow - data.startRow
                );
            } else {
                newEndRow = data.endRow;
            }
        } else {
            // No overlap
            newEndRow = startPage * PAGE_SIZE;
            oldObservations = [];
        }
        newObservations = newObservations.concat(oldObservations);
    } else if (type === 'next') {
        // Case when it is needed to read the following records
        newEndRow = startPage * PAGE_SIZE;
        // Determine if new records overlap with already loaded records
        if ((startPage - 1) * PAGE_SIZE <= data.endRow) {
            // Overlap
            if (newEndRow - BUFFER_SIZE > data.startRow) {
                // Remove some observations from the old data
                newStartRow = newEndRow - BUFFER_SIZE;
                oldObservations = oldObservations.slice(
                    newStartRow - data.startRow
                );
            } else {
                newStartRow = data.startRow;
            }
        } else {
            // No overlap
            newStartRow = (startPage - 1) * rowsPerPage;
            oldObservations = [];
        }
        newObservations = oldObservations.concat(newObservations);
    }

    setData({
        observations: newObservations,
        startRow: newStartRow,
        endRow: newEndRow,
    });
};

const ViewDataset: React.FC<{ fileId: string }> = ({
    fileId,
}: {
    fileId: string;
}) => {
    const dispatch = useAppDispatch();
    const name = useAppSelector((state) => state.data.name);

    const [table, setTable] = useState<{
        header: IGeneralTableHeaderCell[];
        metadata: { name: string; label: string; records: number };
    }>({ header: [], metadata: { name: '', label: '', records: 0 } });

    const [data, setData] = useState<IData>({
        observations: [],
        startRow: 0,
        endRow: 0,
    });

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);

    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: React.SetStateAction<number>
    ) => {
        const currentPage = newPage as number;
        readAdditionalData({
            currentPage,
            rowsPerPage,
            data,
            setData,
            header: table.header,
            fileId,
            name: name || '',
        });
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt((event.target as HTMLInputElement).value, 10));
        setPage(0);
    };

    useEffect(() => {
        const openDataset = async () => {
            if (name === null) {
                return;
            }

            const metadata = await apiService.getMetadata(fileId, name);
            if (metadata === undefined) {
                return;
            }

            const newMetadata = {
                name: metadata.name,
                label: metadata.label,
                records: metadata.records,
            };

            const itemData = await apiService.getObservations(
                fileId,
                name,
                1,
                PAGE_SIZE
            );

            if (itemData === undefined) {
                return;
            }

            const rawHeader = metadata.items.map((rawItem) => {
                const item = rawItem as unknown as Array<string | number>;
                const convertedItem: ItemDescription = {
                    OID: item[0] as string,
                    name: item[1] as string,
                    label: item[2] as string,
                    type: item[3] as ItemType,
                    length: item[4] as number,
                };
                return convertedItem;
            });
            const newData = itemData.map((item) => {
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
                            hidden: false,
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
                header: newHeader,
                metadata: newMetadata,
            });
            setData({
                observations: newData,
                startRow: 0,
                endRow: rowsPerPage * 10,
            });
        };
        openDataset();
    }, [name, dispatch, fileId, rowsPerPage]);

    const observationsToShow = data.observations.slice(
        (page - Math.floor(data.startRow / rowsPerPage)) * rowsPerPage,
        (page - Math.floor(data.startRow / rowsPerPage) + 1) * rowsPerPage
    );

    return (
        <Stack sx={styles.main}>
            <GeneralTable
                title={table.metadata.name}
                data={observationsToShow}
                header={table.header}
                search
            />
            <Paper sx={styles.pagination}>
                <TablePagination
                    rowsPerPageOptions={[50, 100, 250, 500]}
                    sx={{ mr: 2, borderRadius: 0 }}
                    component="div"
                    count={table.metadata.records}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={(event) => {
                        handleChangeRowsPerPage(
                            event as React.ChangeEvent<HTMLInputElement>
                        );
                    }}
                />
            </Paper>
        </Stack>
    );
};

export default ViewDataset;
