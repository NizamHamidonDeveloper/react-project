import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';

export default function ContentPreview(props){

    const [count, setCount] = React.useState(0);
    const videoRef = React.useRef(null);

    useEffect(() => {

        if(props.rows.length > 1){
            if(props.withinDateTime(props.rows[count].start_date, 
                props.rows[count].end_date, 
                props.rows[count].start_time, props.rows[count].end_time))
                {
                    if(props.rows[count].type === "image/jpeg"){
                        const timer = setTimeout(() => {
                        
                            if(count === props.rows.length - 1){
                                let newCount = 0;
                            
                                setCount(newCount)
                            }
                            else
                            {
                                let newCount = count + 1;
                            
                                setCount(newCount)
                            }
                            
                        }, props.rows[count].duration*1000);
                        return () => clearTimeout(timer);
                    }
                    else
                    {
                        videoRef.current.play()
                    }
                }
                else{
                    if(count === props.rows.length - 1){
                        let newCount = 0;
                    
                        setCount(newCount)
                    }
                    else
                    {
                        let newCount = count + 1;
                    
                        setCount(newCount)
                    }
                }
            
        }
        else
        {
            if(props.rows[count].type === "video/mp4"){
                videoRef.current.play()
            }
        }

    }, [count, props]);

    const videoEnd = (e) => {
        
        if(count === props.rows.length - 1){
            let newCount = 0;
        
            setCount(newCount)

            if(props.rows.length === 1){
                if(props.rows[count].type === "video/mp4"){
                    videoRef.current.play()
                }
            }
        }
        else
        {
            let newCount = count + 1;
        
            setCount(newCount)
        }
    }

    
    return(
        <Grid style={{ width: 1080/4, height: 1920/4, display: "Flex", alignItems: "center"}}>
            {props.rows.map((val, index)=>{
                if(val.type === "image/jpeg"){
                    return (<img key={"img"+ index} style={{ display: count===index? "flex": "none" ,  position:"absolute"  }} width={"100%"} alt={val.name} src={val.url}/>)
                }
                else
                {
                    return (<video ref={count===index?videoRef: null} key={"video"+ index}  onEnded={videoEnd} style={{  display: count===index? "flex": "none" ,  position:"absolute"  }} width={"100%"} alt={val.name} src={val.url}/>)
                }
            })}
        </Grid>
    )

}