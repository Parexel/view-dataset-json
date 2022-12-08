import { useState, useEffect } from 'react';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import {
    SortOrder,
    IGeneralTableHeaderCell,
    ISearchInTableProps,
    IGeneralTableDataCell,
    StyleObject,
} from 'interfaces/common';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import SearchInTable from 'renderer/components/SearchInTable';

const StyledTableCell = styled(TableCell)({
    padding: '4px',
    fontSize: '12px',
});

interface IGeneralTableHeaderProps {
    /** When sort icon is selected */
    onRequestSort: (
        event: React.MouseEvent<HTMLElement>,
        columnName: string
    ) => void;
    /** When select all is clicked */
    order: SortOrder;
    /** Default sort variable */
    orderBy?: string;
    /** Object with header information */
    header: Array<IGeneralTableHeaderCell>;
    /** Controls whether sorting is enabled */
    sorting?: boolean;
}

// Column sorting fuctions
const descendingComparator = (
    a: IGeneralTableDataCell,
    b: IGeneralTableDataCell,
    orderBy: string
): number => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
};

const getSorting = (order: string, orderBy: string) =>
    order === 'desc'
        ? (a: IGeneralTableDataCell, b: IGeneralTableDataCell) =>
              descendingComparator(a, b, orderBy)
        : (a: IGeneralTableDataCell, b: IGeneralTableDataCell) =>
              -descendingComparator(a, b, orderBy);

const GeneralTableHead: React.FC<IGeneralTableHeaderProps> = ({
    order,
    orderBy,
    onRequestSort,
    header,
    sorting = false,
}: IGeneralTableHeaderProps) => {
    const createSortHandler =
        (property: string) => (event: React.MouseEvent<HTMLElement>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                {header
                    .filter((column) => !column.hidden)
                    .map((column) => (
                        <StyledTableCell
                            key={column.id}
                            title={column.label}
                            align={column.align ? column.align : 'left'}
                            padding={column.disablePadding ? 'none' : 'normal'}
                            sortDirection={
                                orderBy === column.id ? order : false
                            }
                            style={column.style}
                        >
                            {sorting === true && !column.disableSort ? (
                                <TableSortLabel
                                    active={orderBy === column.id}
                                    direction={order}
                                    onClick={createSortHandler(column.id)}
                                >
                                    {column.id}
                                    {orderBy === column.id ? (
                                        <span style={visuallyHidden}>
                                            {order === 'desc'
                                                ? 'sorted descending'
                                                : 'sorted ascending'}
                                        </span>
                                    ) : null}
                                </TableSortLabel>
                            ) : (
                                column.id
                            )}
                        </StyledTableCell>
                    ))}
            </TableRow>
        </TableHead>
    );
};

GeneralTableHead.defaultProps = {
    sorting: false,
    orderBy: undefined,
};

interface IGeneralTableToolbarProps {
    /** Table title */
    title?: string;
    /** Table header */
    header: Array<IGeneralTableHeaderCell>;
    /** Enable/disabled Search in table */
    search?: boolean;
    /** Disable any filtering/search */
    disabled?: boolean;
    /** Options for the search component */
    SearchProps: ISearchInTableProps;
}

const toolbarStyles = {
    stack: {
        width: '100%',
    },
    root: {
        paddingLeft: 1,
        paddingRight: 1,
    },
    titleSearch: {
        flex: '1 1 auto',
        pt: 2,
    },
    highlight: {
        color: 'text.primary',
        backgroundColor: 'secondary.dark',
    },
    title: {
        width: '200px',
    },
    refreshIcon: {
        pd: 1,
    },
};

const GeneralTableToolbar: React.FC<IGeneralTableToolbarProps> = ({
    title,
    search,
    disabled,
    SearchProps,
    header,
}: IGeneralTableToolbarProps) => (
    <Toolbar sx={toolbarStyles.root}>
        <Stack
            justifyContent="space-between"
            direction="row"
            sx={toolbarStyles.stack}
        >
            <Stack
                justifyContent="flex-start"
                alignItems="center"
                direction="row"
                sx={toolbarStyles.titleSearch}
            >
                {title !== undefined && (
                    <Typography
                        sx={toolbarStyles.title}
                        variant="subtitle1"
                        id="tableTitle"
                        key="title"
                    >
                        {title}
                    </Typography>
                )}
                {search && (
                    <SearchInTable
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...SearchProps}
                        header={header}
                        disabled={disabled}
                        key="search"
                    />
                )}
            </Stack>
        </Stack>
    </Toolbar>
);

GeneralTableToolbar.defaultProps = {
    search: false,
    disabled: false,
    title: undefined,
};

interface IGeneralTableProps {
    /** Data array */
    data: Array<IGeneralTableDataCell>;
    /** Header description */
    header: Array<IGeneralTableHeaderCell>;
    /** Table title */
    title?: string;
    /** Controls whether sorting is enabled */
    sorting?: boolean;
    /** Controls whether search is enabled */
    search?: boolean;
    /** Search properties */
    SearchProps?: ISearchInTableProps;
    /** Controls whether pagination is used */
    pagination?: boolean;
    /** Rows per page options */
    rowsPerPageOptions?: Array<number>;
    /** Initial value of the rows per page */
    initialRowsPerPage?: number;
}

