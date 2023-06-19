import { useState, useEffect }, React from 'react';
import { TableVirtuoso } from 'react-virtuoso';
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
import React from 'react';

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

    return (
        <Paper sx={tableStyles.paper}>
            <TableVirtuoso
                style={{ height: 400 }}
                data={data}
                components={{
                    Scroller: React.forwardRef((props, ref) => (
                        <TableContainer
                            component={Paper}
                            {...props}
                            ref={ref}
                        />
                    )),
                    Table: (props) => (
                        <Table
                            {...props}
                            style={{ borderCollapse: 'separate' }}
                        />
                    ),
                    TableHead: TableHead,
                    TableRow: TableRow,
                    TableBody: React.forwardRef((props, ref) => (
                        <TableBody {...props} ref={ref} />
                    )),
                }}
                fixedHeaderContent={() => (
                    <TableRow>
                        <TableCell style={{ width: 150, background: 'white' }}>
                            Name
                        </TableCell>
                        <TableCell style={{ background: 'white' }}>
                            Description
                        </TableCell>
                    </TableRow>
                )}
                itemContent={(index, item) => (
                    <>
                        <TableCell style={{ width: 150, background: 'white' }}>
                            {item[0]}
                        </TableCell>
                        <TableCell style={{ background: 'white' }}>
                            {item[1]}
                        </TableCell>
                    </>
                )}
            />
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
