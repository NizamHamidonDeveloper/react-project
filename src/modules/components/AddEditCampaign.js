import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Typography } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TablePaginationActions from './TablePaginationActions';
import Checkbox from '@material-ui/core/Checkbox';
import ImageIcon from '@material-ui/icons/Image';
import Avatar from '@material-ui/core/Avatar';
import TableHead from '@material-ui/core/TableHead';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import CheckIcon from '@material-ui/icons/Check';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Stations from '../../views/pages/Campaign/Stations'
import Contents from '../../views/pages/Campaign/Contents'
import _uniqueId from 'lodash/uniqueId';
import ReactPlayer from 'react-player'
import Dialog from './Dialog'
import { DateRange  } from 'react-date-range';
import { addDays } from 'date-fns';
import TimeRange from 'react-time-range';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ContentPreview from './ContentPreview'
import { Tooltip } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import firebase from "firebase";
import { SystemUpdate } from '@material-ui/icons';

//table head
function EnhancedTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount, headCells, disableCheckBox } = props;

    return (
        <TableHead >
            <TableRow>
                {disableCheckBox ? null : <TableCell padding="checkbox">
                <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={onSelectAllClick}
                    inputProps={{ 'aria-label': 'select all' }}
                />
                </TableCell>}
                {headCells ? headCells.map((headCell) => (
                <TableCell
                    style={{padding: 3}}
                    key={headCell.id}
                    align={'left'}
                    padding={'none'}
                    sortDirection={false}
                >
                    {headCell.label}
                </TableCell>
                )):null}
                
            </TableRow>
        </TableHead>
    );
}


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    duration: {
        "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                display: "none"
         }
    },table: {
        width: "100%",
    },
    
}));

const getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle,

    ...(isDragging && {
        background: "rgb(235,235,235)"
    })
})

const DraggableComponent = (id, index) => (props) => {
    return (
        <Draggable draggableId={id} index={index}>
            {(provided, snapshot) => (
                <TableRow
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    {...props}
                >
                    {props.children}
                </TableRow>
            )}
        </Draggable>
    )
}

const DroppableComponent = (onDragEnd) => (props) =>
{
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={'1'} direction="vertical">
                {(provided) => {
                    return (
                        <TableBody ref={provided.innerRef} {...provided.droppableProps} {...props}>
                            {props.children}
                            {provided.placeholder}
                        </TableBody>
                    )
                }}
            </Droppable>
        </DragDropContext>
    )
}


