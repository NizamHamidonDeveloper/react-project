import React, { useEffect } from 'react';
import Table from '../../../modules/components/Table'
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import firebase from "firebase";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default function Index(props) {

    const [headCells, setHeadCells] = React.useState([]);
    const [headMobileCells, setHeadMobileCells] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState("");
    const [searchCell, setSearchCell] = React.useState([]);
    const [displayInfo, setDisplayInfo] = React.useState([]);
    const [editCells, setEditCells] = React.useState([]);
    const [addCells, setAddCells] = React.useState([]);
    const [addCellsName, setAddCellsName] = React.useState([]);
    const matches = true;
    const [folder, setFolder] = React.useState("default");
    const [folderList, setFolderList] = React.useState([]);

    const handleSelectChange = (event) => {
        setFolder(event.target.value);
    };

    useEffect(() => {

        setHeadCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
            { id: 'folder', numeric: true, disablePadding: false, label: 'Group' },
        ])

        setHeadMobileCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
        ])
    
        setSearchCell([
            { id: 'folder', label: 'Group' },
            { id: 'name', label: 'Name' },
        ])

        setDisplayInfo([
            { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
            { id: 'campaign', numeric: true, disablePadding: false, label: 'Campaign' },
            { id: 'created', numeric: true, disablePadding: false, label: 'Created' },
            { id: 'refreshed', numeric: true, disablePadding: false, label: 'Refreshed' },
        ])

        setEditCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
        ])

        setAddCells([
            { id: 'name', label: 'Name' },
        ])

        setAddCellsName({ name: '', refreshed: firebase.database.ServerValue.TIMESTAMP })
    
        setSearchValue("folder")

        let folderRef = firebase.database().ref("station_zone");
    
        folderRef.once('value', snapshot => {
            if(snapshot.exists()){
                let items = [];
                snapshot.forEach(child => {
                    var itemsVal = child.val();
                    items.push(itemsVal);
                })

                setFolderList(items)
            }
        })
        
    }, []);

    
    return (
    <Grid>
        <Grid style={{ display: "none", width: "100%", padding: 20 }}>
            <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">Zone</InputLabel>
                <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={folder}
                onChange={handleSelectChange}
                label="Zone"
                >
                <MenuItem value={"default"}>
                    <em>Default</em>
                </MenuItem>
                {folderList.map((val, index)=>{
                    return(
                        <MenuItem key={"folderlist"+index} value={val.id}>
                            <em>{val.name}</em>
                        </MenuItem>
                    )
                })}
                </Select>
            </FormControl>
        </Grid>
        <Table 
            handleSetStation={(rows) => props.handleSetStation(rows) }
            selectedStations={props.selectedStations}
            allCampaign={props.allCampaign}
            selectedItem={props.selectedItem}
            listOnly={props.listOnly}
            ads={props.ads}
            control={false}
            rowsPerPage={15}
            orderBy="created" 
            data="station" 
            addItemButton={false}
            addItemText="Add station"
            addItemIcon={<AddCircleIcon/>}
            addCells={addCells}
            addCellsName={addCellsName}
            folder_data="station_zone"
            folder={folder === "default" ? null : folder}
            displayInfo={displayInfo}
            downloadExcel={false}
            matches={matches}
            selectStation={true}
            editCells={editCells}
            headCells={matches ? headCells : headMobileCells} 
            searchValue={searchValue} 
            searchCell={searchCell}/>
    </Grid>
    )

}
  