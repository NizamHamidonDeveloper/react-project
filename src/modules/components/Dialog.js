import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ReactPlayer from 'react-player'
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Contents from '../../views/pages/Content/Contents'
import Stations from '../../views/pages/Station/Stations'
import Campaigns from '../../views/pages/Campaign/Campaigns'
import ListStations from '../../views/pages/Campaign/Stations'
import AddEditCampaign from './AddEditCampaign'
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { Tooltip } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';


const bytesToSize = (bytes) => {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

const styles = (theme) => ({
  root: {
    backgroundColor: "#556ee6",
    display:"flex",
    width:"100%",
    justifyContent: "space-between",
  },
  closeButton: {
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, data, ...other } = props;
  return (
    <React.Fragment>
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography style={{ color: "white", textAlign: "center", marginTop: 5}} variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon  style={{ color: "white"}}/>
          </IconButton>
        ) : null}
      </MuiDialogTitle>
      <Divider style={{ opacity: .2 }}/>
    </React.Fragment>
  );
});

export default function AlertDialog(props) {
  
  const renderPage = () => {
    if(props.option === "openFolder"){
      
      if(props.data === "content_folder"){
        return <Contents folder={props.selectedItem ? props.selectedItem.id : null}/>
      }
      else if(props.data === "station_zone"){
        return <Stations folder={props.selectedItem ? props.selectedItem.id : null}/>
      }
      else if(props.data === "campaign_folder"){
        return <Campaigns folder={props.selectedItem ? props.selectedItem.id : null}/>
      }
      else if(props.data === "advertisement_folder"){
        return <Campaigns ads={true} folder={props.selectedItem ? props.selectedItem.id : null}/>
      }
      else if(props.data === "campaign" || props.data === "advertisement"){

        var currentCampaign = props.allCampaign.filter(val=> {
          if(val.advertisement && val.advertisement === props.selectedItem.id){
            return val
          }
          else
          {
            return undefined
          }
        })

        return <ListStations selectedItem={props.selectedItem} allCampaign={currentCampaign} selectedStations={props.selectedItem.station ? props.selectedItem.station : []} listOnly={true} ads={props.data === "advertisement" ? true : false}/>
      }
    }
  }

  return (
    <div >
      <Dialog
        fullScreen={props.fullScreenDialog}
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >

        <DialogTitle style={{ minWidth: 200 }} id="customized-dialog-title" onClose={props.handleClose} data={props.data}>
          {props.title}
        </DialogTitle>

        {props.description !== "" ?
          <Typography style={{ padding: 18 }} id="alert-dialog-description">
            {props.description}
          </Typography>
        :null}
        {props.option=== "info" ? 
        <Table>
            <TableBody>
              {props.displayInfo.map((cell, index)=>{
                const labelCellId = `enhanced-table-cell-${index}`;
                
                if(cell.id === "created" || cell.id === "refreshed" || cell.id === "signed_in" || cell.id === "signed_out"){
                  return(
                    <TableRow key={labelCellId} >
                      <TableCell component="th" scope="row">
                        {cell.label}
                      </TableCell>
                      {props.selectedItem[cell.id] ? <TableCell component="th" scope="row">
                      {new Intl.DateTimeFormat('en-GB', {year: 'numeric',day: '2-digit',  month: 'long' ,hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }).format(props.selectedItem[cell.id])}
                      </TableCell> : <TableCell component="th" scope="row"></TableCell>}
                    </TableRow>)
                }
                else if(cell.id === "size" || cell.id === "campaign_size" ){
                  return(
                    <TableRow key={labelCellId} >
                      <TableCell component="th" scope="row">
                        {cell.label}
                      </TableCell>
                      <TableCell key={labelCellId}  component="th" scope="row">
                      {bytesToSize(props.selectedItem[cell.id])}
                      </TableCell>
                    </TableRow>
                    )
                }
                else if(cell.id === "in_use"){

                  var newRows = [];
                    newRows = props.allCampaign.filter(item => {
                      if(item.content){
                        if(item.content.map(val => val.id).indexOf(props.selectedItem.id) !== -1){
                          return item
                        }
                        else
                        {
                          return undefined
                        }
                      }else
                      {
                        return undefined
                      }
                    })

                  return(
                    <TableRow key={labelCellId} >
                      <TableCell component="th" scope="row">
                        {cell.label}
                      </TableCell>
                      <TableCell key={labelCellId}  component="th" scope="row">
                        {newRows.length > 0  ? 
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
                      </TableCell>
                    </TableRow>
                    )
                }
                else if(cell.id === "campaign"){
                  
                  
                  return(
                    <TableRow key={labelCellId} >
                      <TableCell component="th" scope="row">
                        {cell.label}
                      </TableCell>
                      <TableCell key={labelCellId}  component="th" scope="row">
                        {props.selectedItem[cell.id] ? 
                        <Grid style={{ display:'flex', flexDirection:"column"}}>
                            <Typography key={index} variant="body2">{props.allCampaign.map(val=> val.id).indexOf(props.selectedItem[cell.id]) !== -1 ? props.allCampaign[props.allCampaign.map(val=> val.id).indexOf(props.selectedItem[cell.id])].name : ''}</Typography>
                          </Grid>: null}
                      </TableCell>
                    </TableRow>
                    )
                }
                else if(cell.id === "advertisement"){
                  
                  
                  return(
                    <TableRow key={labelCellId} >
                    <TableCell component="th" scope="row">
                      {cell.label}
                    </TableCell>
                    <TableCell key={labelCellId}  component="th" scope="row">
                      {props.selectedItem[cell.id] ? 
                      <Grid style={{ display:'flex', flexDirection:"column"}}>
                          <Typography key={index} variant="body2">{props.allAds.map(val=> val.id).indexOf(props.selectedItem[cell.id]) !== -1 ? props.allAds[props.allAds.map(val=> val.id).indexOf(props.selectedItem[cell.id])].name : ''}</Typography>
                        </Grid>: null}
                    </TableCell>
                  </TableRow>
                  )
                }
                else if(cell.id === "publish"){
                  return (<TableRow key={labelCellId} >
                    <TableCell component="th" scope="row">
                        {cell.label}
                      </TableCell>
                      <TableCell key={labelCellId}  component="th" scope="row">
                                  {props.selectedItem[cell.id] ? 
                                  <IconButton>
                                    <CheckCircleIcon color="primary" fontSize="small"/>
                                  </IconButton>:
                                  <IconButton>
                                    <CancelIcon color="error" fontSize="small"/>
                                  </IconButton>}
                                </TableCell>
                  </TableRow>)
              
                }
                else if(cell.id === "campaign_status"){
                  return (<TableRow key={labelCellId} >
                    <TableCell component="th" scope="row">
                        {cell.label}
                      </TableCell>
                      <TableCell key={labelCellId}  component="th" scope="row">
                                  {props.selectedItem[cell.id] != null ? 
                        <IconButton>
                          <FiberManualRecordIcon style={{ color: props.selectedItem[cell.id] ? "#6bce00" : "#b4b4b4"}} fontSize="small"/>
                        </IconButton>:
                        <IconButton>
                          <RadioButtonUncheckedIcon style={{ color: "#b4b4b4"}} fontSize="small"/>
                        </IconButton>}
                      </TableCell>
                  </TableRow>)
                }
                else if(cell.id === "status"){
                                
                  return(<TableRow key={labelCellId} >
                    <TableCell component="th" scope="row">
                        {cell.label}
                      </TableCell>
                      <TableCell key={labelCellId}  component="th" scope="row">
                        {props.selectedItem[cell.id]? 
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
                      </TableCell>
                  </TableRow>)
                }
                else if(cell.id === "is_playing"){
                                
                  return(<TableRow key={labelCellId} >
                    <TableCell component="th" scope="row">
                        {cell.label}
                      </TableCell>
                      <TableCell key={labelCellId}  component="th" scope="row">
                        {props.selectedItem[cell.id]? 
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
                      </TableCell>
                  </TableRow>)
                }
                else if(cell.id === "campaign_duration"){
                  
                  return (<TableRow key={labelCellId} >
                    <TableCell component="th" scope="row">
                        {cell.label}
                      </TableCell>
                      <TableCell key={labelCellId}  component="th" scope="row">
                      {props.selectedItem.content ? 
                                  props.secondsToHms(props.selectedItem[cell.id])
                                  :
                                  null}
                      </TableCell>
                  </TableRow>)
                }
                else if(cell.id === "folder"){
                  
                  var currentFolder = props.allFolder.map(val => val.id).indexOf(props.selectedItem.folder)

                  return (<TableRow key={labelCellId} >
                    <TableCell component="th" scope="row">
                        {cell.label}
                      </TableCell>
                      <TableCell key={labelCellId}  component="th" scope="row">
                      {currentFolder !== -1 ? 
                                  props.allFolder[currentFolder].name
                                  :
                                  null}
                      </TableCell>
                  </TableRow>)
                }


                return(
                  <TableRow key={labelCellId} >
                    <TableCell component="th" scope="row">
                      {cell.label}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Grid style={{overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200}} >
                        <Typography variant="body2" noWrap={true}>{props.selectedItem[cell.id]}</Typography>
                      </Grid>
                    </TableCell>
                  </TableRow>
                  
                )
              })}
            </TableBody>
        </Table> : null}

        {props.option === "preview" ? 
            props.selectedItem.type === "video/mp4" ? <Grid style={{ backgroundColor: "black", padding: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <ReactPlayer controls url={props.selectedItem.url}/>
            </Grid>:
            <Grid key={props.selectedItem.id}  style={{ height: "100%", width: props.matches ? 450 : 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img style={{ width: "100%", height: "100%", objectFit: 'contain'}} alt={props.selectedItem.name} src={props.selectedItem.url}/>
            </Grid>
              :null}

        {props.data !== "campaign" && props.option === "edit" ? 
        props.data === "advertisement" ? null : 
        <Grid container style={{  paddingTop: 10, paddingBottom: 10, display: "flex", flexDirection: "row" }}>
            {props.editCells.map((cell, index)=>{ 

              var sizeMd = 6;

              if(index === props.editCells.length - 1){
                if((index+1) % 2 !== 0){
                  sizeMd = 12;
                } 
              }

              return(
                <Grid xs={12} md={sizeMd} style={{  padding: 10, display: "flex", justifyContent: "center", alignItems: "center"}} items >
                  <TextField
                    key={"textfield-input-"+index}
                    label={cell.label}
                    style={{ width: "100%"}}
                    value={props.selectedItem[cell.id]}
                    onChange={(e)=>props.onChangeHandle(e, cell.id)}
                    variant="outlined"/></Grid>
                  )}) }
            </Grid>
        : null}

        {props.data !== "campaign" && props.option === "addItem"? 
            props.data === "advertisement" ? null : 
          <Grid container style={{  paddingTop: 10, paddingBottom: 10, display: "flex", flexDirection: "row" }}>
            {props.addCells ? props.addCells.map((cell, index)=>{ 

              var sizeMd = 6;

              if(index === props.addCells.length - 1){
                if((index+1) % 2 !== 0){
                  sizeMd = 12;
                } 
              }
              

              return(   
                <Grid xs={12} md={sizeMd} style={{  padding: 10, display: "flex", justifyContent: "center", alignItems: "center"}} items >
              <TextField
                key={"textfield-input-"+index}
                label={cell.label}
                style={{ width: "100%"}}
                value={props.addItem[cell.id]}
                onChange={(e)=>props.onChangeAddItemHandle(e, cell.id)}
                variant="outlined"/></Grid>
              )}):null }
        </Grid>
        : null}

        {props.dialogLoading ? 
        <Grid style={{ padding: 20, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress 
              disableShrink
              color="primary" />
        </Grid> : null}

        {!props.dialogLoading && props.option === "move"? props.folderData ? 
        <Grid>
        <ListItem button style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)', borderTop: '1px solid rgba(0, 0, 0, 0.1)', width: "100%" }} key={"ListItem-null"} onClick={()=>props.selectFolder(null)} >
          <Typography color="primary" style={{ fontWeight: 'bold' }}>Default</Typography>
        </ListItem>
        {props.folderData.sort((a, b) => (a.name < b.name ? -1 : 1)).map((cell, index)=>{
          return(
            <ListItem button style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)',  width: "100%"}} key={"ListItem-"+index} onClick={()=>props.selectFolder(cell)} >
              <ListItemText primary={cell.name} />
            </ListItem>
          )
        })}
        </Grid>
        :null : null }

        {!props.dialogLoading && props.option === "moveAll"? props.folderData ? 
        <Grid>
        <ListItem button style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)', borderTop: '1px solid rgba(0, 0, 0, 0.1)', width: "100%"}} key={"ListItem-null"} onClick={()=>props.selectFolderMoveAll(null)} >
          <Typography color="primary" style={{ fontWeight: 'bold' }}>Default</Typography>
        </ListItem>
        {props.folderData.sort((a, b) => (a.name < b.name ? -1 : 1)).map((cell, index)=>{
          return(
            <ListItem button style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)', width: "100%"}} key={"ListItem-"+index} onClick={()=>props.selectFolderMoveAll(cell)} >
              <ListItemText primary={cell.name} />
            </ListItem>
          )
        })}
        </Grid>
        :null : null }
        
        {renderPage()}

        {(props.data === "campaign" || props.data === "advertisement") && props.option === "addItem" ? <AddEditCampaign {...props} folder={props.folder} handleClose={props.handleClose}/> : null }

        {(props.data === "campaign"  || props.data === "advertisement") && props.option === "edit" ? <AddEditCampaign {...props}  option={props.option} selectedItem={props.selectedItem} handleClose={props.handleClose}/> : null }
        
        {props.component ? props.component : null}

        {(props.data === "campaign" || props.data === "advertisement") && props.option === "addItem" ? null : props.agreeButton ? <DialogActions>
          <Button variant="outlined" style={{ fontSize: 14, fontWeight: 'bold'}} onClick={props.handleClose} color="primary">
          {props.disagreeTxt}
          </Button>
          <Button disableElevation variant="contained" style={{ fontSize: 14, fontWeight: 'bold'}} onClick={props.handleAgree} color="primary" autoFocus>
          {props.agreeTxt}
          </Button>
          
        </DialogActions> : null} 

      </Dialog>
    </div>
  );
}