export default function AddCampaign(props){

    const classes = useStyles();
    const [rows, setRows] = React.useState([]);
    const [duration, setDuration] = React.useState(10)
    const [campaignName, setCampaignName] = React.useState("")
    const [sequance, setSequance] = React.useState(1)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page2, setPage2] = React.useState(0);
    const [page3, setPage3] = React.useState(0);
    const [rowsPerPage2, setRowsPerPage2] = React.useState(10);
    const [rowsPerPage3, setRowsPerPage3] = React.useState(10);
    const [selecteditem, setSelecteditem] = React.useState(rows[0]);
    const [selected, setSelected] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [dialogLoading, setDialogLoading] = React.useState(false);
    const [fullScreenDialog, setFullScreenDialog] = React.useState(false);
    const [dialogTitle, setDialogTitle] = React.useState("");
    const [dialogDes, setDialogDes] = React.useState("");
    const [agreeButton, setAgreeButton] = React.useState(false);
    const [globalSchedule, setGlobalSchedule] = React.useState(false);
    const [option, setOptions] = React.useState("");
    const [allAds, setAllAds] = React.useState([]);
    const [parallel, setParallel] = React.useState(1);
    const [selectedAds, setSelectedAds] = React.useState("none");
    const [selectionRange, setSelectionRange] = React.useState({
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection',
    });
    const [allFolder, setAllFolder] = React.useState([]);
    const [allStation, setAllStation] = React.useState([]);

    const [timeRange, setTimeRange] = React.useState({
        startTime: new Date(new Date().setHours(0,0,0,0)),
        endTime: new Date(new Date().setHours(0,0,0,0)),
    });

    const [globalDateTime, setGlobalDateTime] = React.useState(null);

    const [selectedStations, setSelectedStations] = React.useState([]);

    useEffect(() => {
        

        let folderRef = firebase.database().ref("station_zone");

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

        let stationRef = firebase.database().ref("station");

        stationRef.once('value', snapshot => {
          if(snapshot.exists()){
            var allstations = []
            var _selectedStations = []
            snapshot.forEach(child => {
        
              var itemsVal = child.val();
              allstations.push(itemsVal);
              
              if(props.data === "advertisement"){
                if(props.selectedItem && itemsVal.advertisement === props.selectedItem.id){
                    _selectedStations.push(itemsVal)
                  }
              }
              else
              {
                if(props.selectedItem && itemsVal.campaign === props.selectedItem.id){
                    _selectedStations.push(itemsVal)
                  }
              }
             
              
            })
            setSelectedStations(_selectedStations)
            setAllStation(allstations)
          }
        })

        let adsRef = firebase.database().ref("advertisement");

        adsRef.once('value', snapshot => {
            if(snapshot.exists()){
                var itemsAds = []
                snapshot.forEach(child => {
            
                    var itemsVal = child.val();
                    itemsAds.push(itemsVal);
                    
                    
                })

                setAllAds(itemsAds)

            }
        })

        if(props.selectedItem){

            setRows(props.selectedItem.content)
            setSelecteditem(props.selectedItem.content[0])
            setDuration(props.selectedItem.content[0].duration ? props.selectedItem.content[0].duration : 0)
            setCampaignName(props.selectedItem.name)
            setSelectedAds(props.selectedItem.advertisement ? props.selectedItem.advertisement : null)
            setParallel(props.selectedItem.parallel ? props.selectedItem.parallel : 1)
           
            if(props.selectedItem.start_date &&
                props.selectedItem.end_date &&
                props.selectedItem.start_time && 
                props.selectedItem.end_time ){
                    var newDateTime = {
                        startDate: props.selectedItem.start_date ? props.selectedItem.start_date : new Date(),
                        endDate: props.selectedItem.end_date ? props.selectedItem.end_date : addDays(new Date(), 1),
                        startTime: props.selectedItem.start_time ? props.selectedItem.start_time : new Date(new Date().setHours(0,0,0,0)),
                        endTime: props.selectedItem.end_time ? props.selectedItem.end_time : new Date(new Date().setHours(0,0,0,0)),
                    }
                    setGlobalDateTime(newDateTime)
                }
        }


    }, [props]);

    const onChangeduration = (e) => {
        const newValue = Math.min(Math.max(e.target.value, 1), 100)
        setRowsDuration(newValue)
        setDuration(previousValue => newValue)
    }

    const addDuration = () => {
        setDuration(prev => {

            var newPrev = 0;

            if(prev < 100){
                newPrev = prev + 1
            }
            else{
                newPrev = prev
            }

            setRowsDuration(newPrev)

            return newPrev
        })
    }

    const minusDuration = () => {
        setDuration(prev => {
            var newPrev = 0;

            if(prev > 1){
                newPrev = prev - 1
            }
            else{
                newPrev = prev
            }

            setRowsDuration(newPrev)

            return newPrev
        })
    }

    const setRowsDuration = (value) => {
        rows[rows.map(val=>val).indexOf(selecteditem)].duration = value;
    }

    //table
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangePage2 = (event, newPage) => {
        setPage2(newPage);
    };

    const handleChangePage3 = (event, newPage) => {
        setPage3(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeRowsPerPage2 = (event) => {
        setRowsPerPage2(parseInt(event.target.value, 10));
        setPage2(0);
    };

    const handleChangeRowsPerPage3 = (event) => {
        setRowsPerPage3(parseInt(event.target.value, 10));
        setPage3(0);
    };
    
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelecteds = rows.map((n) => n);
          setSelected(newSelecteds);
          return;
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
    
        setSelected(newSelected);
    };

    const onClickRow = (row) => {
        setSelecteditem(row)
        setSequance(rows.map(val=>val).indexOf(row)+1)
        setDuration(rows[rows.map(val=>val).indexOf(row)].duration)
    }

    const onDragEnd = (result) => {

        if (!result.destination) {
            return
        }

        const items = reorder(
            rows,
            result.source.index,
            result.destination.index
        )

        
        setRows(items);
        setSequance(items.map(val=>val).indexOf(selecteditem)+1)
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)

        return result
    }

    const applySequance = () => {
        const items = reorder(
            rows,
            rows.map(val=>val).indexOf(selecteditem),
            sequance-1
        )
        setRows(items);
    }

    const onChangeSquance = (e) => {
        const newValue = Math.min(Math.max(e.target.value, 1), rows.length)
        setSequance(previousValue => newValue)
    }

    const onClickUp = () => {
        if(rows.map(val=>val).indexOf(selecteditem) !== 0){
            const items = reorder(
                rows,
                rows.map(val=>val).indexOf(selecteditem),
                (sequance-1)-1
            )
            setRows(items);
            setSequance(sequance-1)
        }
    }

    const onClickDown = () => {
        if(rows.map(val=>val).indexOf(selecteditem) !== rows.length - 1){
            const items = reorder(
                rows,
                rows.map(val=>val).indexOf(selecteditem),
                (sequance-1)+1
            )
            setRows(items);
            setSequance(sequance+1)
        }
    }

    const handleClose = () => {
        setOpenDialog(false)
    };

    const addContent = () => {
        setDialogLoading(false)
        setAgreeButton(false)
        setDialogTitle("Add Content")
        setOptions("addItem")
        setDialogDes("")
        setFullScreenDialog(false)
        setOpenDialog(true)
    }

    const addStation = () => {
        setDialogLoading(false)
        setAgreeButton(false)
        setDialogTitle("Select Sation")
        setOptions("selectStation")
        setDialogDes("")
        setFullScreenDialog(false)
        setOpenDialog(true)
    }

    const handleSetRows = (row) => {
        
        var newRows = [];
        row.forEach((child, index) => {
            var newChild = child;
            newChild.uid = child.id+(rows.length + _uniqueId('prefix-'));
            if(child.type === "image/jpeg"){
                newChild.duration = 10
            }
            
            newRows.push(newChild)
        })

        if(!selecteditem){

            setSelecteditem(newRows[0])
            setDuration(newRows[0].type === "image/jpeg" ? 10 : 0)
        }
        setRows(prev => [...prev, ...newRows])
        setOpenDialog(false)
        setSelected([])
    }

    const handleSetStation = (stationRows) => {
        setSelectedStations(stationRows)
        setOpenDialog(false)
    }

    const campaignDurations = () => {

        var totalduration = 0
        var _totalCampaignDuration = 0
        var campaignPer = 100
        
        if(MixRows().length > 0 && selectedAds !== null){
            totalduration = MixRows().map(val => val.duration).reduce((prev, next) => prev + next);
            _totalCampaignDuration = MixRows().map(val => !val.highlight ? val.duration : 0).reduce((prev, next) => prev + next);
            campaignPer = (_totalCampaignDuration / totalduration)*100
        }
    

        return campaignPer.toFixed(2);
    }

    const adsDurations = () => {
        var totalduration = 0
        var _totalCampaignDuration = 0
        var campaignPer = 0
        
        if(MixRows().length > 0 && selectedAds !== null){
            totalduration = MixRows().map(val => val.duration).reduce((prev, next) => prev + next);
            _totalCampaignDuration = MixRows().map(val => val.highlight ? val.duration : 0).reduce((prev, next) => prev + next);
            campaignPer = (_totalCampaignDuration / totalduration)*100
        }


        return campaignPer.toFixed(2);
    }

    const onClickDelete = () => {
        var newRows = rows.filter(item => !selected.includes(item))

        if(newRows.length === 0){
            setSelecteditem(null)
            setDuration(0)
        }
        else if(newRows.map(val => val).indexOf(selecteditem) === -1){
            setSelecteditem(newRows[0])
            setDuration(newRows[0].duration)
            setSequance(1)
        }

        setRows(newRows)
        setSelected([])
    }

    const publishCampaign = () => {
        setDialogLoading(false)
        setAgreeButton(true)
        setDialogTitle("Publish")
        setOptions("publishStation")
        
        if(selectedStations.length > 0){
            setDialogDes("Are you sure want to publish to these stations?")
        }
        else{
            setDialogDes("No stations added")
        }
        
        setFullScreenDialog(false)
        setOpenDialog(true)
    }

    const saveCampaign = () => {
        setDialogLoading(false)
        setAgreeButton(true)
        setDialogTitle("Save")
        setOptions("saveStation")
        
        if(selectedStations.length > 0){
            setDialogDes("Are you sure want to save to these stations?")
        }
        else{
            setDialogDes("No stations added")
        }
        
        setFullScreenDialog(false)
        setOpenDialog(true)
    }

    const savedCampaign = (publish) => {

        if(props.option === "edit"){
    
            firebase.database().ref(props.data +  "/" + props.selectedItem.id).update({ 
                name:  campaignName,
                content: rows,
                updated: firebase.database.ServerValue.TIMESTAMP,
                publish: publish,
                start_date: globalDateTime? globalDateTime.startDate : null,
                end_date: globalDateTime? globalDateTime.endDate : null,
                start_time : globalDateTime? globalDateTime.startTime : null,
                end_time: globalDateTime? globalDateTime.endTime : null,
                parallel: parseInt(parallel) 
            });

            if(publish){
                firebase.database().ref("log_" + props.data).push({  user: firebase.auth().currentUser.email, item: props.selectedItem, status: "updated_published", updated: firebase.database.ServerValue.TIMESTAMP})

                props.selectedItem.content.forEach(val=>{
                    firebase.database().ref("log_content").push({  user: firebase.auth().currentUser.email, stations: selectedStations, item: val, action: "campaign_published", content_campaign:  props.selectedItem.name, updated: firebase.database.ServerValue.TIMESTAMP})
                })
            }
            else
            {
                firebase.database().ref("log_" + props.data).push({  user: firebase.auth().currentUser.email, item: props.selectedItem, status: "updated", updated: firebase.database.ServerValue.TIMESTAMP})

                props.selectedItem.content.forEach(val=>{
                    firebase.database().ref("log_content").push({  user: firebase.auth().currentUser.email, stations: selectedStations,  item: val, action: "campaign_saved", content_campaign:  props.selectedItem.name, updated: firebase.database.ServerValue.TIMESTAMP})
                })
            }
            
            if(selectedStations.length > 0){

                if(props.data === "advertisement"){
                    selectedStations.forEach(val=>{
                        firebase.database().ref("station/" + val.id).update({ advertisement: props.selectedItem.id })
                    })
                }
                else{
                    selectedStations.forEach(val=>{
                        firebase.database().ref("station/" + val.id).update({ campaign: props.selectedItem.id })
                    })
                }
                
            }
           
        }
        else
        {
            var addItem = {};
            var newPostKey = firebase.database().ref().child(props.data).push().key;
    
            addItem['created'] = firebase.database.ServerValue.TIMESTAMP;
            addItem['id'] = newPostKey;
            addItem['user'] = firebase.auth().currentUser.uid;
            addItem['name'] = campaignName;
            addItem['content'] = rows;
            addItem['publish'] = publish;
            addItem['start_date'] = globalDateTime ? globalDateTime.startDate : null
            addItem['end_date'] = globalDateTime ? globalDateTime.endDate : null
            addItem['start_time'] = globalDateTime ? globalDateTime.startTime : null
            addItem['end_date'] = globalDateTime ? globalDateTime.endTime : null
            addItem['parallel'] = parseInt(parallel)
    
            var updates = {};
            updates[props.data + "/" + newPostKey] = addItem;
    
            firebase.database().ref().update(updates);

            if(publish){
                firebase.database().ref("log_" + props.data).push({  user: firebase.auth().currentUser.email, item: addItem, status: "added_published", updated: firebase.database.ServerValue.TIMESTAMP})
            }
            else{
                firebase.database().ref("log_" + props.data).push({  user: firebase.auth().currentUser.email, item: addItem, status: "added", updated: firebase.database.ServerValue.TIMESTAMP})
            }
            
            if(selectedStations.length > 0){
                if(props.data === "advertisement"){
                    selectedStations.forEach(val=>{
                        firebase.database().ref("station/" + val.id).update({ advertisement: newPostKey })
                    })
                }
                else{
                    selectedStations.forEach(val=>{
                        firebase.database().ref("station/" + val.id).update({ campaign: newPostKey })
                    })
                }
            }

        }
        

        props.handleClose()
    }

    const onChangeName = (e) => {
        setCampaignName(e.target.value)
    }

    const setContentSchedule = (global) => {

        if(!global){
            if(rows.map(val => val).indexOf(selecteditem) !== -1){
                if( rows[rows.map(val => val).indexOf(selecteditem)].start_date &&  rows[rows.map(val => val).indexOf(selecteditem)].end_date)
                {
                    setSelectionRange({
                        startDate: new Date(rows[rows.map(val => val).indexOf(selecteditem)].start_date),
                        endDate: new Date(rows[rows.map(val => val).indexOf(selecteditem)].end_date),
                        key: 'selection',
                    })
    
                    
                }
                else
                {
                    setSelectionRange({
                        startDate: new Date(),
                        endDate: addDays(new Date(), 1),
                        key: 'selection',
                    })
                    
                }
    
                if( rows[rows.map(val => val).indexOf(selecteditem)].start_time &&  rows[rows.map(val => val).indexOf(selecteditem)].end_time)
                {
                    setTimeRange({
                        startTime: new Date(rows[rows.map(val => val).indexOf(selecteditem)].start_time),
                        endTime: new Date(rows[rows.map(val => val).indexOf(selecteditem)].end_time)
                    })
                }
                else{
                    setTimeRange({
                        startTime: new Date(new Date().setHours(0,0,0,0)),
                        endTime: new Date(new Date().setHours(0,0,0,0)),
                    })
                }
            }
        }
        else
        {
            if(globalDateTime){
                setSelectionRange({
                    startDate: new Date(globalDateTime.startDate),
                    endDate: new Date(globalDateTime.endDate),
                    key: 'selection',
                })
    
                setTimeRange({
                    startTime: new Date(globalDateTime.startTime),
                    endTime: new Date(globalDateTime.endTime),
                })
            }
            else
            {
                setSelectionRange({
                    startDate: new Date(),
                    endDate: addDays(new Date(), 1),
                    key: 'selection',
                })
    
                setTimeRange({
                    startTime: new Date(new Date().setHours(0,0,0,0)),
                    endTime: new Date(new Date().setHours(0,0,0,0)),
                })
            }
            
        }
        

        setDialogLoading(false)
        setAgreeButton(true)
        setDialogTitle(global ? "Global Schedule" : "Schedule")
        setOptions("setContentSchedule")
        setDialogDes("")
        setFullScreenDialog(false)
        setGlobalSchedule(global)
        setOpenDialog(true)
        
    }

    const handleAgree = () => {
        
        if(option === "publishStation"){
            savedCampaign(true)
        }
        else if(option === "saveStation"){
            savedCampaign(false)
        }
        else
        {
            if(!globalSchedule){
                if(rows.map(val => val).indexOf(selecteditem) !== -1){
                    rows[rows.map(val => val).indexOf(selecteditem)].start_date = selectionRange.startDate;
                    rows[rows.map(val => val).indexOf(selecteditem)].end_date = selectionRange.endDate;
                    rows[rows.map(val => val).indexOf(selecteditem)].start_time = timeRange.startTime;
                    rows[rows.map(val => val).indexOf(selecteditem)].end_time = timeRange.endTime;
                }
            }
            else{
                var newDateTime={
                    startDate: selectionRange.startDate,
                    endDate: selectionRange.endDate,
                    startTime: timeRange.startTime,
                    endTime: timeRange.endTime,
                }
                setGlobalDateTime(newDateTime)
            }
        }
        
        
        setOpenDialog(false)
    }
    
    const onChangeDateRange = (ranges) => {
        setSelectionRange(ranges.selection)
    }

    const renderContentSchedule = () => {
        
        return(
            <Grid>
                <TimeRange 
                    startMoment={new Date(timeRange.startTime)}
                    endMoment={new Date(timeRange.endTime)}
                    onChange={onChangeTimeRange}
                />
                <DateRange 
                    direction="vertical"
                    scroll={{ enabled: true }}
                    editableDateInputs={true}
                    ranges={[selectionRange]}
                    onChange={onChangeDateRange}
                    />
            </Grid>
        )
    }

    const onChangeTimeRange = (timerange) => {

        setTimeRange({
            startTime: new Date(timerange.startTime),
            endTime: new Date(timerange.endTime)
        })
    }

    const onClickPreview = () => {
        setDialogLoading(false)
        setAgreeButton(false)
        setDialogTitle("Preview")
        setOptions("playPreview")
        setDialogDes("")
        setFullScreenDialog(false)
        setOpenDialog(true)
    }

    const renderComponent = () => {
        
        if(option === "setContentSchedule"){
            return(renderContentSchedule())
        }
        else if(option === "selectStation"){
            return(
                <Stations selectedStations={selectedStations} handleSetStation={(rows) => handleSetStation(rows)} />
            )
        }
        else if(option === "addItem"){
            return(<Contents handleSetRows={(rows) => handleSetRows(rows)}/>)
        }
        else if(option === "playPreview"){
            return(
                <ContentPreview withinDateTime={withinDateTime} rows={rows}/>
            )
        }
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

    const ExpiredDateTime = (startDate, endDate, startTime, endTime) => {
        
       
        if(startDate && endDate && startTime && endTime){

            var start_date = new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth(), new Date(startDate).getDate());
            var end_date = new Date(new Date(endDate).getFullYear(), new Date(endDate).getMonth(), new Date(endDate).getDate());
            var current_date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

            if(start_date <= current_date && end_date >= current_date)
            {
                return true
            }

            if(start_date >= current_date){
                return true
            }

            return false
        }
        else
        {
            return true
        }
    }

    const renderTotalSize = () => {

        if(rows.length > 1){
            var totalSize = rows.map(val => val.size).reduce((prev, next) => prev + next);
            return bytesToSize(totalSize)
        }
        else if(rows.length === 1){
            return bytesToSize(rows[0].size)
        }

        return "No Content"
    }

    const renderTotalDuration = () => {
        if(rows.length > 1){
            var totalDuration = rows.map(val => val.duration).reduce((prev, next) => prev + next);
            return secondsToHms(totalDuration)
        }
        else if(rows.length === 1){
            return secondsToHms(rows[0].duration)
        }

        return "No Content"
    }

    const bytesToSize = (bytes) => {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };

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

    const handleIntervalChange = (event) => {
        setParallel(event.target.value)
    }

    const MixRows = () => {
        var currentAds = allAds.map(val=> val.id).indexOf(selectedAds)
        var newRows = []
        var count = 0
        var countAds = 0
        var countParallel = parallel
        var totalNum = 0

        if(currentAds !== -1 && rows.length > 0){

            if(allAds[currentAds].content.length >= rows.length){
                if(allAds[currentAds].content.length % 2 !== 0){
                    totalNum = (allAds[currentAds].content.length + 1)*(parseInt(parallel)+1)
                }
                else
                {
                    totalNum = allAds[currentAds].content.length*(parseInt(parallel)+1)
                }
            }
            else
            {
                if(rows.length % 2 !== 0){
                    totalNum = (rows.length + 1)*(parseInt(parallel)+1)
                }
                else
                {
                    totalNum = rows.length*(parseInt(parallel)+1)
                }
            }
           

            for (let i = 0; i < totalNum; i++) 
            {
                if(countParallel > parallel - 1){

                    countParallel = 0

                    if(countAds > allAds[currentAds].content.length -1){
                        countAds = 0
                    }

                    var adsContent = allAds[currentAds].content[countAds]
                    adsContent.highlight = true
    
                    newRows.push(adsContent)
                    countAds++

                }
                else
                {
                    if(count > rows.length -1){
                        count = 0
                    }
    
                    newRows.push(rows[count])
                    count++
                    countParallel++
                }

            }

        }

        return newRows
    }

    const handleAdvertisementChange = (event) => {

        setPage3(0)
        setRowsPerPage3(10)
        setSelectedAds(event.target.value === "none" ? null : event.target.value)
    }
    
    return(      
        <Grid style={{ marginTop: 20 }}>
            <Dialog 
                agreeTxt={"Yes"}
                disagreeTxt={"No"}
                description={dialogDes}
                title={dialogTitle}
                open={openDialog} 
                agreeButton={agreeButton}
                fullScreenDialog={fullScreenDialog}
                option={option}
                dialogLoading={dialogLoading}
                handleAgree={handleAgree}
                component={renderComponent()}
                handleClose={handleClose}/>
          
            <Grid container>
            
            <Grid item lg={4} xs={12} >
                <Grid>
                    <Grid container style={{ paddingLeft: 20, paddingRight: 20, paddingBottom:10 }}>
                        <Grid item xs={12}>
                            <Button onClick={addContent} color="primary" style={{ width: "100%" , height: "100%"}} 
                            startIcon={<AddCircleIcon/>} 
                            disableElevation  variant="contained">Add Content</Button>
                    </Grid>

                 </Grid>
            </Grid>
                
            
            <Grid container spacing={2} style={{ display: "flex", justifyContent: "center", paddingLeft: 20, paddingRight: 20, paddingBottom: 10}}>
                <Grid item md={6} xs={4} style={{ display: "flex" }}>
                    <Grid  style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <TextField
                            disabled={rows.length > 0 && selecteditem ? rows.map(val => val).indexOf(selecteditem) !== -1 && selecteditem.type ==="image/jpeg" ? false : true : true} 
                            className={classes.duration}
                            label="Duration"
                            type="number"
                            onChange={onChangeduration}
                            value={rows.length > 0 && selecteditem ? !rows.map(val => val).indexOf(selecteditem) !== -1 && selecteditem.type ==="image/jpeg" ? duration : 0 : 0}
                            variant="outlined"
                            />
                    </Grid>
                    <Grid style={{ display: "flex", alignItems: "center", flexDirection: "column"}}>
                        <IconButton style={{ marginBottom: -5}} 
                        disabled={rows.length > 0 && selecteditem ? rows.map(val => val).indexOf(selecteditem) !== -1 && selecteditem.type ==="image/jpeg" ? false : true : true} 
                        onClick={addDuration}>
                            <AddCircleIcon  style={{ color: rows.length > 0 && selecteditem ? rows.map(val => val).indexOf(selecteditem) !== -1 && selecteditem.type ==="image/jpeg" ? "#556ee6":"#9f9f9f" : "#9f9f9f" }}/>
                        </IconButton>
                        <IconButton 
                        
                        disabled={rows.length > 0 && selecteditem ? rows.map(val => val).indexOf(selecteditem) !== -1 && selecteditem.type ==="image/jpeg" ? false : true : true} 
                         onClick={minusDuration}>
                            <RemoveCircleIcon style={{ color: rows.length > 0 && selecteditem ? rows.map(val => val).indexOf(selecteditem) !== -1 && selecteditem.type ==="image/jpeg" ? "#556ee6":"#9f9f9f" : "#9f9f9f"}}/>
                        </IconButton>
                    </Grid>
                    
                </Grid>

                <Grid  md={6} item xs={5} style={{ display: "flex", }}>
                 <Button onClick={()=>setContentSchedule(false)} disabled={rows.length > 0 ? false : true}  color="primary" style={{ width: "100%"}} 
                        startIcon={<QueryBuilderIcon/>} 
                        disableElevation  variant="outlined">
                            {"Content Schedule"}
                            </Button>
                </Grid>
                <Grid item  md={12} xs={3} style={{ display: "flex", paddingTop: 7, paddingBottom: 7 }}>
                    <Button disabled={rows.length > 0 ? false : true}  color="primary" style={{ width: "100%" , height: "100%"}} 
                    startIcon={<DeleteIcon/>} 
                    onClick={onClickDelete}
                    disableElevation  variant="outlined">Delete</Button>
                </Grid>
                   
            </Grid>

            <Grid style={{ display: "flex", flexDirection: "column", justifyContent: "center" , paddingLeft: 20, paddingRight: 20, paddingBottom: 10}}>
                <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f", fontWeight: "bold"}} variant="caption">Content Schedule Status</Typography>
                <Grid>
                    <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f", fontWeight: "bold"}} variant="caption">Date: </Typography>
                    <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f" }} variant="caption">{
                        selecteditem ? rows[rows.map(val => val).indexOf(selecteditem)].start_date ? 
                        "From " + 
                        new Intl.DateTimeFormat('en-GB', {year: 'numeric',day: '2-digit',  month: 'long' }).format(new Date(rows[rows.map(val => val).indexOf(selecteditem)].start_date))
                        + " to " +
                        new Intl.DateTimeFormat('en-GB', {year: 'numeric',day: '2-digit',  month: 'long' }).format(new Date(rows[rows.map(val => val).indexOf(selecteditem)].end_date))
                        : "No schedule" : "No schedule"}
                    </Typography>
                </Grid>
                <Grid>
                    <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f", fontWeight: "bold"}} variant="caption">Time: </Typography>
                    <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f" }} variant="caption">{
                                selecteditem ? rows[rows.map(val => val).indexOf(selecteditem)].start_time && rows[rows.map(val => val).indexOf(selecteditem)].end_time? 
                                "From " + 
                                new Intl.DateTimeFormat('en-GB', {hour: 'numeric',minute: 'numeric' }).format(new Date(rows[rows.map(val => val).indexOf(selecteditem)].start_time))
                                + " to " +
                                new Intl.DateTimeFormat('en-GB', {hour: 'numeric',minute: 'numeric' }).format(new Date(rows[rows.map(val => val).indexOf(selecteditem)].end_time))
                                : "No schedule" : "No schedule"}
                    </Typography>
                </Grid>
                
            </Grid>

            <Grid container style={{ display: "flex", paddingLeft: 20, paddingRight: 20, paddingBottom: 5}}>
                <Grid item xs={5} style={{ display: "flex" }}>
                    <Grid  style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <TextField
                            disabled={rows.length > 1 ? false : true} 
                            className={classes.duration}
                            label="Sequance"
                            type="number"
                            onChange={onChangeSquance}
                            value={rows.length > 0 ? sequance : 0}
                            variant="outlined"
                            />
                    </Grid>
                    <Grid style={{ display: "flex", alignItems: "center", flexDirection: "column"}}>
                        <IconButton disabled={rows.length > 1 ? false : true} style={{ marginBottom: -5}} onClick={onClickUp}>
                            <KeyboardArrowUpIcon  style={{ color: selected.length > 0 ? "#556ee6":"#9f9f9f" }}/>
                        </IconButton>
                        <IconButton disabled={rows.length > 1 ? false : true} onClick={onClickDown}>
                            <KeyboardArrowDownIcon style={{ color: selected.length > 0 ? "#556ee6":"#9f9f9f" }}/>
                        </IconButton>
                    </Grid>
                    
                </Grid>
                <Grid item xs={7} style={{ display: "flex", flexDirection: "column", paddingTop: 7, paddingBottom: 7}}>
                    <Button disabled={rows.length > 1 ? false : true} onClick={applySequance} color="default" style={{ width: "100%" , height: "100%"}} 
                            disableElevation  variant="contained">Apply Sequence</Button>
                </Grid>
                
            </Grid>
            <Grid container style={{ display: "flex", paddingLeft: 20, paddingRight: 20, paddingBottom: 5}}>
                <Grid container style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <Grid item xs={6} style={{ display: "flex", flexDirection: "row" }}>
                        <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f", fontWeight: "bold"}} variant="caption">Total Size: </Typography>
                        <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f", paddingLeft: 5 }} variant="caption">
                            {renderTotalSize()}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} style={{ display: "flex", flexDirection: "row" }}>
                        <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f", fontWeight: "bold"}} variant="caption">Total Duration: </Typography>
                        <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f", paddingLeft: 5 }} variant="caption">
                            {renderTotalDuration()}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container style={{ opacity: rows.length > 0 ? 1:.5, display: "flex", flexDirection: "column", paddingLeft: 20, paddingRight: 20, paddingBottom: 10}}>
            <Typography variant="caption">Drag the contents to change sequence</Typography>
            </Grid>

            <Grid style={{ opacity: rows.length > 0 ? 1:.5, display:"flex", flexDirection:"column", justifyContent: "center", paddingBottom: 20 }}>
               
                <TableContainer>
                    <Table className={classes.table} aria-label="custom pagination table">
                        <EnhancedTableHead
                            
                            classes={classes}
                            numSelected={selected.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={rows.length}
                            headCells={[
                            { id: 'no', numeric: false, disablePadding: false, label: 'No.' },
                            { id: 'status', numeric: false, disablePadding: false, label: 'Stat' },
                            { id: 'thumbnail', numeric: false, disablePadding: false, label: '' },
                            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
                            { id: 'selected', numeric: true, disablePadding: false, label: '' }]}
                        />
                        
                        <TableBody component={DroppableComponent(onDragEnd)}>
                        {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                        ).map((row, index) => {
                            const isItemSelected = isSelected(row);
                            const labelId = `enhanced-table-checkbox-${index}`;
                            var scheduled = null;
                            
                            if(row.start_date && row.end_date && row.start_time && row.end_time){
                                if(ExpiredDateTime(row.start_date, row.end_date, row.start_time, row.end_time)){
                                    scheduled = true;
                                }
                                else
                                {
                                    scheduled = false;
                                }
                            }
                            
                            return(
                            <TableRow hover
                            component={DraggableComponent(row.uid, index)}
                            key={labelId}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            onClick={()=> onClickRow(row)}
                            
                            selected={isItemSelected} >
                            <TableCell padding="checkbox">
                                <Checkbox
                                onClick={(event) => handleCheckBoxClick(event, row)}
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </TableCell>
                            
                            <TableCell  style={{ padding: 3, width: 10 }}  align="left">
                                <Typography variant="body2">{(index+1)+(page*10) +"."}</Typography>
                            </TableCell>
                            <TableCell  style={{ padding: 3, width: 10 }}  align="left">
                                {scheduled === null ? 
                                <Tooltip title={"No Schedule"}>
                                        <RadioButtonUncheckedIcon style={{ fontSize: 12}} />    
                                </Tooltip>
                                
                                : 
                                <Tooltip title={scheduled === true? "Schedule Active" : "Schedule Expired"}>
                                    <FiberManualRecordIcon  style={{ fontSize: 12, color: scheduled === true? "green": "red"}}/>
                                </Tooltip>
                                }
                            </TableCell>
                            <TableCell  style={{ padding: 3, width: 50 }}  align="left">
                            {row.type === "image/jpeg" ? 
                                <Avatar variant="rounded"  alt={row.name} src={row.url}>
                                </Avatar> :
                                 <Avatar variant="rounded">
                                        <ImageIcon/>
                                 </Avatar>}
                            </TableCell>
                            <TableCell  style={{ padding: 3, overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}  align="left">
                                {row.name}
                            </TableCell>
                            <TableCell  style={{ padding: 3, paddingRight: 10, width: 40 }}  align="right">
                                {selecteditem && row.uid === selecteditem.uid ? <CheckIcon color="primary"/>: ""}
                            </TableCell>
                            </TableRow>
                        )})}

                        </TableBody>
                        <TableFooter>
                        <TableRow>
                            <TablePagination
                                labelRowsPerPage={"Pages"}
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={6}
                                count={rows.length}
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
            </Grid>

            {/*props.data === "advertisement" ? null : <Grid item lg={3} xs={12} style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }} >
                <Grid>
                    <FormControl disabled={rows.length > 0 ?false:true} variant="outlined" style={{ width: "100%"}}>
                        <InputLabel htmlFor="outlined-age-native-simple">Parallel</InputLabel>
                        <Select
                        native
                        value={parallel}
                        onChange={handleIntervalChange}
                        label="Parallel"
                        >
                        <option value={1}>1 Campaign 1 Ads</option>
                        <option value={2}>2 Campaign 1 Ads</option>
                        <option value={3}>3 Campaign 1 Ads</option>
                        <option value={4}>4 Campaign 1 Ads</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid style={{ marginTop: 5 }}>
                    <Grid>
                        <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f" }} variant="caption">{rows.length > 0 ? "Advertisement " + adsDurations() + "%":"Advertisement"}</Typography>
                        <LinearProgress variant="determinate"  value={rows.length > 0 ? adsDurations() : 0}/>
                    </Grid>
                    <Grid style={{ marginTop: 10 }} >
                        <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f" }} variant="caption">{rows.length > 0 ? "Campaign " + campaignDurations() + "%":"Campaign"}</Typography>
                        <LinearProgress variant="determinate"  value={rows.length > 0 ? campaignDurations() : 0}/>
                    </Grid>
                </Grid>
                <Grid style={{ marginTop: 17 }}>
                    <FormControl disabled={rows.length > 0 ?false:true} variant="outlined" style={{ width: "100%"}}>
                        <InputLabel htmlFor="outlined-age-native-simple">Advertisement</InputLabel>
                        <Select
                        native
                        value={selectedAds}
                        onChange={handleAdvertisementChange}
                        label="Advertisement"
                        >
                        <option value={"none"}>none</option>
                        {allAds.map(val => {
                            return <option value={val.id}>{val.name}</option>
                        })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid style={{ marginTop: 10, opacity: rows.length > 0 ? 1:.5}}>
                    <TableContainer>
                        <Table className={classes.table} aria-label="custom pagination table">
                            <EnhancedTableHead
                                disableCheckBox={true}
                                classes={classes}
                                numSelected={selected.length}
                                rowCount={rows.length}
                                headCells={[
                                { id: 'no', numeric: false, disablePadding: false, label: 'No.' },
                                { id: 'name', numeric: false, disablePadding: false, label: 'Name' }]}
                            />
                            
                            <TableBody>
                            {(rowsPerPage3 > 0 
                                ? MixRows().slice(page3 * rowsPerPage3, page3 * rowsPerPage3 + rowsPerPage3)
                                : MixRows()
                            ).map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;
                                

                                return(
                                <TableRow hover={false}
                                style={{ backgroundColor: row.highlight ? "#e0e0e0" : undefined }}
                                key={labelId}
                                role="checkbox"
                                tabIndex={-1} >

                                <TableCell  style={{ padding: 10, width: 10 }}  align="left">
                                    <Typography variant="body2">{(index+1)+(page3*10) +"."}</Typography>
                                </TableCell>
                                <TableCell  style={{  padding: 3, overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}  align="left">
                                    {row.name}
                                </TableCell>
                                </TableRow>
                            )})}

                            </TableBody>
                            <TableFooter>
                            <TableRow>
                                <TablePagination
                                    labelRowsPerPage={""}
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={6}
                                    count={MixRows().length}
                                    rowsPerPage={rowsPerPage3}
                                    page={page3}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={handleChangePage3}
                                    onChangeRowsPerPage={handleChangeRowsPerPage3}
                                    ActionsComponent={TablePaginationActions}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Grid>
                                </Grid>*/}             

            <Grid item lg={4} xs={12} style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }} >
                
               {selecteditem ?  
                 <Grid>
                    {selecteditem.type === "image/jpeg" ? 
                    <img style={{ borderRadius: 5  }} width={"100%"} alt={selecteditem.name} src={selecteditem.url}/>
                    : <ReactPlayer controls style={{ borderRadius: 5  }} width={"100%"} alt={selecteditem.name} url={selecteditem.url}/>}
                </Grid> :
                <Grid style={{ backgroundColor : '#ebebeb', minHeight: 200, borderRadius: 5  }}></Grid>}
            </Grid>

            <Grid item lg={4} xs={12}>
                <Grid style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={4}>
                            <Button onClick={onClickPreview} color="primary" style={{ width: "100%" ,}} 
                                startIcon={<VisibilityIcon/>} 
                                disabled={rows.length > 0 ? false:true}
                                disableElevation variant="outlined" >
                                    Preview
                            </Button>
                        </Grid>
                        <Grid item md={6} xs={4}>
                            <Button onClick={()=>saveCampaign()} color="primary" style={{ width: "100%" ,}} 
                                startIcon={<SaveIcon/>} 
                                disabled={rows.length > 0 ? false:true}
                                disableElevation variant="outlined" >
                                    Save
                            </Button>
                        </Grid>
                        <Grid item md={12} xs={4}>
                            <Button onClick={()=>publishCampaign()} color="primary" style={{ width: "100%" ,}} 
                                startIcon={<PublishIcon/>} 
                                disabled={rows.length > 0 ? false:true}
                                disableElevation variant="contained">
                                    Publish
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container style={{ display: "flex", paddingLeft: 20, paddingRight: 20, paddingBottom: 20}}>
                    <TextField
                        style={{ width:"100%"}}
                        disabled={rows.length > 0 ? false:true}
                        label="Name"
                        onChange={onChangeName}
                        value={campaignName}
                        variant="outlined"
                        />
                </Grid>

                <Grid style={{ display: "flex", justifyContent: "center", paddingLeft: 20, paddingRight: 20, paddingBottom: 20}}>
                     <Button onClick={()=>setContentSchedule(true)}  color="primary" style={{ width: "100%" ,}} 
                     disabled={rows.length > 0 ? false:true}
                            startIcon={<QueryBuilderIcon/>} 
                            disableElevation  variant="outlined">{"Global Schedule"}</Button>
                </Grid>
                <Grid style={{ display: "flex", flexDirection: "column", justifyContent: "center" , paddingLeft: 20, paddingRight: 20, paddingBottom: 10}}>
                <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f", fontWeight: "bold"}} variant="caption">Global Schedule</Typography>
                <Grid>
                <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f", fontWeight: "bold"}} variant="caption">Date: </Typography>
                    <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f" }} variant="caption">{
                        globalDateTime ? 
                        "From " + 
                        new Intl.DateTimeFormat('en-GB', {year: 'numeric',day: '2-digit',  month: 'long' }).format(new Date(globalDateTime.startDate))
                        + " to " +
                        new Intl.DateTimeFormat('en-GB', {year: 'numeric',day: '2-digit',  month: 'long' }).format(new Date(globalDateTime.endDate))
                        : "No schedule"}
                    </Typography>
                </Grid>
                <Grid>
                <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f", fontWeight: "bold"}} variant="caption">Time: </Typography>
                <Typography style={{ color: rows.length > 0 ? "#556ee6":"#9f9f9f" }} variant="caption">{
                            globalDateTime ? 
                            "From " + 
                            new Intl.DateTimeFormat('en-GB', {hour: 'numeric',minute: 'numeric' }).format(new Date(globalDateTime.startTime))
                            + " to " +
                            new Intl.DateTimeFormat('en-GB', {hour: 'numeric',minute: 'numeric' }).format(new Date(globalDateTime.endTime))
                            : "No schedule" }
                </Typography>
                </Grid>
            </Grid>

                <Grid style={{ opacity: rows.length > 0 ? 1:.5, display:"flex", flexDirection:"column", justifyContent: "center", paddingBottom: 20 }}>              
                    <Grid>
                        <Grid container style={{ paddingLeft: 20, paddingRight: 20, paddingBottom:10 }}>
                            <Grid item xs={12}>
                                <Button onClick={addStation} color="primary" style={{ width: "100%" , height: "100%"}} 
                                startIcon={<AddCircleIcon/>} 
                                disableElevation  variant="contained">Select Stations</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid style={{ padding: 20, opacity: rows.length > 0 ? 1:.5}}>
                    <TableContainer>
                        <Table className={classes.table} aria-label="custom pagination table">
                            <EnhancedTableHead
                                disableCheckBox={true}
                                classes={classes}
                                numSelected={selected.length}
                                rowCount={rows.length}
                                headCells={[
                                { id: 'no', numeric: false, disablePadding: false, label: 'No.' },
                                { id: 'name', numeric: false, disablePadding: false, label: 'Station ID' },
                                { id: 'folder', numeric: false, disablePadding: false, label: 'Group' }]}
                            />
                            
                            <TableBody>
                            {(rowsPerPage2 > 0
                                ? selectedStations.slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2)
                                : selectedStations
                            ).map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;
                                
                                var currentFolder = allFolder.map(val => val.id).indexOf(row.folder)
                                
                                return(
                                <TableRow hover
                                key={labelId}
                                role="checkbox"
                                tabIndex={-1} >

                                <TableCell  style={{ padding: 10, width: 10 }}  align="left">
                                    <Typography variant="body2">{(index+1)+(page2*10) +"."}</Typography>
                                </TableCell>
                                <TableCell  style={{ padding: 3, overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}  align="left">
                                    {row.name}
                                </TableCell>
                                <TableCell  style={{ padding: 3, overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}  align="left">
                                {currentFolder !== -1 ? 
                                  allFolder[currentFolder].name
                                  :
                                  null}
                                </TableCell>
                                </TableRow>
                            )})}

                            </TableBody>
                            <TableFooter>
                            <TableRow>
                                <TablePagination
                                    labelRowsPerPage={""}
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={6}
                                    count={selectedStations.length}
                                    rowsPerPage={rowsPerPage2}
                                    page={page2}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={handleChangePage2}
                                    onChangeRowsPerPage={handleChangeRowsPerPage2}
                                    ActionsComponent={TablePaginationActions}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Grid>

            </Grid>

            </Grid>
        </Grid>

    )
}