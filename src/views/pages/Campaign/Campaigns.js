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
    const [displayInfo, setDisplayInfo] = React.useState([]);
    const [editCells, setEditCells] = React.useState([]);
    const [excelList, setExcelList] = React.useState([]);
    const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));

    useEffect(() => {

        setHeadCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
            { id: 'publish', numeric: true, disablePadding: false, label: 'Published' },
            { id: 'campaign_status', numeric: true, disablePadding: false, label: 'Status' },
            { id: 'campaign_size', numeric: true, disablePadding: false, label: 'Size' },
            { id: 'campaign_duration', numeric: true, disablePadding: false, label: 'Duration' },
            { id: 'created', numeric: true, disablePadding: false, label: 'Created' },
        ])

        setHeadMobileCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
        ])
    
        setSearchCell([
            { id: 'id', label: 'Id' },
            { id: 'name', label: 'Name' },
        ])

        setDisplayInfo([
            { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
            { id: 'publish', numeric: true, disablePadding: false, label: 'Published' },
            { id: 'campaign_status', numeric: true, disablePadding: false, label: 'Status' },
            { id: 'campaign_size', numeric: true, disablePadding: false, label: 'Size' },
            { id: 'campaign_duration', numeric: true, disablePadding: false, label: 'Duration' },
            { id: 'created', numeric: true, disablePadding: false, label: 'Created' },
        ])

        setExcelList([
            { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
            { id: 'publish', numeric: true, disablePadding: false, label: 'Published' },
            { id: 'campaign_status', numeric: true, disablePadding: false, label: 'Status' },
            { id: 'campaign_size', numeric: true, disablePadding: false, label: 'Size' },
            { id: 'campaign_duration', numeric: true, disablePadding: false, label: 'Duration' },
            { id: 'created', numeric: true, disablePadding: false, label: 'Created' },
        ])

        setEditCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
        ])
    
        setSearchValue("name")
        
    }, []);

    return (
    <Grid>
        <Table 
            control={true}
            excelList={excelList}
            downloadExcel={true}
            rowsPerPage={5}
            orderBy="created" 
            data={props.ads ? "advertisement" : "campaign"}
            addItemButton={true}
            addItemText={props.ads ? "Add advertisement":"Add campaign"}
            addItemIcon={<AddCircleIcon/>}
            folder_data={props.ads ? "advertisement_folder" : "campaign_folder"}
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
  