import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from './Dialog'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';
import TablePaginationActions from './TablePaginationActions';
import ControlButton from './ControlButton';
import Button from '@material-ui/core/Button';
import firebase from "firebase";
import { Tooltip } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import ContentPreview from './ContentPreview'
import ReactExport from 'react-data-export';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

// Table Sort
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

//Table
const useStyles2 = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: "100%",
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
}));

export default function CustomPaginationActionsTable(props) {

  const classes = useStyles2();
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [addItem, setAddItem] = React.useState(null);
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState(props.orderBy);
  const [rowsChild, setRowsChild] = React.useState([]);
  const [rowsOriginal, setRowsOriginal] = React.useState([]);
  const [headCells, setHeadCells] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchtxt, setSearchtxt] = React.useState("");
  const [searchCell, setSearchCell] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogLoading, setDialogLoading] = React.useState(false);
  const [fullScreenDialog, setFullScreenDialog] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState("");
  const [dialogDes, setDialogDes] = React.useState("");
  const [agreeButton, setAgreeButton] = React.useState(false);
  const [collapse, setCollapse] = React.useState(null);
  const [option, setOptions] = React.useState("");
  const [folderData, setFolderData] = React.useState(null);
  const [allCampaign, setAllCampaign] = React.useState([]);
  const [allAds, setAllAds] = React.useState([]);
  const [allFolder, setAllFolder] = React.useState([]);
  const [allStationZone, setAllStationZone] = React.useState([]);
  const [allStation, setAllStation] = React.useState([]);
  const [multiDataSet, setMultiDataSet] = React.useState([]);
  const excelInput = React.useRef(null);
 
  useEffect(() => {

    let itemRef = firebase.database().ref(props.data);
    
    itemRef.on('value', snapshot => {
         
      if(snapshot.exists()){

        let items = [];

        if(props.folder){
          snapshot.forEach(child => {
            
            var itemsVal = child.val();
            if(itemsVal.folder && 
              itemsVal.folder === props.folder){
              items.push(itemsVal);
            }
            
          })
        }
        else{
          snapshot.forEach(child => {
            var itemsVal = child.val();

            if(!itemsVal.folder && props.data !== "station"){
              items.push(itemsVal);
            }
            else if(props.data === "station"){

              itemsVal.app_version = itemsVal.app_version ? itemsVal.app_version : "";
              items.push(itemsVal);
            }
          })
        }

        if(props.listOnly){
          
          if(props.ads){

            
            let selectedItems = []

            snapshot.forEach(child => {
              var itemsVal = child.val();
              if(itemsVal.advertisement === props.selectedItem.id){
                selectedItems.push(itemsVal);
              }
            })

            if(props.listOnly){
              items = selectedItems
            }
            else
            {
              setSelected(selectedItems)
            }
          }
          else
          {

            let selectedItems = []

            snapshot.forEach(child => {
              var itemsVal = child.val();
              if(itemsVal.campaign === props.selectedItem.id){
                selectedItems.push(itemsVal);
              }
            })

            if(props.listOnly){
              items = selectedItems
            }
            else
            {
              setSelected(selectedItems)
            }
          }
          
          
        }

        if(props.data === "campaign"){
          let stationRef = firebase.database().ref("station");

          stationRef.once('value', snapshot => {
              if(snapshot.exists()){
                var itemsStation = []
                snapshot.forEach(child => {
            
                  var itemsVal = child.val();
                  itemsStation.push(itemsVal);
                  
                })
                setAllStation(itemsStation)
              }
          })
        }

        if(props.data === "log_content"){
          console.log("log_content")
          let folderRef = firebase.database().ref("station_zone");

          folderRef.once('value', snapshot => {
            if(snapshot.exists()){
              var allfolders = []
              snapshot.forEach(child => {
          
                var itemsVal = child.val();
                allfolders.push(itemsVal);
                
                
              })
              setAllStationZone(allfolders)
            }
          })
        }

        if(props.data === "station" || props.data === "content" || props.data === "advertisement"){
          let campaignRef = firebase.database().ref("campaign");

          campaignRef.once('value', snapshot => {
              if(snapshot.exists()){
                var itemsCampaign = []
                snapshot.forEach(child => {
            
                  var itemsVal = child.val();
                  itemsCampaign.push(itemsVal);
                  
                  
                })
                setAllCampaign(itemsCampaign)
              }
          })

          let adsRef = firebase.database().ref("advertisement");

          adsRef.once('value', snapshot => {
              if(snapshot.exists()){
                var itemsCampaign = []
                snapshot.forEach(child => {
            
                  var itemsVal = child.val();
                  itemsCampaign.push(itemsVal);
                  
                  
                })
                setAllAds(itemsCampaign)
              }
          })
        }

        let folderRef = firebase.database().ref(props.folder_data);

        folderRef.once('value', snapshot => {
          if(snapshot.exists()){
            var allfolders = []
            snapshot.forEach(child => {
        
              var itemsVal = child.val();
              allfolders.push(itemsVal);
              
              
            })
            setAllFolder(allfolders)
          }
        })

        if(props.child){
          let childRef = firebase.database().ref(props.child);

          childRef.once('value', snapshot => {
         
            if(snapshot.exists()){
              let itemsChild = [];
              
              snapshot.forEach(child => {
                var itemsVal = child.val();
                itemsChild.push(itemsVal);
              })

              setRowsChild(itemsChild)
              setRowsOriginal(items)
              setLoading(false)
              
            }
            else{
              setRowsChild([])
              setRowsOriginal(items)
              setLoading(false)
            }

          })

        }
        else
        {
          setRowsOriginal(items)
          setLoading(false)
          
        }

      }
      else
      {
        setRowsChild([])
        setRowsOriginal([])
        setLoading(false)
      }
        
    })

    setHeadCells(props.headCells ? props.headCells : [])
    setSearchCell(props.searchCell ? props.searchCell : [])
    setSearchValue(props.searchValue ? props.searchValue : "")
    setAddItem(props.addCellsName ? props.addCellsName : [])
    

    return () => {
      itemRef.off()
    };
    
  }, [props]);

  const handleSnackClose = (event) => {
    setSnackOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {

    if (event.target.checked) {
      const newSelecteds = readRows().map((n) => n);
      setSelected(newSelecteds);

      if(props.handleSelectedSation){
        props.handleSelectedSation(newSelecteds)
      }
      
      return;
    }else
    {
      if(props.handleSelectedSation){
        props.handleSelectedSation([])
      }
    }
    setSelected([]);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleCheckBoxClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    
    if(props.handleSelectedSation){
      props.handleSelectedSation(newSelected)
    }
    
    setSelected(newSelected);
  };

  //Search
  const onChangeSearchSelect = event => {
    setSearchtxt("")
    setSearchValue(event.target.value)
  }

  const search = event => {

    setSearchtxt(event.target.value)
    setPage(0)
  }

  //Dialog
  const onClickDeleteAll = () => {
    setDialogLoading(false)
    setAgreeButton(true)
    setDialogTitle("Delete all selected items")
    setOptions("deleteAll")
    setDialogDes("Are you sure you want to delete these items?")
    setFullScreenDialog(false)
    setOpenDialog(true)
  }

  const onClickMoveAll = () => {
    setDialogLoading(true)
    let itemRef = firebase.database().ref(props.folder_data);
    
    itemRef.once('value', snapshot => {
        
      if(snapshot.exists()){
        let items = [];
        snapshot.forEach(child => {
            
          var itemsVal = child.val();
          items.push(itemsVal);
          
        })
        
        setFolderData(items)
        setDialogLoading(false)
      }

    })

    setAgreeButton(false)
    setDialogTitle("Move all selected items")
    setOptions("moveAll")
    setDialogDes("Are you sure you want to move these items?")
    setFullScreenDialog(false)
    setOpenDialog(true)
  }

  const onClickDelete = (row) => {
    setDialogLoading(false)
    setSelectedItem(row)
    setAgreeButton(true)
    setDialogTitle("Delete")
    setOptions("delete")
    setDialogDes("Are you sure you want to delete this item?")
    setFullScreenDialog(false)
    setOpenDialog(true)
  }

  const onClickEdit = (row) => {

    setDialogLoading(false)
    setSelectedItem(row)
    props.data === "campaign" || props.data === "advertisement" ?  setAgreeButton(false) : setAgreeButton(true)
    setDialogTitle("Edit")
    setOptions("edit")
    setDialogDes("")
    props.data === "campaign" || props.data === "advertisement" ? setFullScreenDialog(true) : setFullScreenDialog(false)
    setOpenDialog(true)
  }

  const onClickInfo = (row) => {
    setDialogLoading(false)
    setSelectedItem(row)
    setAgreeButton(false)
    setDialogTitle("Info")
    setOptions("info")
    setDialogDes("")
    setFullScreenDialog(false)
    setOpenDialog(true)
  }

  const onClickPreview = (row) => {
    setDialogLoading(false)
    setSelectedItem(row)
    setAgreeButton(false)
    setDialogTitle("Preview")
    setOptions("preview")
    setDialogDes("")
    setFullScreenDialog(false)
    setOpenDialog(true)
  }

  const onClickMove = (row) => {

    setDialogLoading(true)
    let itemRef = firebase.database().ref(props.folder_data);
    
    itemRef.once('value', snapshot => {
        
      if(snapshot.exists()){
        let items = [];
        snapshot.forEach(child => {
            
          var itemsVal = child.val();
          items.push(itemsVal);
          
        })
        
        setFolderData(items)
        setDialogLoading(false)
      }

    })

    setAgreeButton(false)
    setSelectedItem(row)
    setDialogTitle("Move")
    setOptions("move")
    setDialogDes("Are you sure you want to move this item?")
    setFullScreenDialog(false)
    setOpenDialog(true)
  }

  const onClickPreviewCampaign = (row) => {

    if(props.data === "station"){
      
      if(row.campaign){
        /*var combinedContent = []
        var selectedCampaign = allCampaign.filter(val => row.campaign.map(val => val.id).includes(val.id))
        selectedCampaign.forEach(val => {
          if(val.content){
            val.content.forEach(childVal => {
              combinedContent.push(childVal)
            })
          }
        })

        var newRow = { content: combinedContent}*/
        var selectedCampaign = allCampaign.map(val => val.id).indexOf(row.campaign)

        if(selectedCampaign !== -1){
          var newRow = { content: allCampaign[selectedCampaign].content } 
          setDialogLoading(false)
          setSelectedItem(newRow)
          setAgreeButton(false)
          setDialogTitle("Preview")
          setOptions("playPreview")
          setDialogDes("")
          setFullScreenDialog(false)
          setOpenDialog(true)
        }
        
        
      }
    }
    else
    {
      setDialogLoading(false)
      setSelectedItem(row)
      setAgreeButton(false)
      setDialogTitle("Preview")
      setOptions("playPreview")
      setDialogDes("")
      setFullScreenDialog(false)
      setOpenDialog(true)
    }
    
  }

  const onClickPublish = (row) => {
    setDialogLoading(false)
    setSelectedItem(row)
    setAgreeButton(true)
    setDialogTitle("Publish")
    setOptions("publish")
    setDialogDes("Are you sure you want to publish this campaign?")
    setFullScreenDialog(false)
    setOpenDialog(true)
  }

  const onClickAddItem = () => {
    setDialogLoading(false)
    setSelectedItem(null)
    setAgreeButton(true)
    setDialogTitle(props.addItemText)
    setOptions("addItem")
    setDialogDes("")
    props.data === "campaign" || props.data === "advertisement"  ? setFullScreenDialog(true) : setFullScreenDialog(false)
    setOpenDialog(true)
  }

  const onClickDownloadExcel = () => {
    setDialogLoading(false)
    setAgreeButton(true)
    setDialogTitle("Download Excel")
    setOptions("downloadExcel")
    setDialogDes("")
    setFullScreenDialog(false)
    setOpenDialog(true)
  }

  const onClickOpenFolder = (row) => {
    setDialogLoading(false)
    setSelectedItem(row)
    setAgreeButton(false)
    setDialogTitle(row.name)
    setOptions("openFolder")
    setDialogDes("")
    setFullScreenDialog(true)
    setOpenDialog(true)
  }

  const onClickRefresh = (row) => {
    firebase.database().ref(props.data + '/' + row.id).update({ refreshed: firebase.database.ServerValue.TIMESTAMP })
    firebase.database().ref(props.data + '/' + row.id).update({ push: true, message: "push" })
  }

  const onClickUpdate = (row) => {
    firebase.database().ref(props.data + '/' + row.id).update({ refreshed: firebase.database.ServerValue.TIMESTAMP })
    firebase.database().ref(props.data + '/' + row.id).update({ push: true, message: "update" })
  }

  const onClickRestart = (row) => {
    firebase.database().ref(props.data + '/' + row.id).update({ refreshed: firebase.database.ServerValue.TIMESTAMP })
    firebase.database().ref(props.data + '/' + row.id).update({ push: true, message: "restart" })
  }

  const onClickListStation = (row) => {
    setDialogLoading(false)
    setSelectedItem(row)
    setAgreeButton(false)
    setDialogTitle(row.name)
    setOptions("openFolder")
    setDialogDes("")
    setFullScreenDialog(true)
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  };

  const bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  const selectFolder = (cell) => {
    firebase.database().ref(props.data + '/' + selectedItem.id).update({ folder: cell ? cell.id : null })
    if(selectedItem.folder){
      firebase.database().ref(props.folder_data + "/" + selectedItem.folder).update({ updated: firebase.database.ServerValue.TIMESTAMP})
    }
    
    setSelected([])
    setOpenDialog(false)
  }

  const selectFolderMoveAll = (cell) => {

    selected.forEach((child, index) => {
      firebase.database().ref(props.data + '/' + child.id).update({ folder: cell ? cell.id : null })
      if(child.folder){
        firebase.database().ref(props.folder_data + "/" + child.folder).update({ updated: firebase.database.ServerValue.TIMESTAMP})
      }
    });

    setSelected([])
    setOpenDialog(false)
  }

  const readrowsExcel = () => {

    if(props.data === "log_content"){
      return readRows()
    }
    else
    {
      return rowsOriginal;
    }
  }

  const handleAgree = () => {

    if(option === "deleteAll"){
        selected.forEach((child, index) => {
          firebase.database().ref(props.data + '/' + child.id).remove().then(() => {
            if(props.data === "content"){
              firebase.storage().ref().child(child.full_path).delete().catch((error)=>{

              })
            }
          })
          if(child.folder){
            firebase.database().ref(props.folder_data + "/" + child.folder).update({ updated: firebase.database.ServerValue.TIMESTAMP})
          }
          firebase.database().ref("log_"+props.data).push({  user: firebase.auth().currentUser.email, item: child, action: "deleted", updated: firebase.database.ServerValue.TIMESTAMP})
        });
    }

    else if(option === "delete"){
      firebase.database().ref(props.data + '/' + selectedItem.id).remove().then(() => {
        if(props.data === "content"){
          firebase.storage().ref().child(selectedItem.full_path).delete().catch((error)=>{
           
          })
          
        }
        
        if(selectedItem.folder){
          firebase.database().ref(props.folder_data + "/" + selectedItem.folder).update({ updated: firebase.database.ServerValue.TIMESTAMP})
        }
        firebase.database().ref("log_"+props.data).push({  user: firebase.auth().currentUser.email, item: selectedItem, action: "deleted", updated: firebase.database.ServerValue.TIMESTAMP})
      })
    }    

    else if(option === "edit"){
      firebase.database().ref(props.data + '/' + selectedItem.id).update(selectedItem)

      firebase.database().ref("log_"+props.data).push({  user: firebase.auth().currentUser.email, item: selectedItem, action: "edited", updated: firebase.database.ServerValue.TIMESTAMP})
    }    

    else if(option === "addItem"){

        var newPostKey = firebase.database().ref().child(props.data).push().key;

        addItem['created'] = firebase.database.ServerValue.TIMESTAMP;
        addItem['id'] = newPostKey;
        addItem['user'] = firebase.auth().currentUser.email;

        if(props.folder){
          addItem['folder'] = props.folder;
          firebase.database().ref(props.folder_data + "/" + props.folder).update({ updated: firebase.database.ServerValue.TIMESTAMP})
        }

        
    
        if(props.data === "user"){
          firebase.auth().createUserWithEmailAndPassword(addItem.email, addItem.password)
          .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;

            addItem['id'] = user.uid
            var updates = {};
            updates[props.data + '/' + user.uid] = addItem;
            
            firebase.database().ref().update(updates);
            setAddItem(props.addCellsName ? props.addCellsName : [])
    
            firebase.database().ref("log_"+props.data).push({  user: firebase.auth().currentUser.email, item: addItem, action: "added", updated: firebase.database.ServerValue.TIMESTAMP})
          })
          .catch((error) => {
            var errorMessage = error.message;

            setSnackMsg(errorMessage)
            setSnackOpen(true)
          });
          
        }
        else
        {
          var updates = {};
          updates[props.data + '/' + newPostKey] = addItem;

          firebase.database().ref().update(updates);
          setAddItem(props.addCellsName ? props.addCellsName : [])
  
          firebase.database().ref("log_"+props.data).push({  user: firebase.auth().currentUser.email, item: addItem, action: "added", updated: firebase.database.ServerValue.TIMESTAMP})
        }
        
    }

    else if(option === "publish"){
      firebase.database().ref(props.data + '/' + selectedItem.id).update({ publish: true });

      if(props.data === "campaign"){
        allStation.forEach(val => {
          if(val.campaign === selectedItem.id){
            firebase.database().ref('station/' + val.id).update({ push: true, message: "push", refreshed: firebase.database.ServerValue.TIMESTAMP })
          }
        })
      }

      firebase.database().ref("log_"+props.data).push({  user: firebase.auth().currentUser.email, item: selectedItem, action: "published", updated: firebase.database.ServerValue.TIMESTAMP})
    }

    else if(option === "downloadExcel"){

      if(props.excelList){

        var listItems = {
          columns:[],
          data:[[]]
        }

        props.excelList.forEach(cell => {

          if(cell.id === "id" || cell.id === "name" ||  cell.id === "type" 
          ||  cell.id === "zone"  ||  cell.id === "address" ||  cell.id === "created" ||  cell.id === "refreshed"
          ||  cell.id === "block" ||  cell.id === "note"){
            listItems.columns.push({title: "", width: {wpx: 170}})
          }
          else
          {
            listItems.columns.push({title: "", width: {wpx: cell.label.length*12}})
          }
          
          listItems.data[0].push({value: cell.label, 
            style: { 
              alignment: { horizontal: "center" }, 
              font: {sz: "11", bold: true}, 
              border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
              bottom: { style: "thin", color: {rgb: "FF000000"}}, 
              left: { style: "thin", color: {rgb: "FF000000"}}, 
              right: { style: "thin", color: {rgb: "FF000000"}} }, 
              fill: {patternType: "solid", fgColor: {rgb: "FFffd200"}}}})

        })

        readrowsExcel().forEach((cell) => {
          var items_cell = []
          props.excelList.forEach(cellid => {

            if(cellid.id === "campaign"){

              var campaign_value = "";
              
              if(cell[cellid.id]){
                
                  var currentCampaign = allCampaign.map(val => val.id).indexOf(cell[cellid.id])

                  if(currentCampaign !== -1){
                    campaign_value = allCampaign[currentCampaign].name;
                  }
                
              }

              items_cell.push(
                {value: campaign_value, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }
            else if(cellid.id === "advertisement"){

              var ads_value = "";
              
              if(cell[cellid.id]){

                  var currentCampaign = allAds.map(val => val.id).indexOf(cell[cellid.id])

                  if(currentCampaign !== -1){
                    ads_value = allAds[currentCampaign].name;
                  }

                
              }

              items_cell.push(
                {value: ads_value, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }
            else if(cellid.id === "folder"){

              var group_value = "";
              
              if(cell[cellid.id]){
                var currentFolder = allFolder.map(val => val.id).indexOf(cell[cellid.id])
                group_value = allFolder[currentFolder].name
              }
              

              items_cell.push(
                {value: group_value, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }
            else if(cellid.id === "created" || cellid.id === "updated" || cellid.id === "signed_in" || cellid.id === "signed_out"){

              var created_date = "";

              if(cell[cellid.id]){
                created_date = new Intl.DateTimeFormat('en-US', {year: 'numeric',day: '2-digit',  month: 'long' ,hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }).format(cell[cellid.id]).toString()
              }
              

              items_cell.push(
                {value: created_date, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }

            else if(cellid.id === "content_start_date" || cellid.id === "content_end_date"){

              var created_date = "";

              if(cell["item"]["start_date"] && cellid.id === "content_start_date"){
                var d = new Date(cell["item"]["start_date"])
                created_date = new Intl.DateTimeFormat('en-US', {year: 'numeric',day: '2-digit',  month: 'long' 
                }).format(d).toString()
              }

              if(cell["item"]["end_date"] && cellid.id === "content_end_date"){
                var d = new Date(cell["item"]["end_date"])
                created_date = new Intl.DateTimeFormat('en-US', {year: 'numeric',day: '2-digit',  month: 'long'
                }).format(d).toString()
              }


              items_cell.push(
                {value: created_date, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }

            else if(cellid.id === "content_start_time" || cellid.id === "content_end_time"){

              var created_date = "";

              if(cell["item"]["start_time"] && cellid.id === "content_start_time"){
                var d = new Date(cell["item"]["start_time"])
                created_date = new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true 
                }).format(d).toString()
              }

              if(cell["item"]["end_time"] && cellid.id === "content_end_time"){
                var d = new Date(cell["item"]["end_time"])
                created_date = new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true 
                }).format(d).toString()
              }


              items_cell.push(
                {value: created_date, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }


            else if(cellid.id === "refreshed"){

              var refreshed_date = "";

              if(cell[cellid.id]){
                refreshed_date = new Intl.DateTimeFormat('en-US', {year: 'numeric',day: '2-digit',  month: 'long' ,hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }).format(cell[cellid.id]).toString()
              }

              items_cell.push(
                {value: refreshed_date, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }
            else if(cellid.id === "size" || cellid.id === "campaign_size"){

              var fileSize = "";

              if(cell[cellid.id]){
                fileSize = bytesToSize(cell[cellid.id])
              }
              

              items_cell.push(
                {value: fileSize, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }
            else if(cellid.id === "campaign_duration"){

              var campaign_duration = ""

              if(cell[cellid.id]){
                campaign_duration = secondsToHms(cell[cellid.id])
              }
              
              
              items_cell.push(
                {value: campaign_duration, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }

            else if(cellid.id === "publish"){

              var publish = "Not yet"

              if(cell[cellid.id]){
                publish = "Yes"
              }
              
              
              items_cell.push(
                {value: publish, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }

            else if(cellid.id === "campaign_status"){

              var campaign_status = "Permanent"

              if(cell[cellid.id] !== null){

                if(cell[cellid.id]){
                  campaign_status = "Not Expired"
                }
                else
                {
                  campaign_status = "Expired"
                }
                
              }
              
              
              items_cell.push(
                {value: campaign_status, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }
            else if(cellid.id === "file_name"){

              var File_name = cell["item"]["name"]
              
              items_cell.push(
                {value: File_name, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }

            else if(cellid.id === "stations"){

              var _folders = []
              var stations = ""

              if(cell[cellid.id] !== undefined && cell[cellid.id] !== null){
                cell[cellid.id].forEach(val =>{

                  if(val.folder!== undefined){
                    _folders.push(val.folder)
                  }
                })

                var unique = _folders.filter((v, i, a) => a.indexOf(v) === i);
                
                console.log(allStationZone)
                unique.forEach(val =>{
                  
                  var matched = allStationZone.map(val => val.id).indexOf(val)
                  
                  if(matched !== -1){
                    stations += allStationZone[matched].name +" ,"

                    
                  }
                  
                })

                
              }

              
              items_cell.push(
                {value: stations, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }

            else if(cellid.id === "content_campaign"){

              var campaigns = ""

              if(cell[cellid.id] !== undefined && cell[cellid.id] !== null){
                campaigns = cell[cellid.id]
              }

              items_cell.push(
                {value: campaigns, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }

            else if(cellid.id === "in_use"){

              var in_use = "";

              var newRows = [];
              newRows = allCampaign.filter(item => {
                if(item.content){
                  if(item.content.map(val => val.id).indexOf(cell.id) !== -1){
                    return item
                  }else
                  {
                    return undefined
                  }
                }else
                {
                  return undefined
                }
              })

              if(newRows.length > 0){
                newRows.forEach((content_cell, index) => {

                  if(newRows.length === 1){
                    in_use += content_cell.name
                  }
                  else
                  {
                    if(index === newRows.length-1){
                      in_use += content_cell.name;
                    }
                    else
                    {
                      in_use += content_cell.name + "\n"
                    }
                    
                  }
                  
                })
                
              }
              

              items_cell.push(
                {value: in_use, 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }
            else
            {
              items_cell.push(
                {value: cell[cellid.id] ? cell[cellid.id] : "", 
                  style: { 
                    alignment: { horizontal: "center", vertical: "center", wrapText: "true" }, 
                    font: {sz: "11"}, 
                    border: { top: { style: "thin", color: {rgb: "FF000000"}}, 
                    bottom: { style: "thin", color: {rgb: "FF000000"}}, 
                    left: { style: "thin", color: {rgb: "FF000000"}}, 
                    right: { style: "thin", color: {rgb: "FF000000"}}}}
                }
              )
            }
            
          })

          
          listItems.data.push(items_cell)
        })
        
        setMultiDataSet([listItems])

        setTimeout(
          () => excelInput.current.click(), 
          1000
        );
        
      }
    }

    setSelected([])
    setOpenDialog(false)
  }

  const onChangeHandle = (e, id) => {
    setSelectedItem({ ...selectedItem, [id]: e.target.value });
  }

  const onChangeAddItemHandle = (e, id) => {
    setAddItem({ ...addItem, [id]: e.target.value });
  }

  const withinDateTime = (startDate, endDate, startTime, endTime) => {
        
       
    if(startDate && endDate && startTime && endTime){

        var start_date = new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth(), new Date(startDate).getDate());
        var end_date = new Date(new Date(endDate).getFullYear(), new Date(endDate).getMonth(), new Date(endDate).getDate());
        var current_date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        var current_time = new Date();

        var start_time = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date(startTime).getHours(), new Date(startTime).getMinutes());
        var end_time = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date(endTime).getHours(), new Date(endTime).getMinutes());

        if(start_date <= current_date && end_date >= current_date && new Date(start_time).getHours() === new Date(end_time).getHours() && new Date(startTime).getMinutes() === new Date(endTime).getMinutes()){
            return true
        }

        if(start_date <= current_date && end_date >= current_date && current_time >= start_time && current_time <= end_time){
            return true
        }

        return false
    }
    else
    {
        return true
    }
  }

  const secondsToHms = (d)=> {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " min, " : " mins, ") : "";
    var sDisplay = s > 0 ? s + (s === 1 ? " sec" : " secs") : "";
    return hDisplay + mDisplay + sDisplay; 
  }

  const renderComponent = () => {
        
    if(option === "playPreview"){
        return(
            <ContentPreview withinDateTime={withinDateTime} rows={selectedItem.content}/>
        )
    }
  }

  const renderDisabledDelete = (newRows, totalRowsContain) => {

    var disabledDelete = false

    if(totalRowsContain.length > 0)
    {
      disabledDelete = true
    }
    else if(newRows.length > 0){
      disabledDelete = true
    }
    else{
      disabledDelete = props.disabledDelete
    }
    return disabledDelete
  }

  const readRows = () => {

    var filterData = rowsOriginal.filter(item => { 

      if(searchValue === "file_name"){

        return item["item"]["name"].toString().toLowerCase().includes(searchtxt.toLowerCase())
      }

      if(searchValue === "updated"){

        return new Intl.DateTimeFormat('en-GB', {year: 'numeric',day: '2-digit',  month: 'long' ,hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }).format(item[searchValue]).toString().toLowerCase().includes(searchtxt.toLowerCase())
      }
      
      if(item[searchValue] !== undefined){

        if(searchValue === "folder"){
          var currentFolder = allFolder.map((val) => val.id).indexOf(item[searchValue])

          if(currentFolder !== -1){
            return allFolder[currentFolder].name.toString().toLowerCase().includes(searchtxt.toLowerCase())
          }
          else
          {
            return undefined
          }
        }
        else
        {
          return item[searchValue].toString().toLowerCase().includes(searchtxt.toLowerCase())
        }
        
        
      }
      else
      {
        return undefined
      }
    });

    if(searchtxt !== ""){
        return filterData
    }
    else{
        return rowsOriginal
    }
    
    
  }

  if(loading){
    return (
    <div style={{ display: 'flex',  justifyContent:'center', alignItems:'center', marginTop: 70  }}>
      <CircularProgress 
        disableShrink
        color="primary" />
    </div>);
  }

  var d = new Date();
  var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + "-" + 
  d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();

  return (
    <Grid>
        <ExcelFile element={<Button style={{ display:"none"}} ref={excelInput} >download</Button>} filename={props.data + "_" + datestring}>
                <ExcelSheet dataSet={multiDataSet} name={props.data}/>
        </ExcelFile>
        <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackOpen}
        autoHideDuration={5000}
        onClose={handleSnackClose}
        message={snackMsg}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
        <Dialog 
          agreeTxt={"Yes"}
          disagreeTxt={"No"}
          description={dialogDes}
          title={dialogTitle}
          open={openDialog} 
          agreeButton={agreeButton}
          selectedItem={selectedItem}
          addItem={addItem}
          displayInfo={props.displayInfo}
          matches={props.matches}
          onChangeHandle={(e, id) => onChangeHandle(e, id)}
          onChangeAddItemHandle={(e, id) => onChangeAddItemHandle(e, id)}
          editCells={props.editCells}
          addCells={props.addCells}
          addItemTitle={props.addItemText}
          handleAgree={handleAgree}
          fullScreenDialog={fullScreenDialog}
          option={option}
          data={props.data}
          dialogLoading={dialogLoading}
          folderData={folderData}
          folder={props.folder}
          allCampaign={allCampaign}
          allAds={allAds}
          selectFolder={selectFolder}
          component={renderComponent()}
          allFolder={allFolder}
          withinDateTime={(data) => withinDateTime(data)}
          secondsToHms={(data) => secondsToHms(data)}
          bytesToSize={(data) => bytesToSize(data)}
          selectFolderMoveAll={selectFolderMoveAll}
          handleClose={handleClose}/>
          
        <EnhancedTableToolbar 
          type={props.type}
          data={props.data}
          {...props}
          handleSetRows={() => props.handleSetRows(selected)}
          onClickMoveAll={onClickMoveAll}
          addItemText={props.addItemText} 
          addItemIcon={props.addItemIcon}
          addItemButton={props.addItemButton}
          numSelected={selected.length} 
          selected={selected}
          onClickAddItem={onClickAddItem}
          onClickDownloadExcel={onClickDownloadExcel}
          onClickDeleteAll={onClickDeleteAll}/>
        <TableContainer>
        <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
            >
            <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                {...props}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={readRows().length}
                headCells={headCells}
                control={props.control}
                collapse={props.matches}
                downloadExcel={props.downloadExcel}
            />
            
            <TableBody>
                <TableRow>
                    <TableCell padding={'none'} colSpan={headCells.length+1+(props.control ? 1 : 0)}>
                    <Grid container>
                        <Grid item md={7} xs={12}>
                        <form noValidate autoComplete="off">
                        <FormControl style={{ marginTop:10 }} fullWidth >
                            <InputLabel style={{ marginLeft:20 }}>Search</InputLabel>
                            <Input disabled={rowsOriginal.length > 0 ? false : true} onChange={(e) => search(e)}
                                value={searchtxt}
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment style={{ marginLeft:20 }} position="start">
                                    <SearchIcon />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        </form>
                        </Grid>
                        <Grid item md={5} xs={12} style={{ marginTop:10 }}>
                        <FormControl style={{ width: "100%"}} >
                            <InputLabel style={{ paddingLeft: 25 }} id="simple-select-outlined-label">Search by</InputLabel>
                            <Select
                                style={{ paddingLeft: 18 }} 
                                disabled={rowsOriginal.length > 0 ? false : true}
                                labelId="simple-select-outlined-label"
                                id="simple-select-outlined"
                                value={searchValue}
                                label="Search by"
                                onChange={(e) => onChangeSearchSelect(e)}
                            >
                                {searchCell.map((cell, index)=>{
                                    const labelId = `enhanced-search-${index}`;
                                    return(
                                        <MenuItem key={labelId} value={cell.id}>{cell.label}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        </Grid>
                    </Grid>
                    </TableCell>
                </TableRow>
                {stableSort(readRows(), getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                    const isItemSelected = isSelected(row);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const rolllabelId = `enhanced-table-roll-${index}`;
                    var newRows = [];
                    newRows = allCampaign.filter(item => {
                      if(item.content){
                        if(item.content.map(val => val.id).indexOf(row.id) !== -1){
                          return item
                        }else
                        {
                          return undefined
                        }
                      }else
                      {
                        return undefined
                      }
                    })

                    var totalRowsContain = [];
                    rowsChild.forEach(val=> {
                      if(val.folder === row.id){
                        totalRowsContain.push(val)
                      }
                    })


                    return (
                      <React.Fragment key={rolllabelId}>
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          selected={isItemSelected} 
                          >
                          <TableCell padding="checkbox">
                              <Checkbox
                                style={{ display: props.listOnly ? "none" : "normal"}} 
                              onClick={(event) => handleCheckBoxClick(event, row)}
                              checked={isItemSelected}
                              inputProps={{ 'aria-labelledby': labelId }}
                              />
                          </TableCell>
                          {headCells.map((cell, cellIndex) => {
                              const labelCellId = `enhanced-table-cell-${cellIndex}`;

                              

                              if(cell.id === "created" || cell.id === "updated" || cell.id === "refreshed" || cell.id === "signed_in" || cell.id === "signed_out"){
                                return(
                                  row[cell.id] ? <TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                  {new Intl.DateTimeFormat('en-GB', {year: 'numeric',day: '2-digit',  month: 'long' ,hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }).format(row[cell.id])}
                                  </TableCell> : <TableCell key={labelCellId} style={{ padding: 3 }} align="left"></TableCell>)
                              }
                              else if(cell.id === "size"){
                                return(
                                  <TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                  {bytesToSize(row[cell.id])}
                                  </TableCell>)
                              }
                              else if(cell.id === "in_use"){
                                return(
                                  <TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                  {newRows.length > 0 ? 
                                   <Tooltip title={<Grid style={{ display:'flex', flexDirection:"column"}}>
                                      {newRows.map(val => {
                                        return <Typography key={val.id} variant="caption">{val.name}</Typography>
                                    })}</Grid>}>
                                    <IconButton>
                                      <CheckCircleIcon color="primary" fontSize="small"/> 
                                    </IconButton>
                                  </Tooltip>
                                  
                                  : 
                                  <IconButton>
                                    <CancelIcon color="error" fontSize="small"/>
                                  </IconButton>
                                  }
                                  </TableCell>)
                              }
                              else if(cell.id === "total"){
                                
                                return(
                                  <TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                  {totalRowsContain.length + (totalRowsContain.length > 1 ? " " + props.child + "s" : " "+ props.child)}
                                  </TableCell>)
                              }
                              else if(cell.id === "campaign"){
                                
                                return(
                                  <TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                    <Tooltip title={
                                      row[cell.id] ? <Grid style={{ display:'flex', flexDirection:"column"}}>
                                        <Typography key={row[cell.id]} variant="caption">{allCampaign.map(val=> val.id).indexOf(row[cell.id]) !== -1 ? allCampaign[allCampaign.map(val=> val.id).indexOf(row[cell.id])].name : ''}</Typography></Grid>: '' }>
                                      <Grid style={{ display:'flex', flexDirection:"column"}}>
                                        {row[cell.id] ? <AssignmentTurnedInIcon color="primary"/> : null}
                                      </Grid>
                                    </Tooltip>
                                  </TableCell>)
                              }
                              else if(cell.id === "advertisement"){
                                
                                return(
                                  <TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                    <Tooltip title={
                                      row[cell.id] ? <Grid style={{ display:'flex', flexDirection:"column"}}>
                                        <Typography key={row[cell.id]} variant="caption">{allAds.map(val=> val.id).indexOf(row[cell.id]) !== -1 ? allAds[allAds.map(val=> val.id).indexOf(row[cell.id])].name : ''}</Typography></Grid>: '' }>
                                      <Grid style={{ display:'flex', flexDirection:"column"}}>
                                        {row[cell.id] ? <AssignmentTurnedInIcon color="primary"/> : null}
                                      </Grid>
                                    </Tooltip>
                                  </TableCell>)
                              }
                              else if(cell.id === "publish"){

                                if(props.data === "advertisement"){
                                  var currentCampaign = allCampaign.filter(val=> {
                                    if(val.advertisement && val.advertisement === row.id){
                                      return val
                                    }
                                    else
                                    {
                                      return undefined
                                    }
                                  })
                                  
                                  
                                  return(<TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                  {row[cell.id] ? 
                                  <Tooltip title={currentCampaign.length > 0 ? <div>{currentCampaign.map(val=> { return <div>{val.name}<br /></div> })}</div> : ""}>
                                    <IconButton>
                                      <CheckCircleIcon color="primary" fontSize="small"/>
                                    </IconButton>
                                  </Tooltip>:
                                  <Tooltip title={currentCampaign.length > 0 ? <div>{currentCampaign.map(val=> { return <div>{val.name}<br /></div> })}</div> : ""}>
                                  <IconButton>
                                    <CancelIcon color="error" fontSize="small"/>
                                  </IconButton></Tooltip>}
                                </TableCell>)
                                }
                                else
                                {
                                  return(<TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                  {row[cell.id] ? 
                                  <IconButton>
                                    <CheckCircleIcon color="primary" fontSize="small"/>
                                  </IconButton>:
                                  <IconButton>
                                    <CancelIcon color="error" fontSize="small"/>
                                  </IconButton>}
                                </TableCell>)
                                }
                                
                                
                                
                              }
                              else if(cell.id === "status"){
                                
                                return(<TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                  {row[cell.id]? 
                                  <Tooltip title="Online">
                                  <IconButton>
                                    <CheckCircleIcon color="primary" fontSize="small"/>
                                  </IconButton>
                                  </Tooltip>:
                                  <Tooltip title="Offline">
                                  <IconButton>
                                    <CancelIcon color="error" fontSize="small"/>
                                  </IconButton>
                                  </Tooltip>}
                                </TableCell>)
                              }
                              else if(cell.id === "is_playing"){
                                
                                return(<TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                  {row[cell.id]? 
                                  <Tooltip title="Playing">
                                  <IconButton>
                                    <CheckCircleIcon color="primary" fontSize="small"/>
                                  </IconButton>
                                  </Tooltip>:
                                  <Tooltip title="Stop">
                                  <IconButton>
                                    <CancelIcon color="error" fontSize="small"/>
                                  </IconButton>
                                  </Tooltip>}
                                </TableCell>)
                              }
                              else if(cell.id === "campaign_status"){

                                if(row.start_date && row.end_date && row.start_time && row.end_time ){
                                  row[cell.id] = withinDateTime(row.start_date, row.end_date, row.start_time, row.end_time);
                                }else{
                                  row[cell.id] = null
                                }
      
                                return(<TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                  {row[cell.id] != null ? 
                                  <Tooltip title={ row[cell.id] ?"Current": "Expired"}>
                                    <IconButton>
                                      <FiberManualRecordIcon style={{ color: row[cell.id] ? "#6bce00" : "#b4b4b4"}} fontSize="small"/>
                                    </IconButton>
                                  </Tooltip>
                                  :
                                  <Tooltip title="Permanent">
                                    <IconButton>
                                      <RadioButtonUncheckedIcon style={{ color: "#b4b4b4"}} fontSize="small"/>
                                    </IconButton>
                                  </Tooltip>
                                  }
                                </TableCell>)
                              }
                              else if(cell.id === "campaign_size"){

                                var totalSize = row.content.map(val => val.size).reduce((prev, next) => prev + next);
                                row[cell.id] = totalSize;
                                return(<TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                  {row.content ? 
                                  bytesToSize(totalSize)
                                  :
                                  null}
                                </TableCell>)
                              }
                              else if(cell.id === "campaign_duration"){

                                var totalDuration = row.content.map(val => val.duration).reduce((prev, next) => prev + next);
                                row[cell.id] = totalDuration;
                                return(<TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                  {row.content ? 
                                  secondsToHms(totalDuration)
                                  :
                                  null}
                                </TableCell>)
                              }
                              else if(cell.id === "folder" || cell.id === "group"){

                                var currentFolder = allFolder.map(val => val.id).indexOf(row.folder)
                                
                                return(<TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                  {currentFolder !== -1 ? 
                                  allFolder[currentFolder].name
                                  :
                                  null}
                                </TableCell>)
                              }
                              else if(cell.id === "file_name"){
                                
                                return(<TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                 {row["item"]["name"]}
                                </TableCell>)
                              }

                              else if(cell.id === "address"){
                                
                                return(
                                  <TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                    <Grid style={{overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150}} >
                                      <Typography variant="body2" noWrap={false}>{row[cell.id]}</Typography>
                                    </Grid>
                                  </TableCell>)
                              }
                              
                              
                              
                              return(
                              <TableCell key={labelCellId} style={{ padding: 3 }} align="left">
                                <Grid style={{overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200}} >
                                  <Typography variant="body2" noWrap={false}>{row[cell.id]}</Typography>
                                </Grid>
                              </TableCell>)
                          })}
                          {props.control && props.matches? 
                            <TableCell key={"control"} style={{ padding: 3 }} align="right">
                                <ControlButton 
                                  data={props.data}
                                  row={row}
                                  type={props.type}
                                  onClickPreviewCampaign={(row) => onClickPreviewCampaign(row)}
                                  onClickMove={(row)=> onClickMove(row)} 
                                  onClickPublish={(row) => onClickPublish(row)}
                                  onClickPreview={(row)=> onClickPreview(row)} 
                                  onClickInfo={(row)=> onClickInfo(row)}
                                  onClickEdit={(row)=> onClickEdit(row)}
                                  onClickDelete={(row)=> onClickDelete(row)}
                                  onClickOpenFolder={(row)=> onClickOpenFolder(row)}
                                  onClickRefresh={(row)=> onClickRefresh(row)}
                                  onClickUpdate={(row)=> onClickUpdate(row)}
                                  onClickRestart={(row)=> onClickRestart(row)}
                                  onClickListStation={(row)=> onClickListStation(row)}
                                  disabledDelete={renderDisabledDelete(newRows, totalRowsContain)}
                                  disabledEdit={props.disabledEdit}
                                  {...props}
                                />
                            </TableCell> : null}

                            {props.matches ? null : 
                            <TableCell align="right">
                              <IconButton onClick={() => { 
                                  if(collapse === row.id){
                                    setCollapse(null)
                                  }
                                  else
                                  {
                                    setCollapse(row.id)
                                  }
                              }}>
                                {collapse === row.id? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            </TableCell>}
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headCells.length+1+(props.control ? 1 : 0)}>
                              <Collapse in={collapse === row.id ? true : false } timeout="auto" unmountOnExit>
                                  <Box margin={1}>
                                      <ControlButton 
                                        data={props.data}
                                        row={row}
                                        type={props.type}
                                        onClickPreviewCampaign={(row) => onClickPreviewCampaign(row)}
                                        onClickMove={(row)=> onClickMove(row)} 
                                        onClickPublish={(row) => onClickPublish(row)}
                                        onClickPreview={(row)=> onClickPreview(row)} 
                                        onClickInfo={(row)=> onClickInfo(row)}
                                        onClickEdit={(row)=> onClickEdit(row)}
                                        onClickDelete={(row)=> onClickDelete(row)}
                                        onClickOpenFolder={(row)=> onClickOpenFolder(row)}
                                        onClickRefresh={(row)=> onClickRefresh(row)}
                                        onClickUpdate={(row)=> onClickUpdate(row)}
                                        onClickRestart={(row)=> onClickRestart(row)}
                                        onClickListStation={(row)=> onClickListStation(row)}
                                        disabledDelete={renderDisabledDelete(newRows, totalRowsContain)}
                                        disabledEdit={props.disabledEdit}
                                        {...props}
                                      />
                                  </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                    labelRowsPerPage={"Pages"}
                    rowsPerPageOptions={[10, 25, 50]}
                    colSpan={headCells.length+1+(props.control ? 1 : 0)}
                    count={readRows().length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                        inputProps: { 'aria-label': 'rows per page' },
                        native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                    />
                </TableRow>
            </TableFooter>
        </Table>
        </TableContainer>
          
    </Grid>
  );
}