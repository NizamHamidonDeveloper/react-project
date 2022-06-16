import React, { useEffect } from "react";
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import CircularProgress from '@material-ui/core/CircularProgress'
//import EmailValidator from 'email-validator';
import app from "../../firebase/base";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://pgkdigital.com/">
      PGK Digital Networks
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const styles = theme => ({
  root: {
    display:"flex",
    justifyContent: "center",
    padding: 20
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 3),
  },
  paper: {
    margin: theme.spacing(4, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
});

function SignIn(props) {

  const classes = props.classes;
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isChecked, setIsChecked] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const [isEmail, setIsEmail] = React.useState(true);
  const [isPassword, setIsPassword] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState("Please try logging again");
  const [errorMsgEnaled, setErrorMsgEnaled] = React.useState(false);

  useEffect(() => {

    if (localStorage.checkbox && localStorage.username !== "") {         
      setIsChecked(true)
      setPassword(localStorage.password)
      setEmail(localStorage.username)
      setLoading(false)
    }
    else
    {
      setLoading(false)
    }

  }, []);

  const handleSignIn = async (event) => {

    event.preventDefault();

    setErrorMsg("Please try logging again")
    setErrorMsgEnaled(false)
    const email_result = true;
    var password_result = false;

    if(password.length > 6)
    {
      password_result = true;
      setIsPassword(true)
    }
    else
    {
      setIsPassword(false)
    }

    if(email_result)
    {
      setIsEmail(true)
    }
    else
    {
      setIsEmail(false)
    }
    
    if (isChecked && password_result === true && email_result === true) {
      localStorage.username = email
      localStorage.password = password
      localStorage.checkbox = isChecked
    }
    else
    {
      localStorage.username = ""
      localStorage.password = ""
      localStorage.checkbox = false
    }

    if(email_result === true && password_result === true){
      
      setLoading(true)

      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email, password);
          
      } catch (error) {
        
        setErrorMsg(error.message)
        setErrorMsgEnaled(true);
        setLoading(false)
      }
    }

  }

  const onChangeCheckbox = (event) => {
    setIsChecked(event.target.checked)
  }

  const passwordhandleChange = (event) => {
    setPassword(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item component={Paper} elevation={0} style={{ width: 400, marginTop: 50, boxShadow: "0px 0px 20px 0px #e8e8e8" }}>
        <Grid style={{ display: 'flex', justifyContent: "space-between", height: 120, backgroundColor: "#d4dbf9", borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
          
          <Grid>
            <Typography color="primary" variant='body1' style={{  marginLeft: 30, marginTop: 20, fontWeight: "bold"}}>
              Welcome back!
            </Typography>
            <Typography color="primary" variant='body2' style={{  marginLeft: 30 }}>
              Sign in to continue
            </Typography>
          </Grid>
          
          <img height="100%" src="assets/login/profile-img.png" alt="top-login-bg" />
        </Grid>
        <Grid style={{ display: 'flex', justifyContent: "center", alignItems: 'center', position: "absolute", backgroundColor: "#eff2f7", width: 80, height: 80, marginLeft: 30, marginTop: -40, borderRadius: 50 }}>
          <LockIcon fontSize="large"/>
        </Grid>
        <div className={classes.paper}>
          
          {loading ? 
          
          <div style={{ display: 'flex',  justifyContent:'center', alignItems:'center', marginTop: 70, marginBottom: 70  }}>
              <CircularProgress 
                disableShrink
                color="primary" />
          </div>
          
          : 
          
          <form className={classes.form} onSubmit={handleSignIn}>
              {errorMsgEnaled ? <Grid style={{ marginTop: 15, display: 'flex', justifyContent: 'center', alignItems: "center"}} >
                <Typography style={{ textAlign: "center"}} align="center" color="error" variant='body2'>
                  {errorMsg}
                </Typography> 
              </Grid>:null}
               
              <Typography variant='body2' style={{ marginTop: 20}}>
                Email
              </Typography>
              <TextField
                error={isEmail? false: true}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                size="small"
                style={{ marginTop: 5}}
                value={email}
                onChange={handleEmailChange}
              />
              <Typography variant='body2' style={{ marginTop: 10 }}>
                Password
              </Typography>
              <TextField
                error={isPassword? false: true}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                type="password"
                id="password"
                size="small"
                style={{ marginTop: 5}}
                value={password}
                onChange={passwordhandleChange}
              />
              <FormControlLabel
                control={<Checkbox checked={isChecked} value="remember" color="primary"  onChange={onChangeCheckbox}/>}
                label={<Typography variant="body2">Remember me</Typography>}
              />
            
              <Button
                style={{textTransform: 'none'}}
                fullWidth
                color="primary"
                variant="contained"
                className={classes.submit}
                disableElevation
                type="submit"
              >
              Log In
              </Button>
              <Grid>
                  <Typography color="primary"  variant="caption">
                    <Link color="inherit" href='/forgotpassword'>Forgot Password</Link>
                  </Typography>
              </Grid>

              <Grid style={{ display: 'flex', justifyContent: "center", marginTop: 20 }}>
              <img height="25" src="assets/logo/PGK-Logo-black.png" alt="PGK logo"/>
              </Grid>
              
              
              <Grid style={{ display: 'flex', justifyContent: "center", marginTop: 20 }}>
                <Copyright />
              </Grid>
          </form>}
        </div>
      </Grid>
    </Grid>);
}

SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);