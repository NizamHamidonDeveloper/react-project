import React, { useEffect } from 'react';
import Table from '../../../modules/components/Table'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import firebase from "firebase";

export default function Index(props) {

    const [headCells, setHeadCells] = React.useState([]);
    const [headMobileCells, setHeadMobileCells] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState("");
    const [searchCell, setSearchCell] = React.useState([]);
    const [displayInfo, setDisplayInfo] = React.useState([]);
    const [excelList, setExcelList] = React.useState([]);
    const [editCells, setEditCells] = React.useState([]);
    const [addCells, setAddCells] = React.useState([]);
    const [addCellsName, setAddCellsName] = React.useState([]);
    const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));

    useEffect(() => {

        setHeadCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Station ID' },
            { id: 'block', numeric: false, disablePadding: false, label: 'Block' },
            { id: 'address', numeric: false, disablePadding: false, label: 'Address' },
            { id: 'campaign', numeric: true, disablePadding: false, label: 'Campaign' },
            { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
            { id: 'is_playing', numeric: true, disablePadding: false, label: 'Play' },
            { id: 'app_version', numeric: true, disablePadding: false, label: 'App Ver' },
            { id: 'refreshed', numeric: true, disablePadding: false, label: 'Refreshed' },
        ])

        setHeadMobileCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Station ID' },
        ])
    
        setSearchCell([
            { id: 'id', label: 'Station Code' },
            { id: 'name', label: 'Station ID' },
            { id: 'status', label: 'Status' },
            { id: 'app_version', label: 'App Version' },
            { id: 'address', numeric: false, disablePadding: false, label: 'Address' },
            { id: 'block', numeric: false, disablePadding: false, label: 'Block' },
        ])

        setDisplayInfo([
            { id: 'id', numeric: false, disablePadding: false, label: 'Station Code' },
            { id: 'name', numeric: false, disablePadding: false, label: 'Station ID' },
            { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
            { id: 'is_playing', numeric: true, disablePadding: false, label: 'Play' },
            { id: 'app_version', numeric: true, disablePadding: false, label: 'App Version' },
            { id: 'zone', numeric: true, disablePadding: false, label: 'Zone' },
            { id: 'subzone', numeric: true, disablePadding: false, label: 'Sub-Zone' },
            { id: 'folder', numeric: true, disablePadding: false, label: 'Group' },
            { id: 'block', numeric: false, disablePadding: false, label: 'Block' },
            { id: 'lobby', numeric: false, disablePadding: false, label: 'Lobby' },
            { id: 'address', numeric: false, disablePadding: false, label: 'Address' },
            { id: 'postcode', numeric: false, disablePadding: false, label: 'Postcode' },
            { id: 'installed_date', numeric: false, disablePadding: false, label: 'Installed Date' },
            { id: 'campaign', numeric: true, disablePadding: false, label: 'Campaign' },
            { id: 'advertisement', numeric: true, disablePadding: false, label: 'Advertisement' },
            { id: 'created', numeric: true, disablePadding: false, label: 'Created' },
            { id: 'refreshed', numeric: true, disablePadding: false, label: 'Refreshed' },
            { id: 'sim_number', numeric: true, disablePadding: false, label: 'SIM Serial Number' },
            { id: 'screen_size', numeric: true, disablePadding: false, label: 'Screen Size' },
            { id: 'note', numeric: false, disablePadding: false, label: 'Note' },
           
        ])

        setExcelList([
            { id: 'id', numeric: false, disablePadding: false, label: 'Station Code' },
            { id: 'name', numeric: false, disablePadding: false, label: 'Station ID' },
            { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
            { id: 'app_version', numeric: true, disablePadding: false, label: 'App Version' },
            { id: 'zone', numeric: true, disablePadding: false, label: 'Zone' },
            { id: 'subzone', numeric: true, disablePadding: false, label: 'Sub-Zone' },
            { id: 'folder', numeric: true, disablePadding: false, label: 'Group' },
            { id: 'block', numeric: false, disablePadding: false, label: 'Block' },
            { id: 'lobby', numeric: false, disablePadding: false, label: 'Lobby' },
            { id: 'address', numeric: false, disablePadding: false, label: 'Address' },
            { id: 'postcode', numeric: false, disablePadding: false, label: 'Postcode' },
            { id: 'installed_date', numeric: false, disablePadding: false, label: 'Installed Date' },
            { id: 'campaign', numeric: true, disablePadding: false, label: 'Campaign' },
            { id: 'advertisement', numeric: true, disablePadding: false, label: 'Advertisement' },
            { id: 'created', numeric: true, disablePadding: false, label: 'Created' },
            { id: 'refreshed', numeric: true, disablePadding: false, label: 'Refreshed' },
            { id: 'sim_number', numeric: true, disablePadding: false, label: 'SIM Serial Number' },
            { id: 'screen_size', numeric: true, disablePadding: false, label: 'Screen Size' },
            { id: 'note', numeric: false, disablePadding: false, label: 'Note' },
           
        ])

        setEditCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Station ID' },
            { id: 'zone', numeric: true, disablePadding: false, label: 'Zone' },
            { id: 'subzone', numeric: true, disablePadding: false, label: 'Sub-Zone' },
            { id: 'block', numeric: false, disablePadding: false, label: 'Block' },
            { id: 'lobby', numeric: false, disablePadding: false, label: 'Lobby' },
            { id: 'address', numeric: false, disablePadding: false, label: 'Address' },
            { id: 'postcode', numeric: false, disablePadding: false, label: 'Postcode' },
            { id: 'installed_date', numeric: false, disablePadding: false, label: 'Installed Date' },
            { id: 'sim_number', numeric: true, disablePadding: false, label: 'SIM Serial Number' },
            { id: 'screen_size', numeric: true, disablePadding: false, label: 'Screen Size' },
            { id: 'note', numeric: false, disablePadding: false, label: 'Note' },
        ])

        setAddCells([
            { id: 'name', label: 'Station ID' },
            { id: 'zone', label: 'Zone' },
            { id: 'subzone', label: 'Sub-Zone' },
            { id: 'block', label: 'Block' },
            { id: 'lobby', label: 'Lobby' },
            { id: 'address', label: 'Address' },
            { id: 'postcode', label: 'Postcode' },
            { id: 'installed_date', label: 'Installed Date' },
            { id: 'sim_number', label: 'SIM Serial Number' },
            { id: 'screen_size', label: 'Screen Size' },
            { id: 'note', label: 'Note' },
        ])

        setAddCellsName({ name: '', 
        refreshed: firebase.database.ServerValue.TIMESTAMP, 
        push: false,
        status: false,
        is_playing: false,
        zone:'',
        subzone:'',
        block: '', 
        lobby: '',
        address: '', 
        postcode: '',
        installed_date: '',
        sim_number: '',
        screen_size:'',
        note: '',
        brightness: '0F',
        message: 'push',
        volume: '0',
        app_download_path: '',
         })
    
        setSearchValue("name")
        
    }, []);

    return (
    <Grid>
        <Table 
            disabledEdit={false}
            disabledDelete={false}
            control={true}
            rowsPerPage={5}
            orderBy="created" 
            data="station" 
            addItemButton={true}
            addItemText="Add station"
            addItemIcon={<AddCircleIcon/>}
            addCells={addCells}
            addCellsName={addCellsName}
            excelList={excelList}
            folder_data="station_zone"
            folder={props.folder}
            displayInfo={displayInfo}
            matches={matches}
            editCells={editCells}
            downloadExcel={true}
            headCells={matches ? headCells : headMobileCells} 
            searchValue={searchValue} 
            searchCell={searchCell}/>
    </Grid>
    )

}
  