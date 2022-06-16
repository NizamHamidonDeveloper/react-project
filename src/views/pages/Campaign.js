import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import Campaigns from './Campaign/Campaigns';
import Folder from './Campaign/Folder';
import PageHeader from '../../modules/components/PageHeader';

//tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    background: '#eaeff1',
  }
})

class Index extends Component {

  state = {
    value: 0
  }

  handleChange = (event, newValue) => {
    this.setState({ value: newValue })
  }

  render(){

    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <PageHeader title="Campaign"/>
        <AppBar
            component="div"
            className={classes.secondaryBar}
            color="primary"
            position="static"
            elevation={0}
            style={{ marginTop: -10 }}
        >
            <Tabs value={this.state.value} onChange={this.handleChange} textColor="inherit">
                <Tab textColor="inherit" label="Campaigns"  {...a11yProps(0)}/>
                <Tab textColor="inherit" label="Folder"  {...a11yProps(1)}/>
            </Tabs>
        </AppBar>
        <TabPanel value={this.state.value} index={0}>
            <Campaigns/>
        </TabPanel>
        <TabPanel value={this.state.value} index={1}>
            <Folder/>
        </TabPanel>
        
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Index);