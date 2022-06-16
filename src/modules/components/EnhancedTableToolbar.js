import React from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputIcon from '@material-ui/icons/Input';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';

//Table Toolbar
const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
}));

export default function EnhancedTableToolbar(props){

    const classes = useToolbarStyles();
    const { numSelected, onClickDeleteAll, addItemText, addItemIcon, addItemButton, onClickAddItem, onClickMoveAll, type, downloadExcel, onClickDownloadExcel } = props;
  
    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
           
          </Typography>
        )}

        {
          props.selectStation === true && props.listOnly !== true? 
          <Button onClick={()=>props.handleSetStation(props.selected)} variant="outlined" color="inherit" style={{  whiteSpace:'nowrap', marginRight: 10 }}>
            Confirm
          </Button>
          :null
        }
  
        {numSelected > 0 && props.control ? (
          <Grid style={{ paddingRight: 10, display:"flex", flexDirection: "row" }}>
            {type === "folder" ? null : props.selectContent === true ? null : <Tooltip title="Move" style={{  paddingRight: 10 }} >
              <IconButton style={{ display: props.disabledMove? "none": "flex" }} aria-label="move" onClick={onClickMoveAll}>
                <InputIcon />
              </IconButton>
            </Tooltip>}
            {props.selectContent === true? 
            <Button onClick={props.handleSetRows} startIcon={addItemIcon} variant="outlined" color="inherit" style={{  whiteSpace:'nowrap', marginRight: 10 }}>
              Confirm
            </Button>
            
            :<Tooltip title="Delete">
              <IconButton  style={{ display: props.disabledDelete? "none": "flex" }} aria-label="delete" onClick={onClickDeleteAll}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>}
          </Grid>
        ) : 
        <Grid style={{ display: "flex", flexDirection:"row", paddingRight: 10 }}>
        {addItemButton ? 
          <Tooltip title={addItemText}>
            <Button onClick={onClickAddItem} startIcon={addItemIcon} disableElevation variant="contained" color="primary" style={{  whiteSpace:'nowrap', marginRight: 10 }}>
              {addItemText}
            </Button>
          </Tooltip>
        : null}
        {downloadExcel ? 
            <Button onClick={onClickDownloadExcel} startIcon={<GetAppIcon/>} disableElevation variant="contained" color="primary" style={{  whiteSpace:'nowrap' }}>
              {"Export Excel"}
            </Button>
        : null}
        </Grid>}
      </Toolbar>
    );
};
  
EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};