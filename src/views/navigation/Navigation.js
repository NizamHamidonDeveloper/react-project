import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Navigator from './Navigator';
import Header from '../header/Header';
import Grid from '@material-ui/core/Grid';

function Copyright() {
  return (
    <Grid style={{ display: "flex", justifyContent:"center" }}>
      <Typography variant="caption" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://pgkdigital.com/">
          PGK Digital Networks
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Grid>
    
  );
}

const drawerWidth = 150;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    position: "absolute",
    left: "0",
    width: "100%",
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  app: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    background: '#eaeff1',
  },
  footer: {
    padding: theme.spacing(2),
    background: '#eaeff1',
  },
}));

export default function Index(props) {

  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  };
  
  return (
    <Grid className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer}>
        <Hidden smUp implementation="js">
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        </Hidden>
        <Hidden xsDown implementation="css">
          <Navigator onClose={handleDrawerToggle} PaperProps={{ style: { width: drawerWidth } }} />
        </Hidden>
      </nav>
      <Grid className={classes.app}>
        <Header onDrawerToggle={handleDrawerToggle} />
        <main className={classes.main}>
          {props.component}
        </main>
        <footer className={classes.footer}>
          <Copyright />
        </footer>
      </Grid>
    </Grid>
  )
}

