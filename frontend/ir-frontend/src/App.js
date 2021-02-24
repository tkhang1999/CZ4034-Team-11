import React, { useState } from "react";
import './App.css';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, Tab, Tabs, AppBar, Toolbar, CssBaseline, useScrollTrigger } from '@material-ui/core';
import SwipeableViews from "react-swipeable-views";
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

import Search from "./components/Search";
import Geo from "./components/Geo";
import TabPanel from "./components/TabPanel";

//Handles sticky header
function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

function App(props) {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const classes = useStyles();

  const handleChangeTabs = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.page}>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar style={{backgroundColor: "black"}}>
          <Toolbar>
            <Typography variant="h6">Welcome</Typography>
          </Toolbar>
          <Paper style={{ width: "100%" }}>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChangeTabs}
              aria-label="disabled tabs example"
              variant="fullWidth"
            >
              <Tab label="Search" />
              <Tab label="Map" />
            </Tabs>
          </Paper>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Search />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Geo />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}

export default App;

const useStyles = makeStyles((theme) => ({
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 30,
  },
}));