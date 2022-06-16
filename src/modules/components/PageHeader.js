import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import AppBar from '@material-ui/core/AppBar';
import Dialog from './Dialog'
import SupportForm from './SupportForm'
import { saveAs } from 'file-saver';

export default function PageHeader(props){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [agreeButton, setAgreeButton] = React.useState(false);
    const [dialogTitle, setDialogTitle] = React.useState("");
    const [option, setOptions] = React.useState("");
    const [dialogDes, setDialogDes] = React.useState("");
    const [fullScreenDialog, setFullScreenDialog] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const onClickDownloadUserManual = () => {
        setAgreeButton(true)
        setDialogTitle("Download User Manual")
        setOptions("downloadUserManual")
        setDialogDes("")
        setFullScreenDialog(false)
        setOpenDialog(true)
        setAnchorEl(null);
    }

    const onClickSupportForm = () => {
        setAgreeButton(true)
        setDialogTitle("Contact Support")
        setOptions("contactSupport")
        setDialogDes("")
        setFullScreenDialog(false)
        setOpenDialog(true)
        setAnchorEl(null);
    }

    const handleAgree = () => {

        if(option === "downloadUserManual"){
            saveAs("https://firebasestorage.googleapis.com/v0/b/smrt-b5bb9.appspot.com/o/user%20manual%2FSMRT-CMS-UserManual-20May21-V2.pdf?alt=media&token=7f6ea5a8-3ceb-4db2-8460-5da8f58f9639", "user_manual.pdf");
        }else{

        }

        setOpenDialog(false)
    }

    return(
        <div>
            <Dialog 
                agreeTxt={option === "downloadUserManual"? "Download" : "Submit"}
                disagreeTxt={"Cancel"}
                description={dialogDes}
                title={dialogTitle}
                open={openDialog} 
                agreeButton={agreeButton}
                handleAgree={handleAgree}
                component={ option !== "downloadUserManual"?  <SupportForm/> : null}
                fullScreenDialog={fullScreenDialog}
                option={option}
                handleClose={handleCloseDialog}/>
                <AppBar
                    component="div"
                    color="primary"
                    position="static"
                    elevation={0}
                    style={{ marginTop: -10 }}
                    >
                    <Toolbar >
                        <Grid container alignItems="center" spacing={1}>
                            <Grid item xs>
                                <Typography color="inherit" variant="h5" component="h1">
                                    {props.title}
                                </Typography>
                            </Grid>
                            <Grid style={{ display: "none"}} item>
                                <Tooltip title="Help">
                                <Button startIcon={<HelpIcon />} color="inherit"  onClick={handleClick}>
                                    Help
                                </Button>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Toolbar>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem style={{ fontSize: 14 }} onClick={onClickDownloadUserManual}>Download User Manual</MenuItem>
                        <MenuItem style={{ fontSize: 14 }} onClick={onClickSupportForm}>Contact Support</MenuItem>
                        <MenuItem style={{ fontSize: 12 }} disabled>Email: support@pgkdigital.com</MenuItem>
                    </Menu>
            </AppBar>
        </div>
        
    )
}