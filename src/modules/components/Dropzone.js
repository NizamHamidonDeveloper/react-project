import React, {useMemo, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import {useDropzone} from 'react-dropzone'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import firebase from "firebase";

//styles
const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#d8d8d8',
    borderStyle: 'dashed',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};
  
const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #d8d8d8',
    marginBottom: 8,
    marginRight: 8,
    width: 70,
    height: 70,
    padding: 4,
    boxSizing: 'border-box'
};

 
const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

var upload_count = 0;
var stopUpload = false;
var uploading = false;

export default function Index(props) {

    const [files, setFiles] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [uploadTxt, setUploadTxt] = React.useState("Upload one or more files now");
    const [uploadComplete, setUploadComplete] = React.useState(true);
    const [mediaRef] = React.useState(firebase.storage().ref(props.data))
    const [mediaDatabaseRef] = React.useState(firebase.database().ref().child(props.data))

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: 'image/jpeg, video/mp4',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks
        return () => {
            stopUpload = true;
        };
    }, []);

    const thumbs = files.map((file, index) => {

        if(file.type === "video/mp4"){
            
            return(
                <Grid key={file.name+index} style={{ display:"flex", flexDirection: "column"}}>
                    <Grid style={{overflow: "hidden", textOverflow: "ellipsis", width: 70, marginBottom: 10}}>
                        <Typography variant="caption" noWrap={true}>{file.name}</Typography>
                    </Grid>
                    
                    <Grid style={thumb} key={file.name}>
                        <Grid style={{ display: "flex", justifyContent:'center', alignItems: 'center', width: "100%"}}>
                            <VideoLibraryIcon color="primary" style={{ fontSize: 36}}/>
                        </Grid>
                    </Grid>
                </Grid>
               
            )
        }
        else{
            return(
                <Grid key={file.name+index} style={{ display:"flex", flexDirection: "column"}}>
                    <Grid style={{overflow: "hidden", textOverflow: "ellipsis", width: 70, marginBottom: 10}}>
                        <Typography variant="caption" noWrap={true}>{file.name}</Typography>
                    </Grid>
                    
                    <Grid style={thumb} key={file.name}>
                        <Grid style={{ display: "flex", justifyContent:'center', alignItems: 'center', width: "100%", overflow: 'hidden'}}>
                            <img
                            src={file.preview}
                            style={img}
                            alt={file.name}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            )
        }
    });
    
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept,
    ]);

    const handleUploadSuccess = (metadata, filename) => {

        mediaRef
        .child(metadata.name)
        .getDownloadURL().then((url) => {

            if(metadata.contentType === "video/mp4"){
                var media = new Audio(url);

                media.onloadedmetadata = function(){

                    if(media.duration){

                        var newPostKey = mediaDatabaseRef.push().key;

                        var postData = {
                            id: newPostKey,
                            name: filename,
                            file_name: metadata.name,
                            url: url,
                            size: metadata.size,
                            created: firebase.database.ServerValue.TIMESTAMP,
                            type: metadata.contentType,
                            full_path: metadata.fullPath,
                            user: firebase.auth().currentUser.email,
                            duration: media.duration,
                            folder: props.folder ? props.folder : null
                        };
            
                        if(props.folder){
                            firebase.database().ref("content_folder/" + props.folder).update({ updated: firebase.database.ServerValue.TIMESTAMP})
                        }
                        
                    
                        var updates = {};
                        updates[newPostKey] = postData;
                    
                        mediaDatabaseRef.update(updates).then(()=>{
                            firebase.database().ref("log_content").push({  user: firebase.auth().currentUser.email, item: postData, action: "uploaded", updated: firebase.database.ServerValue.TIMESTAMP})
                            completedUpload();
                        })
                    }
                };    
            
            }
            else
            {

                var newPostKey = mediaDatabaseRef.push().key;

                var postData = {
                    id: newPostKey,
                    name:filename,
                    file_name: metadata.name,
                    url: url,
                    size: metadata.size,
                    created: firebase.database.ServerValue.TIMESTAMP,
                    type: metadata.contentType,
                    full_path: metadata.fullPath,
                    user: firebase.auth().currentUser.email,
                    folder: props.folder ? props.folder : null
                };

                if(props.folder){
                    firebase.database().ref("content_folder/" + props.folder).update({ updated: firebase.database.ServerValue.TIMESTAMP})
                }
    
                var updates = {};
                updates[newPostKey] = postData;
            
                mediaDatabaseRef.update(updates).then(()=>{
                    firebase.database().ref("log_content").push({  user: firebase.auth().currentUser.email, item: postData, action: "uploaded", updated: firebase.database.ServerValue.TIMESTAMP})
                    completedUpload();
                })
            }
        })
        
    }

    const completedUpload = () =>{
        
        if(stopUpload === false){
            upload_count++;
            uploadFiles();
        }
        else
        {
            uploading = false;
        }
    };

    const startUploadManually = () => {
        
        if(!uploading){
            stopUpload = false;
            upload_count = 0;
            setLoading(true)
            uploadFiles();
        }
        else
        {
            alert("Files uploading, please wait for a while...")
        }
    }

    const uploadFiles = () => {
        if(Array.from(acceptedFiles).length === upload_count){
            uploading = false;
            acceptedFiles.length = 0;
            setFiles([])
            setLoading(false)
            setUploadTxt("Upload completed")
            setUploadComplete(true)
        }else{
            uploading = true;
            var filename = Array.from(acceptedFiles)[upload_count].name;
            var upload_task = mediaRef.child(new Date().getTime() +"_"+Array.from(acceptedFiles)[upload_count].name).put(acceptedFiles[upload_count]);
            upload_task.then((snapshot) => {
                handleUploadSuccess(snapshot.metadata, filename);
            }).catch((error)=>{
                console.log(error.message)
            })

        }
    }

    const onClickClear = () => {
        acceptedFiles.length = 0;
        setFiles([])
    }

    return(
    
    <Grid style={{ padding: 20 }}>
        <Grid>
            {loading ? null : <Grid {...getRootProps({style})}>
                <input {...getInputProps()} />
                <Typography variant="body2">Drag 'n' drop some files here</Typography>
                <Typography variant="body2">or click to select files</Typography>
            </Grid>}
            <aside style={thumbsContainer}>
                {thumbs}
            </aside>
        </Grid>
        <Grid style={{ paddingBottom: 20  }}>
            <Typography color="initial" variant='caption'>
            Image/Jpeg/jpg - Size below 1MB
            </Typography>
            <br/>
            <Typography color="initial" variant='caption'>
            Video/Mp4 - Size below 20MB
            </Typography>
        </Grid>
        {!loading ? <Grid>
            <Button disabled={acceptedFiles.length > 0 ? false : true } onClick={onClickClear} variant="outlined" color="primary">
                Clear
            </Button>
            <Button disabled={acceptedFiles.length > 0 ? false : true } disableElevation onClick={startUploadManually} variant="contained" color="primary" style={{ marginLeft:10 }}>
                Upload
            </Button>
            <Typography color={uploadComplete ? "initial" : "error"} variant='caption' style={{ marginLeft: 20 }}>
            {uploadTxt}
            </Typography>
        </Grid> :
        <LinearProgress/>}
    </Grid>)
}
  