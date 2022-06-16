import React, { useEffect } from 'react';
import Table from '../../../modules/components/Table'
import Dropzone from '../../../modules/components/Dropzone'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

export default function Index(props) {

    const [headCells, setHeadCells] = React.useState([]);
    const [headMobileCells, setHeadMobileCells] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState("");
    const [searchCell, setSearchCell] = React.useState([]);
    const [displayInfo, setDisplayInfo] = React.useState([]);
    const [editCells, setEditCells] = React.useState([]);
    const [excelList, setExcelList] = React.useState([]);
    const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));

    useEffect(() => {

        setHeadCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
            { id: 'size', numeric: true, disablePadding: false, label: 'Size' },
            { id: 'created', numeric: true, disablePadding: false, label: 'Created' },
            { id: 'type', numeric: true, disablePadding: false, label: 'Type' },
            { id: 'in_use', numeric: true, disablePadding: false, label: 'In Use' },
        ])

        setHeadMobileCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
            { id: 'size', numeric: true, disablePadding: false, label: 'Size' },
        ])
    
        setSearchCell([
            { id: 'id', label: 'Id' },
            { id: 'name', label: 'Name' },
        ])

        setDisplayInfo([
            { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
            { id: 'size', numeric: true, disablePadding: false, label: 'Size' },
            { id: 'created', numeric: true, disablePadding: false, label: 'Created' },
            { id: 'type', numeric: true, disablePadding: false, label: 'Type' },
            { id: 'in_use', numeric: true, disablePadding: false, label: 'In Use' },
        ])

        setExcelList([
            { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
            { id: 'folder', numeric: false, disablePadding: false, label: 'Folder' },
            { id: 'size', numeric: true, disablePadding: false, label: 'Size' },
            { id: 'created', numeric: true, disablePadding: false, label: 'Created' },
            { id: 'type', numeric: true, disablePadding: false, label: 'Type' },
            { id: 'in_use', numeric: true, disablePadding: false, label: 'In Use' },
        ])

        setEditCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
        ])
    
        setSearchValue("name")
        
    }, []);

    return (
    <Grid>
        <Dropzone data="content" folder={props.folder}/>
        <Table 
            control={true}
            excelList={excelList}
            downloadExcel={false}
            rowsPerPage={5}
            orderBy="created" 
            data="content" 
            folder_data="content_folder"
            folder={props.folder}
            displayInfo={displayInfo}
            matches={matches}
            editCells={editCells}
            headCells={matches ? headCells : headMobileCells} 
            searchValue={searchValue} 
            searchCell={searchCell}/>
    </Grid>
    )
    
}
  