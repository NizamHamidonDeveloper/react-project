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
    const [addCells, setAddCells] = React.useState([]);
    const [addCellsName, setAddCellsName] = React.useState([]);
    const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));

    useEffect(() => {

        setHeadCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
            { id: 'created', numeric: true, disablePadding: false, label: 'Created' },
            { id: 'total', numeric: true, disablePadding: false, label: 'Contains' },
        ])

        setHeadMobileCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
            { id: 'created', numeric: true, disablePadding: false, label: 'Created' },
        ])
    
        setSearchCell([
            { id: 'id', label: 'Id' },
            { id: 'name', label: 'Name' },
        ])

        setDisplayInfo([
            { id: 'id', label: 'Id' },
            { id: 'name', label: 'Name' },
            { id: 'created',  label: 'Created' },
        ])

        setEditCells([
            { id: 'name', label: 'Name' },
        ])

        setAddCells([
            { id: 'name', label: 'Name' },
        ])

        setAddCellsName({ name: ''})

        setSearchValue("name")
        
    }, []);

    return (
    <Grid>
        <Table 
            control={true}
            rowsPerPage={5}
            orderBy="created" 
            child={props.ads ? "advertisement":"campaign"}
            data={props.ads ? "advertisement_folder" : "campaign_folder" }
            addItemButton={true}
            addItemText="Add Folder"
            type="folder"
            addItemIcon={<AddCircleIcon/>}
            addCellsName={addCellsName}
            displayInfo={displayInfo}
            matches={matches}
            editCells={editCells}
            addCells={addCells}
            headCells={matches ? headCells : headMobileCells} 
            searchValue={searchValue} 
            searchCell={searchCell}/>
    </Grid>
    )
    
}
  