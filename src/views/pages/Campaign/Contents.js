import React, { useEffect } from 'react';
import Table from '../../../modules/components/Table'
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import firebase from "firebase";

export default function Index(props) {

    const [headCells, setHeadCells] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState("");
    const [searchCell, setSearchCell] = React.useState([]);
    const [displayInfo, setDisplayInfo] = React.useState([]);
    const [editCells, setEditCells] = React.useState([]);
    const [folder, setFolder] = React.useState("default");
    const [folderList, setFolderList] = React.useState([]);

    const handleSelectChange = (event) => {
        setFolder(event.target.value);
    };

    const matches = false;

    useEffect(() => {

        setHeadCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
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

        setEditCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
        ])
    
        setSearchValue("name")

        let folderRef = firebase.database().ref("content_folder");
    
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
        <Grid style={{ width: "100%", padding: 20 }}>
            <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">Folder</InputLabel>
                <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={folder}
                onChange={handleSelectChange}
                label="Folder"
                >
                <MenuItem value={"default"}>
                    <em>Default</em>
                </MenuItem>
                {folderList.map((val, index)=>{
                    return(
                        <MenuItem key={"content"+index} value={val.id}>
                            <em>{val.name}</em>
                        </MenuItem>
                    )
                })}
                </Select>
            </FormControl>
        </Grid>
        
        <Table 
            selectContent={true}
            handleSetRows={(rows) => props.handleSetRows(rows) }
            control={true}
            rowsPerPage={5}
            orderBy="created" 
            data="content" 
            folder_data="content_folder"
            folder={folder === "default" ? null : folder}
            displayInfo={displayInfo}
            matches={matches}
            editCells={editCells}
            headCells={headCells} 
            searchValue={searchValue} 
            searchCell={searchCell}/>
    </Grid>
    )
    
}
  