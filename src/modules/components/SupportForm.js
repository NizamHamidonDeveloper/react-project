import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MuiPhoneInput from 'material-ui-phone-number';
//import EmailValidator from 'email-validator';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent:"center",
    width:"100%"
  }
});

export default function MediaCard(props) {
  const classes = useStyles();
  const [name, setName] =  React.useState("");
  const [lastname, setLastname] =  React.useState("");
  const [phone, setPhone] =  React.useState("");
  const [email, setEmail] =  React.useState("");
        
  const [isname, setIsname] =  React.useState(true);
  const [islastname, setIslastname] =  React.useState(true);
  const [isphone, setIsphone] =  React.useState(true);
  const [isemail, setIsemail] =  React.useState(true);


  /*const hancleClick = (event) => {

    const result = EmailValidator.validate(email);
    var phone_result = false;
    var name_result = false;
    var last_name_result = false;
    var gender_result = false;

    if(phone.length > 7)
    {
      phone_result = true;
      setIsphone(true)
    }
    else
    {
      setIsphone(false)
    }

    if(name.length > 2)
    {
      name_result = true;
      setIsname(true)
    }
    else
    {
      setIsname(false)
    }

    if(lastname.length > 2)
    {
      last_name_result = true;
      setIslastname(true)
    }
    else
    {
      setIslastname(false)
    }


    if(result === false){
      setIsemail(false)
    }
    else{
      setIsemail(true)
    }

    if(result === true && phone_result === true && name_result === true && gender_result === true && last_name_result === true){
      
    }

  }*/

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleLastNameChange = (event) => {
    setLastname(event.target.value)
  }

  const handlePhoneChange = (value) => {
    setPhone(value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }
  
  
    return (
        <div className={classes.root}>
            <Grid style={{ padding: 20 }}>
            <Grid style={{ maxWidth: 500, width: "100%", marginTop: 15 }}>
              <Grid container spacing={2}>
                <Grid md={6} item xs={12}>
                  <TextField
                      error={isname ?false: true}
                      autoFocus
                      id="name"
                      value={name}
                      onChange={handleNameChange}
                      label="First Name"
                      variant="outlined"
                      fullWidth
                      helperText={islastname ? "":"Incorrect First Name."}
                    />
                </Grid>
                <Grid md={6} item xs={12}>
                  <TextField
                      error={islastname ?false: true}
                      id="last_name"
                      variant="outlined"
                      value={lastname}
                      onChange={handleLastNameChange}
                      label="Last Name"
                      fullWidth
                      helperText={islastname ? "":"Incorrect Last Name."}
                    />
                </Grid>
              </Grid>

                  <Grid item xs={12}>
                      <MuiPhoneInput
                      autoFormat={false}
                      error={isphone ?false: true}
                        style={{ width: '100%', marginTop: 15 }}
                        defaultCountry='sg'
                        regions={'asia'}
                        value={phone}
                        onChange={handlePhoneChange}
                      />
                    </Grid>
                  <Grid container style={{ marginTop: 15 }} spacing={2}>
                    <Grid item  xs={12}>
                      <TextField
                        error={isemail ?false: true}
                        
                        id="email"
                        variant="outlined"
                        value={email}
                        onChange={handleEmailChange}
                        label="Email Address"
                        type="email"
                        fullWidth
                        helperText={isemail ? "":"Incorrect email."}
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ marginTop: 15 }} spacing={2}>
                    <Grid item  xs={12}>
                      <TextField
                        id="comments"
                        variant="outlined"
                        label="Comments"
                        fullWidth
                        multiline
                        rows={4}
                      />
                    </Grid>
                  </Grid>

            </Grid>
            </Grid>
        </div>
      );
  

  
}