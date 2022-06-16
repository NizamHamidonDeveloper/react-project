import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';
import app from "../../firebase/base";
import ListAltIcon from '@material-ui/icons/ListAlt';
import StayPrimaryPortraitIcon from '@material-ui/icons/StayPrimaryPortrait';
import ImageIcon from '@material-ui/icons/Image';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import PersonIcon from '@material-ui/icons/Person';
import PhotoAlbumIcon from '@material-ui/icons/PhotoAlbum';
import firebase from "firebase";

const categories = [
  {
    id: 'Manage',
    children: [
      { id: 'Content', icon: <ImageIcon />, active: true, url: 'content' },
      { id: 'Campaign', icon: <ListAltIcon />, url: 'campaign' },
      { id: 'Ads', icon: <PhotoAlbumIcon />, url: 'advertisement' },
      { id: 'Station', icon: <StayPrimaryPortraitIcon />, url: 'station' },
      { id: 'Admin', icon: <PersonIcon />, url: 'admin' },
    ],
  }
];

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#061A26',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});

function Navigator(props) {
  const { classes, staticContext,  ...other } = props;
  const path = props.location.pathname.slice(1);
  const [open, setOpen] = React.useState(false);
  const [backdropOpen, setBackdropOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignout = () => {

    if(app.auth().currentUser.email !== "support@pgkdigital.com"){
      firebase.database().ref('user/' + app.auth().currentUser.uid).update({ signed_out: firebase.database.ServerValue.TIMESTAMP  })
    }

    setBackdropOpen(true)

    app.auth().signOut().then(() => {
      setBackdropOpen(false)
    }).catch((error) => {
      setBackdropOpen(false)
    });

    setOpen(false);
  };
  
  return (
    <div>
    <Backdrop className={classes.backdrop} open={backdropOpen}>
      <CircularProgress 
        disableShrink
        color="inherit" />
    </Backdrop>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography style={{ fontSize: 24, fontWeight: 'bold'}}>Logout</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You will be returned to the login screen
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" style={{ fontSize: 14, fontWeight: 'bold'}} onClick={handleClose} color="primary">
            No 
          </Button>
          <Button disableElevation variant="contained" style={{ fontSize: 14, fontWeight: 'bold'}} onClick={handleSignout} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
    </Dialog>
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem  className={clsx(classes.firebase, classes.itemCategory)}>
          <img height={30} src="/assets/logo/PGK-Logo.png" alt="PGK Logo"/>
        </ListItem>
        
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active, url }) => (
              <ListItem
                key={childId}
                button
                className={path === url ? clsx(classes.item, true && classes.itemActiveItem) : clsx(classes.item, false && classes.itemActiveItem)}
                component={Link} to={'/' + url.toLowerCase()} 
                onClick={props.onClose}
              >
                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                >
                  {childId}
                </ListItemText>
              </ListItem>
            ))}

            <Divider className={classes.divider} />
          </React.Fragment>
        ))}

        <ListItem
          button
          style={{ marginTop: 10 }}
          className={clsx(classes.item, false && classes.itemActiveItem)}
          onClick={handleClickOpen}
        >
          <ListItemIcon className={classes.itemIcon}><ExitToAppIcon /></ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            {'Logout'}
          </ListItemText>
        </ListItem>
          </List>
    </Drawer>
    </div>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

const routeNavigator = withRouter(Navigator);

export default withStyles(styles)(routeNavigator);