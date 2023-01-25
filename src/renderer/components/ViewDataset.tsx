import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
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
        mb: 2,
        justifyContent: 'flex-start',
    },
};

const apiService = new ApiService('remote');

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

    const [data, setData] = useState<{
        observations: IGeneralTableDataCell[];
        startRow: number;
        endRow: number;
    }>({ observations: [], startRow: 0, endRow: 0 });

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: React.SetStateAction<number>
    ) => {
        const readMoreData = async (startRow: number) => {
            const itemData = await apiService.getObservations(
                fileId,
                name as string,
                1,
                rowsPerPage * 10
            );

            if (itemData === undefined) {
                return;
            }

            const newData = itemData.map((item) => {
                const row: IGeneralTableDataCell = {};
                item.forEach((value, index) => {
                    row[table.header[index].id] = value as number | string;
                });
                return row;
            });

            setData({
                observations: newData,
                startRow,
                endRow: startRow + rowsPerPage * 10,
            });
        };

        const currentPage = newPage as number;
        console.log(currentPage, rowsPerPage, data.startRow, data.endRow);
        if (
            data.startRow > rowsPerPage * (currentPage - 3) ||
            data.endRow < rowsPerPage * (currentPage + 3)
        ) {
            readMoreData(Math.max(0, rowsPerPage * (currentPage - 3)));
        }
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
                rowsPerPage * 10
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

    return (
        <Stack sx={styles.main}>
            <Box sx={styles.table}>
                <GeneralTable
                    title={table.metadata.name}
                    data={data.observations}
                    header={table.header}
                    search
                />
            </Box>
            <Paper sx={styles.pagination}>
                <TablePagination
                    rowsPerPageOptions={[10, 250, 500]}
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