const tableStyles = {
    paper: {
        width: '100%',
        display: 'flex',
        overflow: 'hidden',
        flex: '1 1 auto',
    },
    minHeight: {
        minHeight: 1,
        flex: 1,
    },
    toolbarGridItem: {
        flex: '1 1 1%',
        minHeight: 70,
    },
    paginationGridItem: {
        flex: '1 1 1%',
        pr: 1,
        pl: 3,
    },
    tableGridItem: {
        display: 'flex',
        minHeight: '10%',
        flex: '1 1 99%',
    },
    tableWrapper: {
        overflow: 'auto',
        pl: 1,
    },
    sortHeader: {
        color: '#FFFFFF',
    },
};

const GeneralTable: React.FC<IGeneralTableProps> = ({
    data,
    header,
    sorting,
    title,
    search,
    SearchProps,
    pagination,
    initialRowsPerPage,
    rowsPerPageOptions,
}: IGeneralTableProps) => {
    // Search box state
    const [searchString, setSearchString] = useState('');

    // Column sorting
    let keyVar: string;
    let defaultOrder: SortOrder = 'asc';
    let defaultOrderBy: string | undefined;

    header.forEach((column) => {
        if (column.key === true) {
            keyVar = column.id;
        }
        if (column.defaultOrder !== undefined) {
            defaultOrder = column.defaultOrder;
            defaultOrderBy = column.id;
        }
    });

    const [order, setOrder] = useState<SortOrder>(defaultOrder);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);

    const handleRequestSort = (
        _event: React.MouseEvent<HTMLElement>,
        columnName: string
    ) => {
        const isDesc = orderBy === columnName && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(columnName);
    };

    // Data processing
    let filteredData: Array<IGeneralTableDataCell>; // Need to distinguish filtered and paginated data for handleSelectAllClick
    let tableData: Array<IGeneralTableDataCell>;

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(
        initialRowsPerPage as number
    );

    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: React.SetStateAction<number>
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt((event.target as HTMLInputElement).value, 10));
        setPage(0);
    };

    useEffect(() => {
        // Reset the page to 0 when the data is updated;
        if (pagination) {
            setPage(0);
        }
    }, [data, pagination]);

    // Apply Search
    if (search) {
        // TODO implement search
        if (searchString) {
            //
        }
        filteredData = data;
    } else {
        filteredData = data;
    }

    // Apply order
    if (orderBy) {
        tableData = filteredData.slice();
        tableData.sort(getSorting(order, orderBy));
    } else {
        tableData = filteredData;
    }

    // Apply pagination
    if (pagination) {
        tableData = tableData.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );
    }

    return (
        <Paper sx={tableStyles.paper}>
            <Grid
                container
                justifyContent="flex-start"
                direction="column"
                wrap="nowrap"
                sx={tableStyles.minHeight}
            >
                <Grid item sx={tableStyles.toolbarGridItem}>
                    <GeneralTableToolbar
                        search={search}
                        title={title}
                        disabled={data.length === 0}
                        header={header}
                        SearchProps={
                            {
                                onSearchUpdate: (text) => setSearchString(text),
                                ...SearchProps,
                            } as ISearchInTableProps
                        }
                    />
                </Grid>
                <Grid item sx={tableStyles.tableGridItem}>
                    <TableContainer sx={tableStyles.tableWrapper}>
                        <Table
                            aria-labelledby="tableTitle"
                            size="medium"
                            stickyHeader
                        >
                            <GeneralTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                header={header}
                                sorting={sorting}
                            />
                            <TableBody>
                                {tableData.map((row) => {
                                    return (
                                        <TableRow
                                            tabIndex={-1}
                                            role="checkbox"
                                            key={row[keyVar] as number | string}
                                            sx={
                                                row.rowStyleObject as StyleObject
                                            }
                                        >
                                            {header
                                                .filter(
                                                    (headerCell) =>
                                                        !headerCell.hidden
                                                )
                                                .map((column) => (
                                                    <StyledTableCell
                                                        key={column.id}
                                                        align={
                                                            column.align
                                                                ? column.align
                                                                : 'left'
                                                        }
                                                        style={column.style}
                                                    >
                                                        {column.formatter
                                                            ? column.formatter({
                                                                  id: column.id,
                                                                  row,
                                                              })
                                                            : (row[
                                                                  column.id
                                                              ] as string)}
                                                    </StyledTableCell>
                                                ))}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                {pagination && (
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        sx={tableStyles.paginationGridItem}
                    >
                        <Grid item sx={tableStyles.paginationGridItem}>
                            <TablePagination
                                rowsPerPageOptions={rowsPerPageOptions}
                                component="div"
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={(event) => {
                                    handleChangeRowsPerPage(
                                        event as React.ChangeEvent<HTMLInputElement>
                                    );
                                }}
                            />
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};

GeneralTable.defaultProps = {
    title: undefined,
    sorting: false,
    search: false,
    SearchProps: { header: [] },
    pagination: false,
    rowsPerPageOptions: [25, 50, 100],
    initialRowsPerPage: 100,
};

export default GeneralTable;
