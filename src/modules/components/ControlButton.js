import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import InputIcon from '@material-ui/icons/Input';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';
import PreviewIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon from '@material-ui/icons/Info';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import Tooltip from '@material-ui/core/Tooltip';
import StayPrimaryPortraitIcon from '@material-ui/icons/StayPrimaryPortrait';
import Grid from '@material-ui/core/Grid';

export default function ControlButton(props){
    return(
      <Grid>
        {props.data === "content" ? <Tooltip title="Preview">
          <IconButton component="div" color="primary" onClick={() => props.onClickPreview(props.row)}>
              <PreviewIcon fontSize="small" />
          </IconButton>
        </Tooltip> : null }
        {props.type === "folder" ? <Tooltip title="Enter Folder">
          <IconButton component="div" color="primary" onClick={() => props.onClickOpenFolder(props.row)}>
              <FolderIcon fontSize="small" />
          </IconButton>
        </Tooltip> : null }
  
        {props.data === "station" ? <Tooltip title="Refresh">
          <IconButton component="div" color="primary" onClick={() => props.onClickRefresh(props.row)}>
              <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip> : null }

        {props.data === "station" ? <Tooltip title="Update">
          <IconButton component="div" color="inherit" style={{ opacity: 0.5 }}  onClick={() => props.onClickUpdate(props.row)}>
              <SystemUpdateAltIcon fontSize="small" />
          </IconButton>
        </Tooltip> : null }

        {props.data === "station" ? <Tooltip title="Restart">
          <IconButton component="div" color="inherit" style={{ opacity: 0.5 }}  onClick={() => props.onClickRestart(props.row)}>
              <AutorenewIcon fontSize="small" />
          </IconButton>
        </Tooltip> : null }
        

        {props.data === "campaign" || props.data === "advertisement" ? <Tooltip title="Publish">
          <IconButton component="div" color={props.row.publish ? "primary":"inherit"} style={{ opacity: props.row.publish ? 1:0.5 }}  onClick={() => props.onClickPublish(props.row)}>
              <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip> : null }

        {props.data === "campaign" || props.data === "advertisement" || props.data === "station" ? <Tooltip title="Preview">
          <IconButton  style={{ opacity: .5 }} color="inherit" component="div" onClick={() => props.onClickPreviewCampaign(props.row)}>
            <PreviewIcon fontSize="small" />
          </IconButton>
        </Tooltip> : null }

        {props.data === "campaign" || props.data === "advertisement"  ? <Tooltip title="Station">
          <IconButton component="div" color={"inherit"} style={{ opacity: 0.5 }}  onClick={() => props.onClickListStation(props.row)}>
              <StayPrimaryPortraitIcon fontSize="small" />
          </IconButton>
        </Tooltip> : null }
  
        <Tooltip title="Info">
          <IconButton component="div" style={{ opacity: .5 }} color="inherit" onClick={() => props.onClickInfo(props.row)}>
              <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {props.type === "folder" ? null : <Tooltip title="Move">
          <IconButton component="div" style={{ display: props.disabledMove? "none": "normal", opacity: .5 }} color="inherit" onClick={() => props.onClickMove(props.row)}>
              <InputIcon fontSize="small" />
          </IconButton>
        </Tooltip>}
        <Tooltip title="Edit">
          <IconButton disabled={props.disabledEdit} component="div" style={{ opacity: .5 }} color="inherit" onClick={() => props.onClickEdit(props.row)}>
              <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
            <IconButton disabled={props.disabledDelete} component="div" style={{ opacity: .5 }} color="inherit" onClick={() => props.onClickDelete(props.row)}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        </Tooltip>
      </Grid>
    )
}