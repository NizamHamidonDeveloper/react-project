import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';
import Error from "./views/pages/Error";
import Navigation from "./views/navigation/Navigation";
import withRoot from "./modules/withRoot";
import app from "./firebase/base";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import firebase from "firebase";

// Pages
const Login = React.lazy(() => import('./views/authentication/Login'))
const ForgotPassword = React.lazy(() => import('./views/authentication/ForgotPassword'))
const Content = React.lazy(() => import('./views/pages/Content'))
const Campaign = React.lazy(() => import('./views/pages/Campaign'))
const Advertisement = React.lazy(() => import('./views/pages/Advertisement'))
const Station = React.lazy(() => import('./views/pages/Station'))
const Admin = React.lazy(() => import('./views/pages/Admin'))

function App() {

  const [authenticated, setAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {

    app.auth().onAuthStateChanged(user => {
      if (user) {
        setAuthenticated(true)
        setLoading(false)

        if(user.email !== "support@pgkdigital.com"){
          firebase.database().ref('user/' + user.uid).update({ signed_in: firebase.database.ServerValue.TIMESTAMP  })
        }
       
      } else {
        setAuthenticated(false)
        setLoading(false)
      }
    });

  }, []);

  const renderRoute = () => {
    return(
      <Switch>
        <Route exact path="/content" render={(props) => <Content {...props} />} />
        <Route path="/campaign" render={(props) => <Campaign {...props} />} />
        <Route path="/advertisement" render={(props) => <Advertisement {...props} />} />
        <Route path="/station" render={(props) => <Station {...props} />} />
        <Route path="/admin" render={(props) => <Admin {...props} />} />
        <Route path="/" render={() => (<Redirect to="/content" />)} />
        <Route path="*" component={Error} />
      </Switch>
    )
  }

  if(loading){
    return (
    <div style={{ display: 'flex',  justifyContent:'center', alignItems:'center', marginTop: 70  }}>
      <CircularProgress 
        disableShrink
        color="primary" />
    </div>);
  }

  if(authenticated){
    return (
      <BrowserRouter>
        <React.Suspense fallback={loading}>
          <Navigation component={renderRoute()}/>
        </React.Suspense>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <React.Suspense fallback={loading}>
        <Switch>
          <Route exact path="/login" render={(props) => <Login {...props} />} />
          <Route path="/forgotpassword" render={(props) => <ForgotPassword {...props} />} />
          <Route path="/" render={() => (<Redirect to="/login" />)} />
          <Route path="*" component={Error} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default withRoot(App);
