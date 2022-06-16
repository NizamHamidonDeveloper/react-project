import React, { useEffect } from 'react';
import Table from '../../../modules/components/Table'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default function Index(props) {

    const [headCells, setHeadCells] = React.useState([]);
    const [headMobileCells, setHeadMobileCells] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState("");
    const [searchCell, setSearchCell] = React.useState([]);
    const [excelList, setExcelList] = React.useState([]);
    const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));

    useEffect(() => {

        setHeadCells([
            { id: 'file_name', numeric: false, disablePadding: false, label: 'File Name' },
            { id: 'updated', numeric: true, disablePadding: false, label: 'Updated' },
            { id: 'action', numeric: true, disablePadding: false, label: 'Actions' },
            { id: 'user', numeric: true, disablePadding: false, label: 'User' },
        ])

        setHeadMobileCells([
            { id: 'file_name', numeric: false, disablePadding: false, label: 'File Name' },
            { id: 'updated', numeric: true, disablePadding: false, label: 'Updated' },
        ])
    
        setSearchCell([
            { id: 'file_name', numeric: false, disablePadding: false, label: 'File Name' },
            { id: 'updated', numeric: true, disablePadding: false, label: 'Updated' },
            { id: 'user', numeric: true, disablePadding: false, label: 'User' },
        ])

        setExcelList([
            { id: 'file_name', numeric: false, disablePadding: false, label: 'Content File Name' },
            { id: 'content_campaign', numeric: false, disablePadding: false, label: 'Campaign Name' },
            { id: 'content_start_date', numeric: false, disablePadding: false, label: 'Start Date' },
            { id: 'content_end_date', numeric: false, disablePadding: false, label: 'End Date' },
            { id: 'content_start_time', numeric: false, disablePadding: false, label: 'Start Time' },
            { id: 'content_end_time', numeric: false, disablePadding: false, label: 'End Time' },
            { id: 'action', numeric: true, disablePadding: false, label: 'User Actions' },
            { id: 'stations', numeric: false, disablePadding: false, label: 'List of Station' },
            { id: 'updated', numeric: true, disablePadding: false, label: 'Updated Date & Time' },
            { id: 'user', numeric: true, disablePadding: false, label: 'User Email Address' },
        ])

        setSearchValue("file_name")
        
    }, []);

    return (
    <Grid>
        <Table 
            excelList={excelList}
            downloadExcel={true}
            control={false}
            rowsPerPage={5}
            orderBy="updated" 
            data="log_content" 
            matches={matches}
            headCells={matches ? headCells : headMobileCells} 
            searchValue={searchValue} 
            searchCell={searchCell}/>
    </Grid>
    )
    
}
  