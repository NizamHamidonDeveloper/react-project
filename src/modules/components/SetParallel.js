import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import firebase from "firebase";
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Index(props){

    const [parallel, setParallel] = React.useState(1);
    const [loading, setLoading] = React.useState(true);

    const handleIntervalChange = (event) => {
        setParallel(event.target.value)
        
        firebase.database().ref('parallel').update({ interval: event.target.value })
    }
    
    useEffect(() => {
        let parallelRef = firebase.database().ref("parallel");

        parallelRef.once('value', snapshot => {
          if(snapshot.exists()){
            setParallel(snapshot.val().interval)
            setLoading(false)
          }
        })
    }, [props]);

    if(loading){
        return (
        <div style={{ display: 'flex',  justifyContent:'center', alignItems:'center', marginTop: 70  }}>
          <CircularProgress 
            disableShrink
            color="primary" />
        </div>);
    }

    return(
        <Grid style={{ padding: 20, display: "flex", flexDirection: 'column', maxWidth: 300 }}>
           <FormControl variant="outlined" style={{ width: "100%"}}>
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
    )
}