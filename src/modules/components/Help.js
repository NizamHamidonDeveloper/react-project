import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SupportForm from './SupportForm'
import { saveAs } from 'file-saver';
import Dialog from './Dialog'

export default function Index(props){

    const [agreeButton, setAgreeButton] = React.useState(false);
    const [dialogTitle, setDialogTitle] = React.useState("");
    const [option, setOptions] = React.useState("");
    const [dialogDes, setDialogDes] = React.useState("");
    const [fullScreenDialog, setFullScreenDialog] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const onClickDownloadUserManual = () => {
        setAgreeButton(true)
        setDialogTitle("Download User Manual")
        setOptions("downloadUserManual")
        setDialogDes("")
        setFullScreenDialog(false)
        setOpenDialog(true)
    }

    const onClickSupportForm = () => {
        setAgreeButton(true)
        setDialogTitle("Contact Support")
        setOptions("contactSupport")
        setDialogDes("")
        setFullScreenDialog(false)
        setOpenDialog(true)
    }

    const handleAgree = () => {

        if(option === "downloadUserManual"){
            saveAs("https://firebasestorage.googleapis.com/v0/b/smrt-b5bb9.appspot.com/o/user%20manual%2FSMRT-CMS-UserManual-20May21-V2.pdf?alt=media&token=338a1b5f-b2dd-4c39-a37f-c6c1464f3238", "user_manual.pdf");
        }else{

        }

        setOpenDialog(false)
    }

    return(
        <Grid style={{ padding: 20, display: "flex", flexDirection: 'column', maxWidth: 300 }}>
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
            <Button disableElevation onClick={onClickDownloadUserManual} variant="contained" color="primary">
            Download User Manual
            </Button>
            <Button style={{ marginTop: 10 }} onClick={onClickSupportForm} disableElevation variant="contained" color="primary">
            Contact Support
            </Button>
            <Typography variant="body2" style={{ marginTop: 10 }} >Email: support@pgkdigital.com</Typography>
        </Grid>
    )
}