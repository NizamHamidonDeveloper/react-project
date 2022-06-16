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
    const [editCells, setEditCells] = React.useState([]);
    const [addCells, setAddCells] = React.useState([]);
    const [addCellsName, setAddCellsName] = React.useState([]);
    const [excelList, setExcelList] = React.useState([]);
    const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));

    useEffect(() => {

        setHeadCells([
            { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
            { id: 'role', numeric: true, disablePadding: false, label: 'Role' },
            { id: 'created', numeric: true, disablePadding: false, label: 'Created' },
            { id: 'signed_in', numeric: true, disablePadding: false, label: 'Signed In' },
            { id: 'signed_out', numeric: true, disablePadding: false, label: 'Signed out' },
            { id: 'id', numeric: false, disablePadding: false, label: 'UID' },
        ])

        setHeadMobileCells([
            { id: 'name', numeric: false, disablePadding: false, label: 'UID' },
        ])
    
        setSearchCell([
            { id: 'email', label: 'Email' },
            { id: 'id', label: 'UID' },
        ])

        setDisplayInfo([
            { id: 'id', numeric: false, disablePadding: false, label: 'UID' },
            { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
            { id: 'role', numeric: true, disablePadding: false, label: 'Role' },
            { id: 'created', numeric: true, disablePadding: false, label: 'Created' },
            { id: 'signed_in', numeric: true, disablePadding: false, label: 'Signed In' },
            { id: 'signed_out', numeric: true, disablePadding: false, label: 'Signed out' },
        ])

        setEditCells([
            { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
        ])

        setAddCells([
            { id: 'email', label: 'Email' },
            { id: 'password', label: 'Password' },
        ])

        setExcelList([
            { id: 'email', numeric: false, disablePadding: false, label: 'Email Address' },
            { id: 'created', numeric: false, disablePadding: false, label: 'Created' },
            { id: 'role', numeric: true, disablePadding: false, label: 'Role' },
            { id: 'signed_in', numeric: true, disablePadding: false, label: 'Signed In' },
            { id: 'signed_out', numeric: true, disablePadding: false, label: 'Signed out' },
        ])

        setAddCellsName({ email: '', 
        created: firebase.database.ServerValue.TIMESTAMP, 
        password: '',
        role: "Editor"
         })
    
        setSearchValue("email")
        
    }, []);

    return (
    <Grid>
        <Table 
            downloadExcel={true}
            excelList={excelList}
            disabledEdit={false}
            disabledDelete={true}
            disabledMove={true}
            control={true}
            rowsPerPage={5}
            orderBy="created" 
            data="user" 
            addItemButton={false}
            addItemText="Add user"
            addItemIcon={<AddCircleIcon/>}
            addCells={addCells}
            addCellsName={addCellsName}
            displayInfo={displayInfo}
            matches={matches}
            editCells={editCells}
            headCells={matches ? headCells : headMobileCells} 
            searchValue={searchValue} 
            searchCell={searchCell}/>
    </Grid>
    )

}
  